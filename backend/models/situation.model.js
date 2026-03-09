const { getPool, sql } = require('../config/db');

// ── Fonctions utilitaires de calcul ──

/**
 * Nombre de poules restantes pour un lot à une date
 * nb restant = initial - morts
 */
function nbAkohoReste(lot, listLotMaty, date) {
  const d = new Date(date);
  const maty = listLotMaty
    .filter(m => m.idLot === lot.id && new Date(m.date) <= d)
    .reduce((s, m) => s + m.nbMaty, 0);
  return lot.nb - maty;
}

/**
 * Nombre total de morts pour un lot à une date
 */
function nbAkohoMaty(lot, listLotMaty, date) {
  const d = new Date(date);
  return listLotMaty
    .filter(m => m.idLot === lot.id && new Date(m.date) <= d)
    .reduce((s, m) => s + m.nbMaty, 0);
}

/**
 * Nombre de jours écoulés depuis l'enregistrement du lot
 */
function joursEcoules(lot, date) {
  const d1 = new Date(lot.date);
  const d2 = new Date(date);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

/**
 * Age total en jours = age initial (semaines * 7) + jours écoulés
 */
function ageTotalJours(lot, date) {
  return lot.age * 7 + joursEcoules(lot, date);
}

/**
 * Age total en semaines (précis, sans arrondi)
 * Ex: 3 semaines et 5 jours = 3.714...
 */
function ageTotalSemaines(lot, date) {
  return ageTotalJours(lot, date) / 7;
}

/**
 * Trouve la confSakafo correspondante (par race + age le plus proche <= age en semaines entières)
 */
function getConfSakafo(lot, listConfSakafo, date) {
  const ageSem = Math.floor(ageTotalSemaines(lot, date));
  const matching = listConfSakafo
    .filter(c => c.idRace === lot.idRace && c.age <= ageSem)
    .sort((a, b) => b.age - a.age);
  return matching.length > 0 ? matching[0] : null;
}

/**
 * Trouve la confSakafo pour une semaine donnée d'une race
 */
function getConfSakafoForWeek(idRace, semaine, listConfSakafo) {
  const matching = listConfSakafo
    .filter(c => c.idRace === idRace && c.age <= semaine)
    .sort((a, b) => b.age - a.age);
  return matching.length > 0 ? matching[0] : null;
}

/**
 * Calcul précis de la nourriture totale par poule depuis l'arrivée dans le lot.
 * On somme semaine par semaine (sakafoG = grammes par semaine) :
 *   - Chaque semaine complète : sakafoG de cette semaine
 *   - Jours restants (semaine partielle) : jours * (sakafoG de cette semaine / 7)
 */
function totalSakafoParPoule(lot, listConfSakafo, date) {
  const jours = joursEcoules(lot, date);
  if (jours <= 0) return 0;

  let total = 0;
  let joursRestants = jours;
  let semaine = lot.age; // semaine de départ

  while (joursRestants > 0) {
    const conf = getConfSakafoForWeek(lot.idRace, semaine, listConfSakafo);
    const sakafoSemaine = conf ? conf.sakafoG : 0;

    if (joursRestants >= 7) {
      // Semaine complète
      total += sakafoSemaine;
      joursRestants -= 7;
    } else {
      // Jours restants (semaine partielle) : jours * (sakafoG / 7)
      total += joursRestants * (sakafoSemaine / 7);
      joursRestants = 0;
    }
    semaine++;
  }

  return Math.round(total * 100) / 100;
}

/**
 * Poids total d'une poule à un âge donné en semaines.
 * variationPoid à age 0 = poids initial (naissance)
 * variationPoid à age N = gain total de la semaine N
 * Poids = somme de variationPoid de la semaine 0 à la semaine courante
 * Pour semaine partielle : gain proportionnel (jours / 7)
 */
function totalPoidsParPoule(idRace, ageSemaines, listConfSakafo) {
  if (ageSemaines < 0) return 0;

  const semainesCompletes = Math.floor(ageSemaines);
  const fraction = ageSemaines - semainesCompletes;

  let total = 0;
  for (let s = 0; s <= semainesCompletes; s++) {
    const conf = getConfSakafoForWeek(idRace, s, listConfSakafo);
    total += conf ? conf.variationPoid : 0;
  }

  // Gain proportionnel pour la semaine partielle
  if (fraction > 0) {
    const conf = getConfSakafoForWeek(idRace, semainesCompletes + 1, listConfSakafo);
    total += conf ? conf.variationPoid * fraction : 0;
  }

  return Math.round(total * 100) / 100;
}

/**
 * Poids actuel d'une poule = poids cumulé à l'âge actuel
 * Ex: S0=150, gain S1=30, gain S2=40 → poidsActuel à S2 = 150+30+40 = 220g
 */
function poidsActuel(lot, listConfSakafo, date) {
  return totalPoidsParPoule(lot.idRace, ageTotalSemaines(lot, date), listConfSakafo);
}

/**
 * Poids moyen d'une poule = moyenne des poids réels à chaque semaine
 *
 * Exemple (Rhode Island Red, age 2 semaines) :
 *   S0 = 150g (poids naissance)
 *   S1 = 150 + 30 = 180g
 *   S2 = 180 + 40 = 220g
 *   Poids moyen = (150 + 180 + 220) / 3 = 183.33g
 *
 * Avec semaine partielle (ex: 2.5 semaines) :
 *   S2.5 = 220 + 0.5 * 35 = 237.5g
 *   Poids moyen = (150 + 180 + 220 + 237.5) / 4 = 196.88g
 */
function poidsMoyenne(lot, listConfSakafo, date) {
  const ageSem = ageTotalSemaines(lot, date);
  if (ageSem <= 0) {
    return totalPoidsParPoule(lot.idRace, 0, listConfSakafo);
  }

  const semainesCompletes = Math.floor(ageSem);
  const fraction = ageSem - semainesCompletes;

  let poidsCourant = 0;
  let sumPoids = 0;
  let count = 0;

  // Poids réel à chaque semaine complète (S0, S1, ... Sn)
  for (let s = 0; s <= semainesCompletes; s++) {
    const conf = getConfSakafoForWeek(lot.idRace, s, listConfSakafo);
    poidsCourant += conf ? conf.variationPoid : 0;
    sumPoids += poidsCourant;
    count++;
  }

  // Semaine partielle
  if (fraction > 0) {
    const conf = getConfSakafoForWeek(lot.idRace, semainesCompletes + 1, listConfSakafo);
    poidsCourant += conf ? conf.variationPoid * fraction : 0;
    sumPoids += poidsCourant;
    count++;
  }

  return Math.round((sumPoids / count) * 100) / 100;
}

/**
 * Prix d'achat initial = nb * PU
 * Si PU = 0, le lot est issu d'éclosion (pas d'achat)
 */
function achatLotInit(lot) {
  return Math.round(lot.nb * lot.PU * 100) / 100;
}

/**
 * Prix nourriture = nb_poules_moyen * totalSakafoParPoule * puGg
 * nb moyen ≈ nb initial - morts/2
 * sakafoG = grammes par semaine, calculé précisément semaine par semaine
 */
function prixSakafo(lot, race, listLotMaty, listConfSakafo, date) {
  const maty = nbAkohoMaty(lot, listLotMaty, date);
  const nbMoyen = lot.nb - maty / 2;
  const totalSakafo = totalSakafoParPoule(lot, listConfSakafo, date);
  return Math.round(nbMoyen * totalSakafo * race.puGg * 100) / 100;
}

/**
 * Prix du lot = nbRestant * poidsActuel * pvGg
 * Utilise le poids actuel (pas le moyen) car on vend au poids réel
 */
function prixLot(lot, race, listLotMaty, listConfSakafo, date) {
  const nb = nbAkohoReste(lot, listLotMaty, date);
  const poids = poidsActuel(lot, listConfSakafo, date);
  return Math.round(nb * poids * race.pvGg * 100) / 100;
}

/**
 * Nombre total d'oeufs récoltés pour un lot à une date
 */
function nbAtody(lot, listLotAtody, date) {
  const d = new Date(date);
  return listLotAtody
    .filter(a => a.idLot === lot.id && new Date(a.date) <= d)
    .reduce((s, a) => s + a.nbAtody, 0);
}

/**
 * Valeur des oeufs = nbAtody * prixAtody
 */
function valeurAtody(lot, race, listLotAtody, date) {
  return Math.round(nbAtody(lot, listLotAtody, date) * race.prixAtody * 100) / 100;
}

/**
 * Bénéfice = prixLot + valeurAtody - achat - prixSakafo
 */
function benefice(prixLotVal, valeurAtodyVal, achatVal, prixSakafoVal) {
  return Math.round((prixLotVal + valeurAtodyVal - achatVal - prixSakafoVal) * 100) / 100;
}

// ── Modèle Situation ──

const Situation = {
  /**
   * Calcule la situation de tous les lots à une date donnée
   */
  async getByDate(date) {
    const pool = await getPool();

    // Récupérer toutes les données nécessaires
    const [lotsRes, racesRes, lotMatyRes, lotAtodyRes, confSakafoRes] = await Promise.all([
      pool.request().input('date', sql.Date, date).query('SELECT * FROM lot WHERE date <= @date'),
      pool.request().query('SELECT * FROM race'),
      pool.request().query('SELECT * FROM lotMaty'),
      pool.request().query('SELECT * FROM lotAtody'),
      pool.request().query('SELECT * FROM confSakafo'),
    ]);

    const listRace = racesRes.recordset;
    const listLotMaty = lotMatyRes.recordset;
    const listLotAtody = lotAtodyRes.recordset;
    const listConfSakafo = confSakafoRes.recordset;

    // Calculer la situation pour chaque lot
    return lotsRes.recordset.map(lot => {
      const race = listRace.find(r => r.id === lot.idRace);
      const nbReste = nbAkohoReste(lot, listLotMaty, date);
      const maty = nbAkohoMaty(lot, listLotMaty, date);
      const achat = achatLotInit(lot);
      const sakafo = prixSakafo(lot, race, listLotMaty, listConfSakafo, date);
      const poids = poidsMoyenne(lot, listConfSakafo, date);
      const prix = prixLot(lot, race, listLotMaty, listConfSakafo, date);
      const oeufs = nbAtody(lot, listLotAtody, date);
      const vAtody = valeurAtody(lot, race, listLotAtody, date);
      const benef = benefice(prix, vAtody, achat, sakafo);

      return {
        lotId: lot.id,
        lot: `LOT-${String(lot.id).padStart(3, '0')}`,
        race: race ? race.libelle : '',
        nb: nbReste,
        achat,
        prixSakafo: sakafo,
        maty,
        poidsMoyenne: poids,
        prixLot: prix,
        nbAtody: oeufs,
        valeurAtody: vAtody,
        benefice: benef
      };
    });
  },

  // Export des fonctions utilitaires pour tests ou réutilisation
  utils: {
    nbAkohoReste,
    nbAkohoMaty,
    achatLotInit,
    prixSakafo,
    poidsMoyenne,
    poidsActuel,
    prixLot,
    nbAtody,
    valeurAtody,
    benefice,
    joursEcoules,
    ageTotalJours,
    ageTotalSemaines,
    getConfSakafo,
    getConfSakafoForWeek,
    totalSakafoParPoule,
    totalPoidsParPoule
  }
};

module.exports = Situation;
