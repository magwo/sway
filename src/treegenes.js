
function createGenes(options) {

  return _.defaults(options, {
    baseSize: 0.5,
    slimness: 0.7,
    crookedness: 0.7,
    stiffness: 0.7,
    branchCount: 2.4,
    leafSize: 30,
    flowerSize: 25,
    flowerFrequency: 0.1,
    barkColor: [62, 39, 4],
    leafColor: [62, 255, 4],
    flowerColor: [255, 201, 194],
  });
}


function getLinearDefaultDistribution(min, max, normalizedNum) {
  return min + (max - min) * normalizedNum;
}

function getQuadraticDistribution(min, max, normalizedNum) {
  return getLinearDefaultDistribution(min, max, normalizedNum * Math.abs(normalizedNum));
}

function clampColorVal(v) {
  return Math.round(Math.max(0.0, Math.min(255.0, v)));
}

function getRgbDeviation(r, g, b, maxAbsoluteDeviation, normalizedNums) {
  return [
    clampColorVal(getLinearDefaultDistribution(r - maxAbsoluteDeviation, r + maxAbsoluteDeviation, normalizedNums[0])),
    clampColorVal(getLinearDefaultDistribution(g - maxAbsoluteDeviation, g + maxAbsoluteDeviation, normalizedNums[1])),
    clampColorVal(getLinearDefaultDistribution(b - maxAbsoluteDeviation, b + maxAbsoluteDeviation, normalizedNums[2])),
  ]
}


function createRandomGenes(seed, lockedProps) {
  var random = new MersenneTwister(seed);
  // Pre-generate a bunch of randoms so that we don't mess up determinism between versions
  var randoms = _.times(30, function() { return random.realx() });

  return _.defaults(lockedProps, {
    baseSize: getLinearDefaultDistribution(0.4, 0.8, randoms[0]),
    slimness: getLinearDefaultDistribution(0.6, 1.4, randoms[1]),
    crookedness: getLinearDefaultDistribution(0.3, 1.7, randoms[2]),
    stiffness: getLinearDefaultDistribution(0.5, 1.0, randoms[3]),
    branchCount: getLinearDefaultDistribution(1.8, 4.0, randoms[4]),
    leafSize: getQuadraticDistribution(50, 150, randoms[5]),
    flowerSize: getQuadraticDistribution(40, 140, randoms[6]),
    flowerFrequency: getQuadraticDistribution(-0.2, 0.9, randoms[7]),
    barkColor: getRgbDeviation(90, 60, 20, 40, randoms.slice(10, 13)),
    leafColor: getRgbDeviation(62, 205, 4, 50, randoms.slice(13, 16)),
    flowerColor: getRgbDeviation(245, 221, 224, 100, randoms.slice(16, 19)),
  });
}

// TODO: Could do some kind of getMutatedGenes that mixes locked props and random
