
function createGenes(options) {

  return _.defaults(options, {
    baseSize: 0.5,
    slimness: 0.7,
    straightness: 0.7,
    stiffness: 0.7,
    branchCount: 2.4,
    barkColor: [62, 39, 4],
    leafColor: [62, 255, 4],
    flowerColor: [255, 201, 194],
  });
}


function getLinearDefaultDistribution(min, max, normalizedNum) {
  return min + (max - min) * normalizedNum;
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
    slimness: getLinearDefaultDistribution(0.2, 1.0, randoms[1]),
    straightness: getLinearDefaultDistribution(0.2, 1.0, randoms[2]),
    stiffness: getLinearDefaultDistribution(0.2, 1.0, randoms[3]),
    branchCount: getLinearDefaultDistribution(1.8, 4.0, randoms[4]),
    barkColor: getRgbDeviation(62, 39, 4, 30, randoms.slice(10, 13)),
    leafColor: getRgbDeviation(62, 255, 4, 30, randoms.slice(13, 16)),
    flowerColor: getRgbDeviation(255, 201, 194, 30, randoms.slice(16, 19)),
  });
}

// TODO: Could do some kind of getMutatedGenes that mixes locked props and random