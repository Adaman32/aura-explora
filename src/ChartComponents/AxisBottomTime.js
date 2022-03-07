
export const AxisBottomTime = ({ xScale, innerHeight, tickFormat, tickOffset, numTicks}) =>
xScale.ticks(numTicks).map(tickValue => (
    <g className="ticks" key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
        <line y2={innerHeight} strokeDasharray= "5,5" strokeWidth="2"/>
        <text style={{textAnchor: 'middle'}} dy=".71em" y={innerHeight + tickOffset} fill='white' fontSize='0.6em' >
        {tickFormat(tickValue)}
        </text>
    </g>
)); 