import React, { useEffect, useRef, useState } from 'react';
import { pointer, select, scaleLinear, scaleTime, timeFormat, timeHour, timeDay } from 'd3';
import { MarksClouds } from './ChartComponents/MarksClouds';
import { MarksKp } from './ChartComponents/MarksKp';
import { AxisBottomTime } from './ChartComponents/AxisBottomTime';
import { AxisLeft } from './ChartComponents/AxisLeft';


const margin = {top:25, right:5, bottom: 30, left: 60};
const xAxisLabelOffset = 12;
const yAxisLabelOffset = 40;

export const Timeline = ({kpIndex, selectedLocation, width, height, setDate, currentDate, startDate, endDate, mode, setSunset}) => { 

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xAxisLabelD = 'Date'; 
    const xAxisLabelT = 'Time';

    const yAxisLabelClouds = '% Cloud Coverage';
    const yAxisLabelKp = 'KP index'; 

    const xAxisDateTickFormat = timeFormat('%d-%m-%Y');

    const currentDateFormat = timeFormat('%H:%M')

    function checkDate (date) {
        if(date === '03-02-2022'){
            return('Today');
        }else{
            return date
        };
    };

    function setSunsetSunriseData(date){
        if(!selectedLocation) return;
        /// setting sunset
        let selectedSunset = null;
        let closestDistanceSunset = 99999999999999999999999;

        kpIndex[date.toLocaleDateString('en-CA')]['sunGeojson']['features'].forEach(point => {
            let lat = +point.properties.latitude;
            let lon = +point.properties.longitude;
            let a = selectedLocation.longitude - lon;
            let b = selectedLocation.latitude - lat;
            let distance = Math.sqrt(Math.pow(a,2)+Math.pow(2*b,2));

            if(selectedSunset === null || distance < closestDistanceSunset){
                closestDistanceSunset = distance;
                selectedSunset = point;
            }
        });
        setSunset(selectedSunset);
    }

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

    function RoundTime(date){ 
        date.setMinutes(date.getMinutes() + 30);
        date.setMinutes(0,0,0);
        return date;
    };

    const dragAreaRef = useRef();
    const draggerRef = useRef();

    useEffect(() => {
        let dragArea = select(dragAreaRef.current);
        let dragger = select(draggerRef.current);

        dragger.on("mousedown", () => {
            dragListener(dragArea);
        });

        dragArea.on("mouseup", ()=> {
            removeDragListener(dragArea);
        });

        dragArea.on("mouseleave", () => {
            removeDragListener(dragArea);
        })

    }, [selectedLocation, width]);

    const dragListener = (dragArea) => {
        let selectedDate;
        dragArea.on("mousemove", (event) => {
            let point = pointer(event, dragArea.current);
            console.log("p", point);
            if(point[0]<0){
                selectedDate = xScale.invert(0);
                setDate(selectedDate);
                setSunsetSunriseData(selectedDate);
            }else if(point[0]>innerWidth-2){
                selectedDate = xScale.invert(innerWidth-2);
                setDate(RoundTime(selectedDate));
                setSunsetSunriseData(RoundTime(selectedDate));
            }else{
                let selectedDate = xScale.invert(point[0]);
                setDate(RoundTime(selectedDate));
                setSunsetSunriseData(RoundTime(selectedDate));
            }
        });
    };

    const removeDragListener = (dragArea) =>{
        dragArea.on("mousemove", null) 
    }

    const AxisBottomDate = ({ xScale, innerHeight, innerWidth, tickFormat, tickOffset, numTicks, stroke, onDateClick}) =>
        xScale.ticks(numTicks).map(tickValue => (
            <g className="ticks" key={tickValue} transform={`translate(${xScale(tickValue)},0)`} >
                <line y2={innerHeight} stroke={stroke} strokeDasharray= "5,5" strokeWidth="2"/>
                <g className='timeLabelsContainer'>
                    <text style={tickValue.toLocaleDateString('en-CA') === currentDate.toLocaleDateString('en-CA') ? {textAnchor: 'start', fontSize:'0.9em'} : {textAnchor: 'start'}} dy=".71em" y={innerHeight + tickOffset} fill='white' fontSize='0.6em' >
                    {checkDate(tickFormat(tickValue))}
                    </text>
                </g>
                <rect 
                    width={innerWidth/15} 
                    height={height} 
                    fill='#100E26' 
                    z-index={30}
                    onClick={(e)=>{
                        setDate(new Date(tickValue.setHours(currentDate.getHours())))
                        setSunsetSunriseData(new Date(tickValue))}}
                    style={tickValue.toLocaleDateString('en-CA') === currentDate.toLocaleDateString('en-CA') ? {fill:"white", opacity:"0.3"} : {opacity:"0"}}
                    
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
                    <text
                        className="axis-label"
                        textAnchor="left"
                        transform={`translate(${innerWidth}, ${-yAxisLabelOffset})`}
                        fill='white'
                        fontSize='0.7em'
                    ></text>
                    Minimum required kp-index
                </g>
            )
        }else{
            return null;
        } 
    };
        

    return (
        <>
            <g ref={dragAreaRef} width={width} height={width} transform={`translate(${margin.left},${margin.top})`}>
                <rect width={width} height={margin.top} fill={"#100e26"} transform={`translate(0,${-margin.top})`}/>
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

                <g ref={draggerRef}  className="timeSlider" transform={`translate(${xScale(currentDate)},0)`} cursor="pointer"> 
                    <rect x={-25} y={-xAxisLabelOffset-25} width={50} height={innerHeight+40} opacity={0}/>
                        <polygon style={{pointerEvents: 'none'}} transform={`translate(0,${-xAxisLabelOffset})`} points="-20,-10 20,-10 0,10" fill='green' />
                        <line y2={innerHeight+10} transform={"translate(0,-10)"} stroke={'green'} strokeWidth={5} />
                        <g transform={`translate(0,${-xAxisLabelOffset})`} outline='solid 3px green'>
                            <text
                                transform={`translate(0,${-xAxisLabelOffset})`}
                                className="axis-label"
                                textAnchor="middle"
                                fill='white'
                                fontSize='0.9em'
                                z-index={100}
                                style={{pointerEvents: 'none'}}
                            >
                                {currentDateFormat(currentDate)}
                            </text>
                    </g>
                </g>
            </g>
        </>
    );
};
