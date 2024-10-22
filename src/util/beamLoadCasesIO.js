/**
 * @fileoverview This file contains the input field objects that help populate
 * the user input fields for each beam-load case combination.
 */

/**
 * Returns input load labels and names to populate user input table.
 * @param {string} blcCase 
 * @return {Object[]}
 */
function getInputs(blcCase) {
  let specificInputs = [];

  switch (blcCase) {
    case '1':
    case '12':
    case '15':
    case '23':
      specificInputs = [
        {
          description: 'Uniform Load, w (k/ft): ',
          name: 'load',
        },
        {
          description: 'Length, L (ft): ',
          name: 'length',
        }
      ];
      break;
    case '7':
    case '13':
    case '24':
      specificInputs = [
        {
          description: 'Concentrated Load, P (k): ',
          name: 'load',
        },
        {
          description: 'Length, L (ft): ',
          name: 'length',
        }
      ];
      break;
    default:
      specificInputs = [
        {
          description: 'Load: ',
          name: 'load',
        },
        {
          description: 'Length: ',
          name: 'length',
        }
      ];
  }
  return specificInputs;
}

export {getInputs};
