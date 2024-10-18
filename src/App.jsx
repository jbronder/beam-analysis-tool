import { useState } from 'react'
import MomentPlot from './MomentPlot.jsx';
import ShearPlot from './ShearPlot.jsx';
import DeflectionPlot from './DeflectionPlot.jsx';
import Header from './Header.jsx';
import BeamImage from './BeamImage.jsx';
import ResultsTable from './ResultsTable.jsx';
import UserInputTable from './UserInputTable.jsx';
import { 
  calculateBeamLoadCombo, 
  generateSmdData,
} from  './util/beamLoadCalculator.js';
import './App.css'

function App() {
  const [blcSelection, setBlcSelect] = useState('');
  const [beamData, setBeamData] = useState({
    load: 0,
    length: 0,
    inertia: 0,
    elasticity: 0,
  });

  const results = calculateBeamLoadCombo(blcSelection, beamData);
  const smdData = generateSmdData(blcSelection, beamData, results, 250);
  console.log(smdData);

  return (
    <>
      <Header />
      <div className="MainContent">
          <div>
            <p>Shear Diagram, V (k)</p>
            <ShearPlot data={smdData} height={175}/>
            <p>Moment Diagram, M (k-ft)</p>
            <MomentPlot data={smdData} height={175}/>
          {(Number.isFinite(smdData[0].deflection) &&
            beamData.inertia !== 0 && 
            beamData.elasticity !== 0) &&
            <>
              <p>Deflection Diagram, Δ (in)</p>
              <DeflectionPlot data={smdData} height={175} />
            </>}
          </div>
        <div className="InputResultsContent">
          {blcSelection !== '' && <BeamImage selection={blcSelection} />}
          <br/>
          <UserInputTable
            blcKind={blcSelection}
            onComboSelect={setBlcSelect}
            beamInput={beamData}
            onBeamDataChange={setBeamData}
          />
          <br/>
          {(beamData.length < 0 || beamData.inertia < 0 || beamData.elasticity < 0)
            ? <p style={{color: 'red'}}>Please enter a positive number.</p>
            : <ResultsTable maxMinResults={results} />}
        </div>
      </div>
    </>
  );
}

export default App;
