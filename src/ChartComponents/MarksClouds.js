import React from 'react'; 
import { area, extent, scaleTime, curveMonotoneX} from 'd3';

export function MarksClouds ({data, innerWidth, yScale}) {
    /* data = data.filter(element => 
        element.datetime.includes('00:00.000000')||
        element.datetime.includes('06:00.000000')||
        element.datetime.includes('12:00.000000')||
        element.datetime.includes('18:00.000000')); */

    data.forEach((element, index) =>{
        if (parseInt(element.cloudValue) >= 100){
            data[index].cloudValue = "100"
        }
    });
    const xValue = d => d.timestamp;
    const yValue = d => parseInt(d.cloudValue); 

    const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]); 

    return(
        <g className="marks">
            <path fill='white' opacity='0.8' stroke='white'
                d={area()
                    .curve(curveMonotoneX)
                    .x(d => xScale(xValue(d)))
                    .y1(d => yScale(yValue(d)))
                    .y0(d => yScale(0))(data)}
            />
        </g>
    ); 
};