/**
 * @fileoverview This file contains the computations for generating results for
 * beam-load combinations.
 */

const BLC_COMBO = {
  ONE : '1',       // 'simple-beam-uniform-distributed-load', 1 AISC
  FIVE : '5',      // 'simple-beam-linear-increasing-uniform-load', 2 AISC
  SEVEN : '7',     // 'simple-beam-concentrated-load-at-center', 7 AISC
  TWELVE : '12',   // 'cantilever-beam-uniform-distributed-load', 19 AISC
  THIRTEEN : '13', // 'cantilever-beam-concentrated-load-at-free-end', 22 AISC
  FIFTEEN : '15',  // 'beam-pin-fixed-uniform-distributed-load', 12 AISC
  TWENTYTHREE :
      '23', // 'beam-fixed-at-both-ends-uniform-distributed-load', 15 AISC
  TWENTYFOUR :
      '24', // 'beam-fixed-at-both-ends-concentrated-load-at-center', 16 AISC
};

/**
 * Compute the main results for the beam-load combination given the beam input
 * features.
 * @param {string} blc
 * @param {Object} beamInput
 * @return {Object}
 */
function calculateBeamLoadCombo(blc, beamInput) {
  if (blc === '') {
    return null;
  }

  const {load, length, inertia, elasticity} = beamInput;
  let results = {};
  switch (blc) {
  case BLC_COMBO.ONE: // 'simple-beam-uniform-distributed-load'
    results.positiveMoment = load * (length ** 2) / 8.0;
    results.shear = load * length / 2.0;
    results.deflection = (5 / 384.0) * (load / 12.0) * ((length * 12) ** 4) *
                         (1 / inertia) * (1 / elasticity);
    break;
  case BLC_COMBO.FIVE: // 'simple-beam-linear-increasing-uniform-load'
    const totalLoad = (load * length * 0.5);
    results.positiveMoment = 0.128 * totalLoad * length;
    results.shear = (2 / 3) * totalLoad;
    results.deflection =
        0.01304 * totalLoad * ((length * 12) ** 3) / (inertia * elasticity);
    break;
  case BLC_COMBO.SEVEN: // 'simple-beam-concentrated-load-at-center'
    results.positiveMoment = load * length / 4.0;
    results.shear = load / 2.0;
    results.deflection =
        (load * ((length * 12) ** 3)) / (48 * inertia * elasticity);
    break;
  case BLC_COMBO.TWELVE: // 'cantilever-beam-uniform-distributed-load'
    results.negativeMoment = load * (length ** 2) / 2.0;
    results.shear = load * length;
    results.deflection =
        (load / 12.0) * ((length * 12.0) ** 4) / (8 * elasticity * inertia);
    break;
  case BLC_COMBO.THIRTEEN: // 'cantilever-beam-concentrated-load-at-free-end'
    results.negativeMoment = load * length;
    results.shear = load;
    results.deflection =
        load * ((length * 12) ** 3) / (3 * inertia * elasticity);
    break;
  case BLC_COMBO.FIFTEEN: // 'beam-pin-fixed-uniform-distributed-load'
    results.positiveMoment = (9 / 128.0) * (load * (length ** 2));
    results.negativeMoment = load * (length ** 2) / 8.0;
    results.shear = (5 / 8.0) * (load * length); // max shear @ fixed support
    results.deflection =
        ((load / 12.0) * ((length * 12) ** 4)) / (185.0 * inertia * elasticity);
    break;
  case BLC_COMBO
      .TWENTYTHREE: // 'beam-fixed-at-both-ends-uniform-distributed-load'
    results.positiveMoment = load * (length ** 2) / 24.0;
    results.negativeMoment = load * (length ** 2) / 12.0;
    results.shear = load * length / 2.0;
    results.deflection = (1 / 384.0) * (load / 12.0) * ((length * 12) ** 4) /
                         (inertia * elasticity);
    break;
  case BLC_COMBO
      .TWENTYFOUR: // 'beam-fixed-at-both-ends-concentrated-load-at-center'
    results.positiveMoment = load * length / 8.0;
    results.negativeMoment = load * length / 8.0;
    results.shear = load / 2.0;
    results.deflection =
        load * ((length * 12) ** 3) / (192.0 * inertia * elasticity);
    break;
  default:
    results = null;
    return results;
  }

  // return `results` early if user input does not contain E or I values
  if (!Number.isFinite(results.deflection)) {
    results.deflection = null;
    results.lOver = null;
    return results;
  }

  // Computing L-over result
  results.lOver = (1 / results.deflection) * length * 12;

  // double the L-over result if it's a cantilever condition
  switch (blc) {
  case BLC_COMBO.TWELVE:
  case BLC_COMBO.THIRTEEN:
    results.lOver *= 2;
  }
  return results;
}

/**
 * Generate continuous beam data to draw shear, moment, and deflection diagrams.
 * @param {string} blc
 * @param {Object} beamInput
 * @param {Object} results
 * @param {number} points
 * @return {Object[]}
 */
function generateSmdData(blc, beamInput, results, points) {
  let smdData = [];

  if (blc !== '' && beamInput.length <= 0) {
    smdData = [ {
      beamLength : 0.0,
      shear : 0.0,
      moment : 0.0,
      deflection : 0.0,
    } ];
    return smdData;
  }

  const xPoints = makeXRange(beamInput.length, points);
  switch (blc) {
  case BLC_COMBO.ONE:
    smdData = makeBlcOne(beamInput, xPoints);
    break;
  case BLC_COMBO.FIVE:
    smdData = makeBlcFive(beamInput, xPoints);
    break;
  case BLC_COMBO.SEVEN:
    smdData = makeBlcSeven(beamInput, xPoints);
    break;
  case BLC_COMBO.TWELVE:
    smdData = makeBlcTwelve(beamInput, xPoints);
    break;
  case BLC_COMBO.THIRTEEN:
    smdData = makeBlcThirteen(beamInput, xPoints);
    break;
  case BLC_COMBO.FIFTEEN:
    smdData = makeBlcFifteen(beamInput, xPoints);
    break;
  case BLC_COMBO.TWENTYTHREE:
    smdData = makeBlcTwentyThree(beamInput, xPoints);
    break;
  case BLC_COMBO.TWENTYFOUR:
    smdData = makeBlcTwentyFour(beamInput, xPoints);
    break;
  default:
    for (const xi of xPoints) {
      let smd = {
        beamLength : xi,
        shear : 0.0,
        moment : 0.0,
        deflection : 0.0,
      };
      smdData.push(smd);
    }
  }

  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case one.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcOne(beamInput, xPoints) {
  const smdData = [];
  for (const xi of xPoints) {
    const vi = beamInput.load * ((beamInput.length / 2.0) - xi)
    const mi = (beamInput.load * xi / 2.0) * (beamInput.length - xi);
    const di =
        (beamInput.load * xi) * (12 ** 3) *
        (beamInput.length ** 3 - 2 * beamInput.length * (xi ** 2) + xi ** 3) /
        (24 * beamInput.inertia * beamInput.elasticity);

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case five.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcFive(beamInput, xPoints) {
  const smdData = [];
  let totalLoad = beamInput.load * beamInput.length * 0.5;
  for (const xi of xPoints) {
    const vi = totalLoad * ((1 / 3.0) - ((xi ** 2) / (beamInput.length ** 2)))
    const mi = ((totalLoad * xi) / (3.0 * (beamInput.length ** 2))) *
               ((beamInput.length ** 2) - (xi ** 2));
    const di = (totalLoad * xi /
                (180.0 * beamInput.inertia * beamInput.elasticity *
                 (beamInput.length ** 2))) * (12 ** 3) *
               (3 * (xi ** 4) - (10 * (beamInput.length ** 2) * (xi ** 2)) +
                (7 * (beamInput.length ** 4)));

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection: di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case seven.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcSeven(beamInput, xPoints) {
  const smdData = [];

  const tempViStack = [];
  const tempMiStack = [];
  const tempDiStack = [];
  for (const xi of xPoints) {
    let vi = 0;
    let mi = 0;
    let di = 0;
    if (xi < beamInput.length / 2) {
      vi = beamInput.load / 2.0;
      mi = beamInput.load * xi / 2.0;
      di = (beamInput.load * xi) * (12.0 ** 3) *
           (3 * (beamInput.length ** 2) - (4 * (xi ** 2))) /
           (48.0 * beamInput.inertia * beamInput.elasticity);
      tempViStack.push(-vi);
      tempMiStack.push(mi);
      tempDiStack.push(di);
    } else {
      vi = tempViStack.pop();
      mi = tempMiStack.pop();
      di = tempDiStack.pop();
    }

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case twelve.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcTwelve(beamInput, xPoints) {
  const smdData = [];

  for (const xi of xPoints) {
    const vi = beamInput.load * xi;
    const mi = beamInput.load * (xi ** 2) / 2.0;
    const di = (beamInput.load * (12.0 ** 3)) *
               ((xi ** 4) - (4 * (beamInput.length ** 3) * xi) +
                (3 * (beamInput.length ** 4))) /
               (24 * beamInput.elasticity * beamInput.inertia)

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case
 * thirteen.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcThirteen(beamInput, xPoints) {
  const smdData = [];

  for (const xi of xPoints) {
    const vi = -beamInput.load;
    const mi = -beamInput.load * xi;
    const di = (beamInput.load * (12.0 ** 3) /
                (6 * beamInput.inertia * beamInput.elasticity)) *
               (2 * (beamInput.length ** 3) - 3 * (beamInput.length ** 2) * xi +
                (xi ** 3));
    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case fifteen.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @returns {Object[]}
 */
function makeBlcFifteen(beamInput, xPoints) {
  const smdData = [];
  const leftReaction = (3 * beamInput.load * beamInput.length) / 8.0;

  for (const xi of xPoints) {
    const vi = leftReaction - beamInput.load * xi;
    const mi = leftReaction * xi - (beamInput.load * (xi ** 2) / 2.0);
    const di = ((beamInput.load * xi) * (12.0 ** 3) *
                ((beamInput.length ** 3) - 3 * beamInput.length * (xi ** 2) +
                 (2 * (xi ** 3)))) /
               (48.0 * beamInput.inertia * beamInput.elasticity);

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case
 * twenty-three.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcTwentyThree(beamInput, xPoints) {
  const smdData = [];

  for (const xi of xPoints) {
    const vi = beamInput.load * ((beamInput.length / 2.0) - xi);
    const mi =
        (beamInput.load / 12.0) *
        (6 * beamInput.length * xi - (beamInput.length ** 2) - (6 * (xi ** 2)));
    const di = (beamInput.load * (xi ** 2) * (12.0 ** 3) /
                (24 * beamInput.inertia * beamInput.elasticity)) *
               ((beamInput.length - xi) ** 2);

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };
    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate shear, moment, and deflection beam data for beam-load case
 * twenty-four.
 * @param {Object} beamInput
 * @param {number[]} xPoints
 * @return {Object[]}
 */
function makeBlcTwentyFour(beamInput, xPoints) {
  const smdData = [];

  const tempViStack = [];
  const tempMiStack = [];
  const tempDiStack = [];
  for (const xi of xPoints) {
    let vi = 0;
    let mi = 0;
    let di = 0;
    if (xi < beamInput.length / 2) {
      vi = beamInput.load / 2.0;
      mi = (beamInput.load / 8.0) * (4 * xi - beamInput.length);
      di = ((beamInput.load * (xi ** 2) * (12.0 ** 3)) /
            (48.0 * beamInput.inertia * beamInput.elasticity)) *
           (3 * beamInput.length - 4 * xi);
      tempViStack.push(-vi);
      tempMiStack.push(mi);
      tempDiStack.push(di);
    } else {
      vi = tempViStack.pop();
      mi = tempMiStack.pop();
      di = tempDiStack.pop();
    }

    const smd = {
      beamLength : xi,
      shear : vi,
      moment : mi,
      deflection : di,
    };

    smdData.push(smd);
  }
  return smdData;
}

/**
 * Generate beam length data at `points` number of intervals.
 * @param {number} beamLength
 * @param {number} points
 * @return {number[]}
 */
function makeXRange(beamLength, points) {
  const x = new Array(points);
  const delta = beamLength / points;
  let xi = 0;
  for (let i = 0; i < x.length; ++i) {
    x[i] = xi;
    // update step
    xi += delta;
    if (xi > beamLength) {
      xi = beamLength;
    }
  }
  return x;
}

export {calculateBeamLoadCombo, generateSmdData};
