import React from 'react';

export function TooltipClouds ({tooltipData, xScale, yScale, innerHeight, innerWidth}) {
    if(tooltipData===null){
        return null;
    }

    const noData = 'No cloud data';
    const cloudText = d => d + ' %  clouds';
    const textWidth = 75;
    const textHeight = 15;

    return(
        <>
            <g className="tooltip" key={tooltipData.x+tooltipData.y} >
                <line y2={innerHeight}  strokeWidth="1" stroke={'red'} opacity={0.6} transform={`translate(${xScale(tooltipData.x)},0)`}/>
                <line x2={innerWidth}  strokeWidth="1" stroke={'red'} opacity={tooltipData.y ? 0.6 : 0} transform={`translate(0,${tooltipData.y ? yScale(tooltipData.y):innerHeight})`}/>
                <circle cx={xScale(tooltipData.x)} cy={yScale(tooltipData.y)} r={3} fill={'red'} opacity={tooltipData.y ? 1 : 0}/>
                <g className="tooltip-text" transform={isNaN(tooltipData.y) ? `translate(${xScale(tooltipData.x)},0)`:`translate(${xScale(tooltipData.x)},${yScale(tooltipData.y)-2})`}>
                    <rect 
                        width={textWidth} 
                        height={textHeight} 
                        fill={'#100e26'} 
                        transform={xScale(tooltipData.x) > innerWidth/2 ? `translate(${-textWidth+3},${-textHeight+4})`:`translate(${-3},${-textHeight+4})`}
                        rx='5'/>
                    <text
                        className="tooltip-label"
                        textAnchor={xScale(tooltipData.x) > innerWidth/2 ? "end":"start"}
                        fill='white'
                        fontSize='0.8em'
                    >
                    {isNaN(tooltipData.y) ? noData : cloudText(tooltipData.y)}
                    </text> 
                </g>           
            </g>
        </>
    );
}

/* function TooltipText (xScale, yScale, innerWidth, tooltipData) {
    console.log(tooltipData)
    if(tooltipData){
        console.log("hej")
        return null;
    }
    if(tooltipData.y){
        console.log("data")

        return(
            
        );
    }else if(!tooltipData.y){
        console.log("no data")
        return(
            <text
                className="tooltip-label"
                textAnchor={xScale(tooltipData.x) > innerWidth/2 ? "end":"start"}
                transform={`translate(${xScale(tooltipData.x)},0)`}
                fill='white'
                fontSize='0.7em'
            >
            No cloud data
            </text>
        );
    }else{
        return null;
    }
} */