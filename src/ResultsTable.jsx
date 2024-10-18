import PropTypes from 'prop-types';

ResultsTable.propTypes = {
  maxMinResults: PropTypes.shape({
    shear: PropTypes.number,
    positiveMoment: PropTypes.number,
    negativeMoment: PropTypes.number,
    deflection: PropTypes.number,
    lOver: PropTypes.number,
  }),
};

function ResultsTable({ maxMinResults }) {
  if (maxMinResults === null) {
    return (
      <div style={{
        width: '350px',
      }}>
        <b>Select a beam-load case combination to get started.</b>
      </div>
    );
  }

  return (
    <div>
      <b>Results</b>
      {maxMinResults.shear
        ? <OutputRow
          labelName={"Max Shear: "}
          result={maxMinResults.shear}
          units={"k"}
        />
        : ""}
      {maxMinResults.positiveMoment
        ? <OutputRow
          labelName={"Max Positive Moment: "}
          result={maxMinResults.positiveMoment}
          units={"k-ft"}
        />
        : ""}
      {maxMinResults.negativeMoment
        ? <OutputRow
          labelName={"Max Negative Moment: "}
          result={maxMinResults.negativeMoment}
          units={"k-ft"}
        />
        : ""}
      {maxMinResults.deflection
        ? <OutputRow
          labelName={"Max Deflection: "}
          result={maxMinResults.deflection}
          units={"in."}
        />
        : ""}
      {maxMinResults.lOver 
        ? <OutputRow
          labelName={"'L-over' Value: "}
          result={maxMinResults.lOver}
        />
        : ""} 
    </div>
  );
}

OutputRow.propTypes = {
  labelName: PropTypes.string,
  result: PropTypes.number,
  units: PropTypes.string,
};

function OutputRow({labelName, result, units=""}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <p>{labelName}</p>
      <p>{result.toFixed(4)} {units}</p>
    </div>
  );
}

export default ResultsTable;
