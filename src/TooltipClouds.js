import React from 'react';

export function TooltipClouds ({tooltipData, xScale, yScale, innerHeight, innerWidth}) {
    if(tooltipData===null){
        return null;
    }
    return(
        <>
            <g className="tooltip" key={tooltipData.x+tooltipData.y} >
                <line y2={innerHeight}  strokeWidth="1" stroke={'red'} opacity={0.6} transform={`translate(${xScale(tooltipData.x)},0)`}/>
                <line x2={innerWidth}  strokeWidth="1" stroke={'red'} opacity={tooltipData.y ? 0.6 : 0} transform={`translate(0,${tooltipData.y ? yScale(tooltipData.y):innerHeight})`}/>
                <circle cx={xScale(tooltipData.x)} cy={yScale(tooltipData.y)} r={3} fill={'red'} opacity={tooltipData.y ? 1 : 0}/>
            </g>
        </>
    );
}