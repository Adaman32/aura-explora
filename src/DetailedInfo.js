import * as d3 from "d3";
import React, { useState, useEffect, useRef } from "react";

export function DayLightTime(props){
    // Time bar test
    /* Not related to real data yet */
    /*TODO: check data format + trans to bar chart (optional)*/
    const WIDTH = 300;
    let widthRise = 8/24 * WIDTH;
    let widthSet = 14/24 * WIDTH;

    return (
        <div>
            <p>{"Day light, sunrise/sunset"}</p>
            <svg viewBox="0,0,300,30">
                <rect width={WIDTH} height={30} className="night"></rect>
                <rect width={widthSet} height={30} className="day"></rect>
                <rect width={widthRise} height={30} className="night"></rect>
            </svg>
            <div className="scaleLabels">
                <span className="scaleLabelChildFour">{"0:00"}</span>
                <span className="scaleLabelChildFour">{"7:58"}</span>
                <span className="scaleLabelChildFour">{"13:57"}</span>
                <span className="scaleLabelChildFour">{"24:00"}</span>
            </div>
        </div>
        
        
    )
}

export function DayCloudTime(props){
    return(
        <div>
            <p>{"% Cloud coverage"}</p>
            <Line />
        </div>

    )
}
  
function Line() {
    // Line chart test
    const data = [
        {
        x: "00:00",
        y: 80
        },
        {
        x: "06:00",
        y: 80
        },
        {
        x: "12:00",
        y: 40
        },
        {
        x: "18:00",
        y: 40
        },
        {
        x: "24:00",
        y: 40
        }
    ];
    
    const margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 30
    };
  
    const WIDTH = 300;
    const HEIGHT = 150;
    const chartWidth = WIDTH - margin.left - margin.right;
    const chartHeight = HEIGHT - margin.top - margin.bottom;
  
    const [value, setValue] = useState(() => data.map(d => ({ ...d, y: 0 })));
    const svgRef = useRef(null);
  
    useEffect(() => {
      const t = d3.transition().duration(1000);
  
      t.tween("height", () => {
        let interpolates = data.map((d, i) => {
          let start = (value[i] && value[i].y) || 0;
          return d3.interpolateNumber(start, d.y);
        });
        return t => {
          let newData = data.map((d, i) => {
            return { ...d, y: interpolates[i](t) };
          });
  
          setValue(newData);
        };
      });
    }, []);
  
    const xScale = d3
      .scalePoint()
      .domain(data.map(d => d.x))
      .range([0, chartWidth])
      .padding(0)
      .round(true);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0])
      .nice();
  
    const line = d3
      .line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveLinear);
  
    const area = d3
      .area()
      .x(d => xScale(d.x))
      .y1(d => yScale(d.y))
      .y0(d => yScale(0));
  
    return (
      <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
        <linearGradient id="linear-gradient" x1={0} x2={1} y1={0} y2={0}>
          <stop offset="0%" stopColor="#16a3ff" />
          <stop offset="100%" stopColor="#6ddead" />
        </linearGradient>
        <linearGradient id="linear-gradient2" x1={0} x2={0} y1={1} y2={0}>
          <stop offset="0%" stopColor="#ffffff80" />
          <stop offset="100%" stopColor="#ffffffe0" />
        </linearGradient>
        {/* x axis */}
        <g
          className="x-axis"
          transform={`translate(${margin.left},${HEIGHT - margin.bottom})`}
        >
          {/* line */}
          <line x1={0} y1={0} x2={chartWidth} y2={0} stroke={"#fff"} />
  
          {/* lable*/}
          <g className="tick">
            {data.map((d, i) => {
              let x = xScale(d.x);
  
              return (
                <g key={i}>
                  {/* scale */}
                  <line x1={x} x2={x} y1={0} y2={6} stroke={"#fff"} />
                  {/* text */}
                  <text x={x} y={20} fontSize={12} textAnchor={"middle"} fill="#fff">
                    {d.x}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
  
        {/* y axis */}
        <g
          className="y-axis"
          transform={`translate(${margin.left},${margin.top})`}
        >
          <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#fff" />
  
          <g className="tick">
            {yScale.ticks(10).map((d, i) => {
              let y = yScale(d);
  
              return (
                <g key={i} transform={`translate(0, ${y})`}>
                  <line x1={0} x2={-6} y1={0} y2={0} stroke={"#fff"} />
                  <text
                    x={-12}
                    y={0}
                    dy={"0.32em"}
                    fontSize={12}
                    textAnchor={"end"}
                    fill="#fff"
                  >
                    {d}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
  
        {/* line */}
        <g
          transform={`translate(${margin.left}, ${margin.top})`}
          fill={"url(#linear-gradient)"}
        >
          <path
            d={line(value)}
            stroke={"url(#linear-gradient)"}
            fill="none"
            strokeWidth={5}
          />
          <path d={area(value)} stroke="none" fill="url(#linear-gradient2)" />
          {value.map((d, i) => {
            let x = xScale(d.x);
            let y = yScale(d.y);
  
            return (
              <g key={i}>
                <text x={x} y={y - 10} fontSize={12} textAnchor={"middle"} fill="#fff">
                  {d.y.toFixed(0)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
}