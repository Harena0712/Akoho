function toPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n / 100;
}

function sanitizeCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n));
}

function getNbResteOeuf(lotAtody, race) {
  const nbAtody = sanitizeCount(lotAtody?.nbAtody);
  const pourriRate = toPercent(race?.oeufPourri);
  return sanitizeCount(nbAtody * (1 - pourriRate));
}

function getNbMaleFemelle(race, nb, maleKey = 'male', femelleKey = 'femelle') {
  const base = sanitizeCount(nb);
  const maleRate = toPercent(race?.[maleKey]);
  const femelleRate = toPercent(race?.[femelleKey]);

  const nbMale = sanitizeCount(base * maleRate);
  const nbFemelle = sanitizeCount(base * femelleRate);

  return { nbMale, nbFemelle };
}

module.exports = {
  getNbResteOeuf,
  getNbMaleFemelle
};
