import React from 'react';
import { scaleLinear, scaleTime, timeFormat, timeHour, timeDay } from 'd3';
import { MarksClouds } from './ChartComponents/MarksClouds';
import { MarksKp } from './ChartComponents/MarksKp';
import { AxisBottomTime } from './ChartComponents/AxisBottomTime';
import { AxisLeft } from './ChartComponents/AxisLeft';


const margin = {top:15, right:20, bottom: 30, left: 80};
const xAxisLabelOffset = 12;
const yAxisLabelOffset = 40;

export const Timeline = ({kpIndex, selectedLocation, width, height, setDate, currentDate, startDate, endDate, mode}) => { 

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xAxisLabelD = 'Date'; 
    const xAxisLabelT = 'Time';

    const yAxisLabelClouds = '% Cloud Coverage';
    const yAxisLabelKp = 'KP index'; 

    const xAxisDateTickFormat = timeFormat('%d-%m-%Y');

    function checkDate (date) {
        if(date === '03-02-2022'){
            return('Today');
        }else{
            return date
        };
    };

    var dataKp = [];

    for(let key in kpIndex){
        var array = {};
        array.kp = kpIndex[key]['kp-value'];
        array.date = key;
        dataKp.push(array);
    }

    const xScale = scaleTime()
        .domain([startDate, endDate])
        .range([0, innerWidth]);
    

    const yScaleClouds = scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0])
        .nice();

    const yScaleKp = scaleLinear()
        .domain([0, 9])
        .range([innerHeight, 0])
        .nice();

    const AxisBottomDate = ({ xScale, innerHeight, innerWidth, tickFormat, tickOffset, numTicks, stroke, onDateClick}) =>
        xScale.ticks(numTicks).map(tickValue => (
            <g className="ticks" key={tickValue} transform={`translate(${xScale(tickValue)},0)`} >
                <line y2={innerHeight} stroke={stroke} strokeDasharray= "5,5" strokeWidth="2"/>
                <g className='timeLabelsContainer'>
                    <text style={{textAnchor: 'start'}} dy=".71em" y={innerHeight + tickOffset} fill='white' fontSize='0.6em' >
                    {checkDate(tickFormat(tickValue))}
                    </text>
                </g>
                <rect 
                    width={innerWidth/15} 
                    height={height} 
                    fill='#100E26' 
                    z-index={30}
                    onClick={(e)=>setDate(new Date(tickValue))}
                    style={tickValue.toLocaleDateString('en-CA') === currentDate.toLocaleDateString('en-CA') ? {fill:"white", opacity:"0.3"} : {opacity:"0"}}
                    cursor="pointer"
                />
          </g>
        ));   
    
    function RenderModeAxis ({mode}) {
        if(mode === 'Cloudiness'){
            return( 
                <>
                    <AxisBottomTime
                        xScale={xScale}
                        innerHeight={innerHeight}
                        tickFormat={timeFormat('%H')}
                        tickOffset={5}
                        numTicks={timeHour.every(6)}
                    />
                    <text
                        className="axis-label"
                        transform={`translate(${-yAxisLabelOffset},${innerHeight+xAxisLabelOffset})`}
                        textAnchor="start"
                        fill='white'
                        fontSize='0.7em'
                    >
                    {xAxisLabelT}
                    </text>
                    <AxisLeft 
                        yScale={yScaleClouds} 
                        innerWidth={innerWidth} 
                        tickOffset={5}
                    />
                    <text
                        className="axis-label"
                        textAnchor="middle"
                        transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
                        fill='white'
                        fontSize='0.7em'
                    >
                    {yAxisLabelClouds}
                    </text>
                </>
            )
        }else if(mode === 'KP-Index'){
            return (
                <>
                    <AxisLeft 
                        yScale={yScaleKp} 
                        innerWidth={innerWidth} 
                        tickOffset={5}
                    />
                    <text
                        className="axis-label"
                        textAnchor="middle"
                        transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
                        fill='white'
                        fontSize='0.7em'
                    >
                    {yAxisLabelKp}
                    </text> 
                    <MarksKp 
                        data={dataKp}
                        innerWidth={innerWidth}
                        innerHeight={innerHeight}
                        yScale={yScaleKp}
                    />
                </>
            )
        }else{
            return null
        }
    };

    function RenderWhenLocation({mode}){
        if(mode === 'Cloudiness' && selectedLocation!==null){
            return(
                <MarksClouds 
                    data={selectedLocation.TotCloudCoverage} 
                    innerWidth={innerWidth} 
                    yScale={yScaleClouds}
                />
            )
        }else if(mode === 'KP-Index' && selectedLocation !== null){
            const lat = Math.round(selectedLocation.latitude);
            const long = Math.round(selectedLocation.longitude);

            var requiredKp;
            kpIndex['2022-02-03']['sunGeojson']['features'].forEach(element => {
                if(parseInt(element.properties.latitude) === lat && parseInt(element.properties.longitude) === long){
                    requiredKp = parseInt(element.properties.required_kp);
                }
            });
            
            return(
                <g transform={`translate(0, ${yScaleKp(requiredKp)})`}>
                    <line x2={innerWidth} stroke={'red'} strokeWidth="2"/>
                </g>
            )
        }else{
            return null;
        } 
    };
        

    return (
        <>
            <g width={width} height={height} transform={`translate(${margin.left},${margin.top})`}>
                <text
                    className="axis-label"
                    transform={`translate(${-yAxisLabelOffset},${innerHeight+xAxisLabelOffset+11})`}
                    textAnchor="start"
                    fill='white'
                    fontSize='0.7em'
                    >
                    {xAxisLabelD}
                </text>
                <RenderModeAxis mode={mode}/> 
                <RenderWhenLocation mode={mode}/>  
                <AxisBottomDate
                    xScale={xScale}
                    innerHeight={innerHeight}
                    innerWidth={innerWidth}
                    tickFormat={xAxisDateTickFormat}
                    tickOffset={15}
                    numTicks={timeDay}
                    stroke={'white'}
                    setDate={setDate}
                />
            </g>
        </>
    );
};
