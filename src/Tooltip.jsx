import {useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

Tooltip.propTypes = {
  children: PropTypes.node,
  svgX: PropTypes.number,
  svgY: PropTypes.number,
};

function Tooltip({ children, svgX, svgY }) {
  const ref = useRef(null);
  const [tooltipContentSize, setTooltipContentSize] = useState(null);

  useLayoutEffect(() => {
    const boundedBox = ref.current.getBBox();
    setTooltipContentSize(boundedBox);
  }, []);

  return (
    <TooltipContent 
      x={svgX}
      y={svgY}
      contentRef={ref}
    >
      {children}
    </TooltipContent>
  );
}

TooltipContent.propTypes = {
  children: PropTypes.node,
  x: PropTypes.number,
  y: PropTypes.number,
  contentRef: PropTypes.node,
};

function TooltipContent({children, x, y, contentRef}) {
  return (
    <g ref={contentRef} transform={`translate(${x}, ${y})`}>
      {children}
    </g>
  );
}

export default Tooltip;