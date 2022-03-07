import React, { useState, useEffect, useRef } from "react";
import SunIcon from './images/sun.js';
import MoonIcon from "./images/moon.js";
import { AxisBottomTime } from "./ChartComponents/AxisBottomTime.js";
import { MarksClouds } from "./ChartComponents/MarksClouds.js";
import { AxisLeft } from "./ChartComponents/AxisLeft.js";
import { scaleLinear, scaleTime, timeFormat, timeHour } from 'd3';

export function DayLightTime({sunrise, sunset, location, width}){
    let sunriseFormatted = [];
    let sunsetFormatted = [];
    let afternoonCheck = [];

    if(sunrise) sunriseFormatted = sunrise.split(':');
    if(sunset) sunsetFormatted = sunset.split(':');
    if(sunset) afternoonCheck = sunsetFormatted[2].split(' ');

    if(afternoonCheck[1] === 'PM') sunsetFormatted[0] = (+sunsetFormatted[0]+12).toString();
    
    if(sunset && +sunsetFormatted[0] === 24) sunsetFormatted[0] = '0';

    if(sunrise){
      if(+sunriseFormatted[0] === 24) sunriseFormatted[0] = '0';
      if(sunriseFormatted[0].length === 1) sunriseFormatted[0] = '0'+sunriseFormatted[0];
    }

    return (
        <div className="divDaylight">
            <table width={width}>
            <tbody>
                <tr>
                  <th className="textDaylight" width="20%"><SunIcon /><span>Sunrise</span></th>
                  <th width="30%">{(sunrise && location) ? sunriseFormatted[0]+":"+sunriseFormatted[1] : '--:--'}</th>
                  <th className="textDaylight" width="20%"><MoonIcon /><span>Sunset</span></th>
                  <th width="30%">{(sunset && location) ? sunsetFormatted[0]+":"+sunsetFormatted[1]: '--:--'}</th>
                </tr>
            </tbody>
            </table>
            
            {/* <svg className="daylightScale" width={width} height={30} >
                <rect width={width} height={30} className="night"></rect>
                <rect width={widthSet} height={30} className="day"></rect>
                <rect width={widthRise} height={30} className="night"></rect>
            </svg>
            <div className="scaleLabels">
                <span style={{left: 15+"px"}} className="scaleLabelChildFour first">{"0:00"}</span>
                <span style={{left: widthRise+10+"px"}} className="scaleLabelChildFour middle">{"7:58"}</span>
                <span style={{left: widthSet+10+"px"}} className="scaleLabelChildFour middle">{"13:57"}</span>
                <span style={{left: width+"px"}} className="scaleLabelChildFour last">{"24:00"}</span>
            </div> */}
        </div>
        
        
    )
}

export function DayCloudTime({date, location, width, height}){

  const margin = {top:15, right:10, bottom: 30, left: 60};

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xAxisLabelOffset = 30;
  const yAxisLabelOffset = 35;

  const xAxisLabel = 'Time'; 
  const yAxisLabel = '% Cloud Coverage';

  const endTime = new Date(date);
  endTime.setHours(endTime.getHours() + 23);

  const xScale = scaleTime()
    .domain([date, endTime])
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0])
    .nice();

  function RenderCloudMarks () {
    if(location!==null){
      const locationDate = location.TotCloudCoverage.filter(d => d.datetime.includes(date.toLocaleDateString('en-CA')));
      return(
        <MarksClouds 
          data={locationDate} 
          innerWidth={innerWidth} 
          yScale={yScale}
        /> )
    }else{
      return null
    }
  };

  return( 
    <g width={width} height={height} transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottomTime
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={timeFormat('%H')}
            tickOffset={5}
            numTicks={timeHour.every(2)}
        />
        <text
            className="axis-label"
            transform={`translate(${innerWidth/2},${innerHeight+xAxisLabelOffset})`}
            textAnchor="start"
            fill='white'
            fontSize='0.7em'
        >
        {xAxisLabel}
        </text>
        <AxisLeft 
            yScale={yScale} 
            innerWidth={innerWidth} 
            tickOffset={5}
        />
        <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset+6},${innerHeight / 2}) rotate(-90)`}
            fill='white'
            fontSize='0.7em'
        >
        {yAxisLabel}
        </text>
        <RenderCloudMarks/>
    </g>)
};

