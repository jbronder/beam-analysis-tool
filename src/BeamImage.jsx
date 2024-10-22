import PropTypes from 'prop-types';
import blc1 from './assets/blc1.svg';
import blc5 from './assets/blc5.svg';
import blc7 from './assets/blc7.svg';
import blc12 from './assets/blc12.svg';
import blc13 from './assets/blc13.svg';
import blc15 from './assets/blc15.svg';
import blc23 from './assets/blc23.svg';
import blc24 from './assets/blc24.svg';
import './BeamImage.css';

BeamImage.propTypes = {
  selection: PropTypes.string,
};

function BeamImage({ selection }) {
  
  let imageBeam = null;
  switch(selection) {
  case '1':
    imageBeam = <img className="ImageContent" src={blc1}></img>;
    break;
  case '5':
    imageBeam = <img className="ImageContent" src={blc5}></img>;
    break;
  case '7':
    imageBeam = <img className="ImageContent" src={blc7}></img>;
    break;
  case '12':
    imageBeam = <img className="ImageContent" src={blc12}></img>;
    break;
  case '13':
    imageBeam = <img className="ImageContent" src={blc13}></img>;
    break;
  case '15':
    imageBeam = <img className="ImageContent" src={blc15}></img>;
    break;
  case '23':
    imageBeam = <img className="ImageContent" src={blc23}></img>;
    break;
  case '24':
    imageBeam = <img className="ImageContent" src={blc24}></img>;
    break;
  default:
    imageBeam = <div className="ImageContent">
      Oops! The beam image appears to be missing!
      </div>;
  }
  
  return imageBeam;
}

export default BeamImage;
