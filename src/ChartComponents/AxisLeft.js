export const AxisLeft = ({ yScale, innerWidth, tickOffset }) =>
yScale.ticks().map((tickValue)=> (
  <g className="ticks" key={tickValue} transform={`translate(0,${yScale(tickValue)})`}>
    
    <line x2={innerWidth} stroke='white' opacity='0.3' strokeDasharray= "2.5,2.5" strokeWidth="1"/>
    <text  style={{ textAnchor: 'end' }} x={-tickOffset} dy=".32em" fill='white' fontSize='0.6em'>
      {tickValue}
    </text>
  </g>
)); 