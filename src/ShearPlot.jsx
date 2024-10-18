import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip.jsx';

ShearPlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    beamLength: PropTypes.number,
    shear: PropTypes.number,
    moment: PropTypes.number,
    deflection: PropTypes.number,
  })),
  width: PropTypes.number,
  height: PropTypes.number,
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
};

function ShearPlot({ 
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
}) {
  const gx = useRef(null);
  const gy = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);

  const x = d3.scaleLinear(d3.extent(data, d => d.beamLength), [marginLeft, width-marginRight]);
  const y = d3.scaleLinear(d3.extent(data, d => d.shear), [height-marginBottom, marginTop]).nice();
  const line = d3.line()
    .x(d => x(d.beamLength))
    .y(d => y(d.shear));

  useEffect(() => {
    let steps = 0;
    let tickDelta = 0;
    if (y.ticks().length > 1) {
      tickDelta = (height-marginBottom-marginTop) / (y.ticks().length-1);
      steps = y.ticks().indexOf(0);
    }
    d3.select(gx.current)
        .attr("transform", `translate(0, ${height-marginBottom-(steps*tickDelta)})`)
        .call(d3.axisBottom(x))

  }, [gx, x, y]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  function handlePointerLeave() { setTooltipData(null); }

  function handlePointerEnterMove(evt) {
    const bisect = d3.bisector(d => d.beamLength).center;
    const i = bisect(data, x.invert(d3.pointer(evt)[0]));
    setTooltipData({
      beamLength: data[i].beamLength,
      shear: data[i].shear, 
    });
  }

  return (
    <svg width={width} height={height}
      style={{overflow: 'visible'}}
      onPointerEnter={handlePointerEnterMove}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerEnterMove}
    >
      <g ref={gx} />
      <g ref={gy} transform={`translate(${marginLeft}, 0)`} />
      <g stroke="currentColor" strokeOpacity="0.15">
        {x.ticks().map((t, id) => (
          <line key={id} x1={x(t)} y1={marginTop} x2={x(t)} y2={height-marginBottom}></line>
        ))}
        {y.ticks().map((t, id) => (
          <line key={id} x1={marginLeft} y1={y(t)} x2={width-marginRight} y2={y(t)}></line>
        ))}
      </g>
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
      {(tooltipData !== null) && (
        <Tooltip
          svgX={x(tooltipData.beamLength)}
          svgY={y(tooltipData.shear)}
        >
          <circle r={4} fill="white"></circle>
          <text style={{
            font: '11px sans-serif',
            fill: 'white',
          }}
          >
            <tspan x="1em" y="1.1em">{`Length: ${tooltipData.beamLength.toFixed(2)} ft`}</tspan>
            <tspan x="1em" y="2.2em">{`Shear: ${tooltipData.shear.toFixed(3)} k`}</tspan>
          </text>
        </Tooltip>
      )}
    </svg>
  );
}

export default ShearPlot;
