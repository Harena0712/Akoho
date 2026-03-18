const { getPool, sql } = require('../config/db');
const ConfSakafo = require('./confSakafo.model');

const DAY_MS = 1000 * 60 * 60 * 24;

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

function addDays(date, days) {
  const result = new Date(toDate(date));
  result.setDate(result.getDate() + days);
  return result;
}

function getPoidsDateDebut(lot) {
  return addDays(lot.date, -(lot.age * 7));
}

function buildRaceMap(listRace) {
  return new Map(listRace.map(race => [race.id, race]));
}

function buildSumByLot(list, date, valueKey) {
  const targetDate = toDate(date);
  const sums = new Map();

  for (const item of list) {
    if (toDate(item.date) > targetDate) continue;
    sums.set(item.idLot, (sums.get(item.idLot) || 0) + item[valueKey]);
  }

  return sums;
}

function buildAtodyDisponibleByLot(listLotAtody, listIncubation, date) {
  const targetDate = toDate(date);
  const eclosMap = new Map();

  for (const incubation of listIncubation) {
    if (toDate(incubation.date) > targetDate) continue;
    const lotAtodyId = incubation.idLotAtody;
    const current = eclosMap.get(lotAtodyId);
    if (!current || toDate(incubation.date) < current) {
      eclosMap.set(lotAtodyId, toDate(incubation.date));
    }
  }

  const sums = new Map();

  for (const lotAtody of listLotAtody) {
    if (toDate(lotAtody.date) > targetDate) continue;

    const eclosDate = eclosMap.get(lotAtody.id);
    if (eclosDate && eclosDate <= targetDate) {
      continue;
    }

    sums.set(lotAtody.idLot, (sums.get(lotAtody.idLot) || 0) + lotAtody.nbAtody);
  }

  return sums;
}

function buildConfLookup(listConfSakafo, maxWeek) {
  const grouped = new Map();

  for (const conf of listConfSakafo) {
    if (!grouped.has(conf.idRace)) {
      grouped.set(conf.idRace, []);
    }
    grouped.get(conf.idRace).push(conf);
  }

  const byRace = new Map();

  for (const [idRace, confs] of grouped.entries()) {
    const ordered = confs.slice().sort((a, b) => a.age - b.age);
    const lastAge = ordered.length > 0 ? ordered[ordered.length - 1].age : 0;
    const lookupMaxWeek = Math.max(maxWeek, lastAge + 1);
    const byWeek = new Array(lookupMaxWeek + 1).fill(null);
    const prefixVariation = new Array(lookupMaxWeek + 1).fill(0);
    const prefixSakafo = new Array(lookupMaxWeek + 1).fill(0);

    let confIndex = 0;
    let currentConf = null;

    for (let week = 0; week <= lookupMaxWeek; week++) {
      while (confIndex < ordered.length && ordered[confIndex].age <= week) {
        currentConf = ordered[confIndex];
        confIndex++;
      }

      byWeek[week] = currentConf;
      const variation = currentConf ? currentConf.variationPoid : 0;
      const sakafo = currentConf ? currentConf.sakafoG : 0;

      prefixVariation[week] = variation + (week > 0 ? prefixVariation[week - 1] : 0);
      prefixSakafo[week] = sakafo + (week > 0 ? prefixSakafo[week - 1] : 0);
    }

    byRace.set(idRace, { byWeek, prefixVariation, prefixSakafo });
  }

  return { byRace, maxWeek };
}

function getLookupEntry(idRace, confLookup) {
  return confLookup && confLookup.byRace ? confLookup.byRace.get(idRace) : null;
}

function getCumulativeValue(prefixValues, week) {
  if (!prefixValues || prefixValues.length === 0 || week < 0) return 0;
  const boundedWeek = Math.min(week, prefixValues.length - 1);
  return prefixValues[boundedWeek] || 0;
}

function getConfForWeekFromLookup(idRace, semaine, confLookup) {
  const entry = getLookupEntry(idRace, confLookup);
  if (!entry || entry.byWeek.length === 0 || semaine < 0) return null;
  return entry.byWeek[Math.min(semaine, entry.byWeek.length - 1)] || null;
}

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
  const d1 = toDate(lot.date);
  const d2 = toDate(date);
  return Math.floor((d2 - d1) / DAY_MS);
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
  if (listConfSakafo && listConfSakafo.byRace) {
    return getConfForWeekFromLookup(idRace, semaine, listConfSakafo);
  }

  let best = null;
  for (const conf of listConfSakafo) {
    if (conf.idRace === idRace && conf.age <= semaine && (!best || conf.age > best.age)) {
      best = conf;
    }
  }
  return best;
}

/**
 * Calcul précis de la nourriture totale par poule depuis l'arrivée dans le lot.
 * La ration consommée pendant une semaine d'age Sx est celle configurée pour Sx+1.
 * Ex: un lot arrive a S0, pendant ses 7 premiers jours sur place il consomme la ration S1.
 * Les semaines partielles sont calculees au prorata: jours * (sakafoG semaine suivante / 7).
 */
function totalSakafoParPoule(lot, listConfSakafo, date) {
  const jours = joursEcoules(lot, date);
  if (jours <= 0) return 0;

  if (listConfSakafo && listConfSakafo.byRace) {
    const entry = getLookupEntry(lot.idRace, listConfSakafo);
    const semainesCompletes = Math.floor(jours / 7);
    const joursPartiels = jours % 7;
    const semaineDepart = lot.age + 1;
    const semaineFin = semaineDepart + semainesCompletes - 1;

    let total = 0;
    if (semainesCompletes > 0) {
      const totalFin = getCumulativeValue(entry?.prefixSakafo, semaineFin);
      const totalAvant = getCumulativeValue(entry?.prefixSakafo, semaineDepart - 1);
      total += totalFin - totalAvant;
    }

    if (joursPartiels > 0) {
      const conf = getConfSakafoForWeek(lot.idRace, semaineDepart + semainesCompletes, listConfSakafo);
      total += joursPartiels * ((conf ? conf.sakafoG : 0) / 7);
    }

    return total;
  }

  let total = 0;
  let joursRestants = jours;
  let semaine = lot.age + 1;

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

  // return Math.round(total * 100) / 100;
  return total;
}

function totalSakafoLotAvecMortalite(lot, listLotMaty, listConfSakafo, date) {
  const dateCreation = toDate(lot.date);
  const dateCible = toDate(date);

  if (dateCible <= dateCreation || lot.nb <= 0) return 0;

  const mortsParDate = listLotMaty
    .filter(m => m.idLot === lot.id)
    .map(m => ({
      date: toDate(m.date),
      nbMaty: m.nbMaty
    }))
    .filter(m => m.date <= dateCible)
    .sort((a, b) => a.date - b.date);

  let nbVivants = lot.nb;
  let dateDebutSegment = dateCreation;
  let totalSakafoLot = 0;

  for (const mort of mortsParDate) {
    if (nbVivants <= 0) break;

    if (mort.date > dateDebutSegment) {
      const sakafoDebut = totalSakafoParPoule(lot, listConfSakafo, dateDebutSegment);
      const sakafoFin = totalSakafoParPoule(lot, listConfSakafo, mort.date);
      const sakafoSegmentParPoule = Math.max(0, sakafoFin - sakafoDebut);
      totalSakafoLot += nbVivants * sakafoSegmentParPoule;
    }

    nbVivants = Math.max(0, nbVivants - mort.nbMaty);
    dateDebutSegment = mort.date;
  }

  if (nbVivants > 0 && dateCible > dateDebutSegment) {
    const sakafoDebut = totalSakafoParPoule(lot, listConfSakafo, dateDebutSegment);
    const sakafoFin = totalSakafoParPoule(lot, listConfSakafo, dateCible);
    const sakafoSegmentParPoule = Math.max(0, sakafoFin - sakafoDebut);
    totalSakafoLot += nbVivants * sakafoSegmentParPoule;
  }

  return totalSakafoLot;
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

  if (listConfSakafo && listConfSakafo.byRace) {
    let total = getCumulativeValue(getLookupEntry(idRace, listConfSakafo)?.prefixVariation, semainesCompletes);

    if (fraction > 0) {
      const conf = getConfSakafoForWeek(idRace, semainesCompletes + 1, listConfSakafo);
      total += conf ? conf.variationPoid * fraction : 0;
    }

    // return Math.round(total * 100) / 100;
    return total;
  }

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

  // return Math.round(total * 100) / 100;
  return total;
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

  if (listConfSakafo && listConfSakafo.byRace) {
    const entry = getLookupEntry(lot.idRace, listConfSakafo);

    for (let s = 0; s <= semainesCompletes; s++) {
      const cumul = getCumulativeValue(entry?.prefixVariation, s);
      sumPoids += cumul;
      count++;
    }

    if (fraction > 0) {
      const poidsBase = getCumulativeValue(entry?.prefixVariation, semainesCompletes);
      const conf = getConfSakafoForWeek(lot.idRace, semainesCompletes + 1, listConfSakafo);
      sumPoids += poidsBase + (conf ? conf.variationPoid * fraction : 0);
      count++;
    }

    // return Math.round((sumPoids / count) * 100) / 100;
    return sumPoids / count;
  }

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

  // return Math.round((sumPoids / count) * 100) / 100;
  return sumPoids / count;
}

/**
 * Prix d'achat initial = nb * PU
 * Si PU = 0, le lot est issu d'éclosion (pas d'achat)
 */
function achatLotInit(lot) {
  // return Math.round(lot.nb * lot.PU * 100) / 100;
  return lot.nb * lot.PU;
}

/**
 * Prix nourriture = nb_poules_moyen * totalSakafoParPoule * puGg
 * nb moyen ≈ nb initial - morts/2
 * sakafoG = grammes par semaine, calculé précisément semaine par semaine
 */
function prixSakafo(lot, race, listLotMaty, listConfSakafo, date) {
  if (!race) return 0;
  const totalSakafoLot = totalSakafoLotAvecMortalite(lot, listLotMaty, listConfSakafo, date);
  // return Math.round(totalSakafoLot * race.puGg * 100) / 100;
  return totalSakafoLot * race.puGg;
}

/**
 * Prix du lot = nbRestant * poidsActuel * pvGg
 * Utilise le poids actuel (pas le moyen) car on vend au poids réel
 */
async function prixLot(lot, race, listLotMaty, listConfSakafo, date) {
  const nb = nbAkohoReste(lot, listLotMaty, date);
  const poidsInfo = await ConfSakafo.getPoidsAkoho(lot.idRace, getPoidsDateDebut(lot), date);
  const poids = poidsInfo.poids;
  // console.log(`Calcul prixLot pour Lot ${lot.id} - nb: ${nb}, poids: ${poids}, pvGg: ${race.pvGg}, prixLot: ${nb * poids * race.pvGg}`);
  return {
    prix: nb * poids * race.pvGg,
    poids
  };
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
  // return Math.round(nbAtody(lot, listLotAtody, date) * race.prixAtody * 100) / 100;
  return nbAtody(lot, listLotAtody, date) * race.prixAtody;

}

/**
 * Pour les lots issus d'éclosion (PU=0), estimer les oeufs pourris initiaux
 * à partir du taux race.oeufPourri et du nombre de poussins viables (lot.nb).
 */
function infoOeufsPourriPourLotEclos(lot, race) {
  if (!race || Number(lot.PU) !== 0) {
    return { nbOeufsPourri: 0, valeurOeufsPourri: 0 };
  }

  const tauxPourri = (Number(race.oeufPourri) || 0) / 100;
  if (tauxPourri <= 0 || tauxPourri >= 1) {
    return { nbOeufsPourri: 0, valeurOeufsPourri: 0 };
  }

  const nbViables = Number(lot.nb) || 0;
  const nbTotalOeufs = Math.round(nbViables / (1 - tauxPourri));
  const nbOeufsPourri = Math.max(0, nbTotalOeufs - nbViables);
  const valeurOeufsPourri = nbOeufsPourri * (Number(race.prixAtody) || 0);

  return { nbOeufsPourri, valeurOeufsPourri };
}

/**
 * Bénéfice = prixLot + valeurAtody - achat - prixSakafo
 */
function benefice(prixLotVal, valeurAtodyVal, achatVal, prixSakafoVal) {
  // return Math.round((prixLotVal + valeurAtodyVal - achatVal - prixSakafoVal) * 100) / 100;
  return prixLotVal + valeurAtodyVal - achatVal - prixSakafoVal;
}

// ── Modèle Situation ──

const Situation = {
  /**
   * Calcule la situation de tous les lots à une date donnée
   */
  async getByDate(date) {
    const pool = await getPool();
    const targetDate = toDate(date);

    // Récupérer toutes les données nécessaires
    const [lotsRes, racesRes, lotMatyRes, lotAtodyRes, confSakafoRes, incubationRes] = await Promise.all([
      pool.request().input('date', sql.Date, date).query('SELECT * FROM lot WHERE date <= @date'),
      pool.request().query('SELECT * FROM race'),
      pool.request().query('SELECT * FROM lotMaty'),
      pool.request().query('SELECT * FROM lotAtody'),
      pool.request().query('SELECT * FROM confSakafo'),
      pool.request().query('SELECT idLotAtody, date FROM incubation'),
    ]);

    const listRace = racesRes.recordset;
    const listLotMaty = lotMatyRes.recordset;
    const listLotAtody = lotAtodyRes.recordset;
    const listConfSakafo = confSakafoRes.recordset;
    const listIncubation = incubationRes.recordset;
    const lots = lotsRes.recordset;

    const raceMap = buildRaceMap(listRace);
    const matyByLot = buildSumByLot(listLotMaty, targetDate, 'nbMaty');
    const atodyByLot = buildAtodyDisponibleByLot(listLotAtody, listIncubation, targetDate);
    const maxWeek = lots.reduce((max, lot) => {
      const jours = Math.floor((targetDate - toDate(lot.date)) / DAY_MS);
      const ageSemaines = lot.age + (jours / 7);
      return Math.max(max, Math.floor(ageSemaines) + 1);
    }, 0);
    const confLookup = buildConfLookup(listConfSakafo, maxWeek);

    // Calculer la situation pour chaque lot
    return Promise.all(lots.map(async (lot) => {
      const race = raceMap.get(lot.idRace);
      const maty = matyByLot.get(lot.id) || 0;
      const nbReste = lot.nb - maty;
      const achat = achatLotInit(lot);
      const sakafo = prixSakafo(lot, race, listLotMaty, confLookup, date);
      
      const lotPrixInfo = race
        ? await prixLot(lot, race, listLotMaty, confLookup, date)
        : { prix: 0, poids: 0 };
      // console.log(`Lot ${lot.id} - prixLot: ${lotPrixInfo.prix}, poids pour prixLot: ${lotPrixInfo.poids}`);
      const poidsParPoule = lotPrixInfo.poids;
      const prix = lotPrixInfo.prix;
      const oeufs = atodyByLot.get(lot.id) || 0;
      const vAtody = oeufs * (race ? race.prixAtody : 0);
      const oeufsPourriInfo = infoOeufsPourriPourLotEclos(lot, race);
      const benef = benefice(prix, vAtody, achat, sakafo) - oeufsPourriInfo.valeurOeufsPourri;

      return {
        lotId: lot.id,
        lot: `LOT-${String(lot.id).padStart(3, '0')}`,
        race: race ? race.libelle : '',
        nb: nbReste,
        achat,
        prixSakafo: sakafo,
        maty,
        poidsMoyenne: poidsParPoule,
        prixLot: prix,
        nbAtody: oeufs,
        valeurAtody: vAtody,
        nbOeufsPourri: oeufsPourriInfo.nbOeufsPourri,
        valeurOeufsPourri: oeufsPourriInfo.valeurOeufsPourri,
        benefice: benef
      };
    }));
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
    infoOeufsPourriPourLotEclos,
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
