import * as Popover from '@radix-ui/react-popover';
import PropTypes from 'prop-types';
import './Header.css';

function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <h2>Beam Analysis Tool</h2>
      <div>
        <FaqPopover faqLabel={"What's this tool do?"}>
          {`This is a calculator for structural design and analysis of common
        beam-load combinations. It generates shear, moment, and deflection
        diagrams (i.e. beam diagrams) for a given load, beam length, moment of
        inertia, and modulus of elasticity.`}
        </FaqPopover>
        <FaqPopover faqLabel={"What is a beam diagram?"}>
          {`Beam diagrams, colloquially known as "shear, moment, and
        deflection diagrams", graph the magnitude of internal forces
        (shear, moment) along the beam's length when external forces such
        as uniform loads and point loads are applied to the beam.`}
        </FaqPopover>
        <FaqPopover faqLabel={"When to use one?"}>
          Common scenarios to use a beam diagram:
          <ul>
            <li>
              Obtain a quick calculation for sizing a beam to resist the maximum
              shear and moment demands
            </li>
            <li>
              {`Determining the shear, moment, and deflection at a certain
              location and checking the beam's capacity at that location`}
            </li>
          </ul>
        </FaqPopover>
        <FaqPopover faqLabel={`**DISCLAIMER**`}>
          The intent of <b>this web app is for educational purposes and is a
          prototype</b> exploring the use of D3.js and React to produce a
          structural analysis web application. <b>This tool is NOT intended to
          replace structural design software or the services of a qualified,
          registered design professional working on a design project</b>.  Use
          of this software as a basis of design is done so at your own risk.
        </FaqPopover>
      </div>
    </header>
  );
}

FaqPopover.propTypes = {
  faqLabel: PropTypes.string,
  children: PropTypes.node,
};

function FaqPopover({ faqLabel, children }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>
          {faqLabel}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="PopoverContent">
          {children}
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default Header;
