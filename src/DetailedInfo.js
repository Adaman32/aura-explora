import React, { useState, useEffect, useRef } from "react";
import SunIcon from './images/sun.js';
import MoonIcon from "./images/moon.js";
import { AxisBottomTime } from "./ChartComponents/AxisBottomTime.js";
import { MarksClouds } from "./ChartComponents/MarksClouds.js";
import { AxisLeft } from "./ChartComponents/AxisLeft.js";
import { scaleLinear, scaleTime, timeFormat, timeHour, select, pointer, bisector } from 'd3';
import { TooltipClouds } from "./TooltipClouds.js";

export function DayLightTime({ sunrise, sunset, location, width }) {
  let sunriseFormatted = [];
  let sunsetFormatted = [];
  let afternoonCheck = [];

  if (sunrise) sunriseFormatted = sunrise.split(':');
  if (sunset) sunsetFormatted = sunset.split(':');
  if (sunset) afternoonCheck = sunsetFormatted[2].split(' ');

  if (afternoonCheck[1] === 'PM') sunsetFormatted[0] = (+sunsetFormatted[0] + 12).toString();

  if (sunset && +sunsetFormatted[0] === 24) sunsetFormatted[0] = '0';

  if (sunrise) {
    if (+sunriseFormatted[0] === 24) sunriseFormatted[0] = '0';
    if (sunriseFormatted[0].length === 1) sunriseFormatted[0] = '0' + sunriseFormatted[0];
  }

  return (
    <div className="divDaylight">
      <div className="daylight">
        <div>
          <SunIcon />
          <text className="infoDaylight">{(sunrise && location) ? sunriseFormatted[0] + ":" + sunriseFormatted[1] : '--:--'}</text>
        </div>
        <text className="textDaylight">Sunrise</text>
      </div>

      <div className="daylight">
        <div>
          <MoonIcon />
          <text className="infoDaylight">{(sunset && location) ? sunsetFormatted[0] + ":" + sunsetFormatted[1] : '--:--'}</text>
        </div>
        <text className="textDaylight">Sunset</text>
      </div>




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
    </div >


  )
}

export function DayCloudTime({ date, location, width, height }) {

  const margin = { top: 15, right: 10, bottom: 30, left: 60 };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xAxisLabelOffset = 30;
  const yAxisLabelOffset = 35;

  const xAxisLabel = 'Time';
  const yAxisLabel = '% Cloud Coverage';

  const startTime = new Date(date);
  startTime.setHours(0);

  const endTime = new Date(date);
  endTime.setHours(23);

  const xScale = scaleTime()
    .domain([startTime, endTime])
    .range([0, innerWidth]);
    /* .nice(); */

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0])
    .nice();

  function RoundTime (date) {
    date.setMinutes(date.getMinutes() + 30);
    date.setMinutes(0,0,0);
    return date;
  }
  
  const [tooltip, setTooltip] = useState(null);
  const chartRef = useRef();
  const [tooltipTextX, setTooltipTextX] = useState(null);
  const [tooltipTextAnchor, setTooltipTextAnchor] = useState(null);

  useEffect(() => {
    let chart = select(chartRef.current);
    chart.on("mouseover", (event) =>{
      tooltipListener(chart);
    });
    chart.on("mouseout", () => {
      setTooltip(null);
      removeTooltipListener(chart);
    });
  }, [location, date]);

  function tooltipListener (chart) {
    chart.on("mousemove", (event) => {
      if(location===null){
        return;
      }
      let point = pointer(event, chartRef.current);
      let time;
      if(point[0]<0){
        time = RoundTime(xScale.invert(0));
      }else if(point[0]>innerWidth-5){
        time = RoundTime(xScale.invert(innerWidth-5));
      }else{
        time = RoundTime(xScale.invert(point[0]));
      }  
      const locationDate = location.TotCloudCoverage.filter(d => d.datetime.includes(date.toLocaleDateString('en-CA')));
      locationDate.forEach((element, index) =>{
        if (parseInt(element.cloudValue) >= 100){
            locationDate[index].cloudValue = "100"
        }
      });

      const bisectTime = bisector(function(d) {return d.timestamp}).right;
      const xIndex = bisectTime(locationDate, time, 1);

      const clouds = parseInt(locationDate[xIndex-1].cloudValue); 
      const xy = {"x":time, "y":clouds};
      setTooltip(xy);
    });
  }
  
  const removeTooltipListener = (chart) => {
    chart.on("mousemove", null);
  }

  function RenderCloudMarks () {
    if(location!==null){
      const locationDate = location.TotCloudCoverage.filter(d => d.datetime.includes(date.toLocaleDateString('en-CA')));
      
      return(
        <MarksClouds 
          data={locationDate} 
          innerWidth={innerWidth} 
          yScale={yScale}
        />)
    } else {
      return null
    }
  };

  return( 
    <g ref={chartRef} width={width} height={height} transform={`translate(${margin.left},${margin.top})`}>
          <rect width={width} height={height} fill={"#100e26"}/>
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
        transform={`translate(${-yAxisLabelOffset + 6},${innerHeight / 2}) rotate(-90)`}
        fill='white'
        fontSize='0.7em'
      >
        {yAxisLabel}
        </text>
        <RenderCloudMarks/>
        <TooltipClouds 
          tooltipData={tooltip}
          xScale={xScale}
          yScale={yScale}
          innerWidth={innerWidth}
          innerHeight={innerHeight}/>
    </g>)
};

