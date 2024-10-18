import { Fragment } from 'react';
import * as Label from '@radix-ui/react-label';
import PropTypes from 'prop-types';
import BeamLoadComboBox from './BeamLoadComboBox.jsx';
import { getInputs } from './util/beamLoadCasesIO.js';

UserInputTable.propTypes = {
  blcKind: PropTypes.string,
  onComboSelect: PropTypes.func,
  beamInput: PropTypes.shape({
    load: PropTypes.number,
    length: PropTypes.number,
    inertia: PropTypes.number,
    elasticity: PropTypes.number,
  }),
  onBeamDataChange: PropTypes.func,
};

function UserInputTable({ blcKind, onComboSelect, beamInput, onBeamDataChange }) {
  let requiredFields = getInputs(blcKind);

  const loadCaseSpecificInputs = requiredFields.map(input => {
    return (
      <Fragment key={input.name}>
        <InputField
          labelName={input.description}
          inputName={input.name}
          currentBeamInput={beamInput}
          onInputChange={onBeamDataChange}
        />
      </Fragment>
    );
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 'max-content',
    }}>
      <b>Beam Input Data</b>
      <BeamLoadComboBox 
        onComboSelect={onComboSelect}
      />
      {(blcKind !== '') && loadCaseSpecificInputs }
      {blcKind !== '' && 
        <>
          <InputField
            labelName={"Moment Of Inertia, I (in^4): "}
            inputName={"inertia"}
            currentBeamInput={beamInput}
            onInputChange={onBeamDataChange}
          />
          <InputField
            labelName={"Modulus of Elasticity, E (ksi): "}
            inputName={"elasticity"}
            currentBeamInput={beamInput}
            onInputChange={onBeamDataChange}
          />
        </>}
    </div>
  );
}

InputField.propTypes = {
  labelName: PropTypes.string,
  inputName: PropTypes.string,
  currentBeamInput: PropTypes.shape({
    load: PropTypes.number,
    length: PropTypes.number,
    inertia: PropTypes.number,
    elasticity: PropTypes.number,
  }),
  onInputChange: PropTypes.func,
};

function InputField({labelName, inputName, currentBeamInput, onInputChange }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
    }}>
      <Label.Root>{labelName}</Label.Root>
      <input type="number" name={inputName} onChange={(evt) => {
        onInputChange({
          ...currentBeamInput,
          [evt.target.name]: parseFloat(evt.target.value),
        })}}
      />
    </div>
  );
}

export default UserInputTable;