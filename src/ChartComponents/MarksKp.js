import React from 'react';
import { scaleBand } from 'd3';

export function MarksKp ({data, innerWidth, innerHeight, yScale}) {

    const xValue = d => new Date(d.date);
    const yValue = d => d.kp;
    
    const xScale = scaleBand()
        .domain(data.map(xValue))
        .range([0, innerWidth])
        .paddingInner(0.55)
        .paddingOuter(0.27)
        .align(0.5);

        function setColorOfMarks(value){
            if(+value.kp >= 0.0 && +value.kp < 2.0) return '#2166ac'; 
            if(+value.kp >= 2.0 && +value.kp < 3.0) return '#67a9cf'; 
            if(+value.kp >= 3.0 && +value.kp < 4.0) return '#dae5f0'; 
            if(+value.kp >= 4.0 && +value.kp < 5.0) return '#fee090'; 
            if(+value.kp >= 5.0 && +value.kp < 6.0) return '#fc8d59'; 
            if(+value.kp >= 6.0) return '#d73027'; 
            // if(value.kp >= 6) return 'blue'; 
        }
    
    return( 
        data.map((d) => (
            <g key={d.kp+d.date}>
                <rect 
                    className="markKp"
                    key={xValue(d)}
                    fill={setColorOfMarks(d)}
                    x={xScale(xValue(d))}
                    y={yScale(yValue(d))}
                    width={xScale.bandwidth()}
                    height={innerHeight - yScale(yValue(d))}>
                </rect>
                <text
                    fontFamily='Helvetica'
                    fontSize={window.innerWidth < 1500 ? '1vw' : '12pt'}
                    fill={setColorOfMarks(d)} 
                    x={xScale(xValue(d))}
                    y={yScale(yValue(d))-10}>{d.kp}</text>
            </g>
            
        ))
    );
};