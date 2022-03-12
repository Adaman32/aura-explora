import { geoPath, geoGraticule, pointer} from 'd3';
import { geoMercator } from 'd3-geo';
import  { useWindowSize } from './App';
import StationIcon from './images/meteo-station';
import {rewind} from '@turf/turf';
import { useState } from 'react';
// import { abs, pow, sqrt } from 'd3-geo/src/math';


export const World = ({
    filtered,
    hovered,
    lockedA,
    lockedC,
    lockedK,
    countyArray: {counties, interiors, id},
    surroundingCountries: {countries},
    clouds,
    dateTime,
    kpIndex,
    kpClass,
    visibleC,
    visibleS,
    visibleA,
    visibleK,
    currentAurora,
    cities,
    sizeScale,
    fontSizeScale,
    sizeValue,
    setSelected,
    selectedStation,
    setSunset, 
    dateHistogramSize,
    originalCloudsArray,
}) => {


    const [width, height] = useWindowSize();
    const projection = geoMercator()
                        .center([15,63])
                        .translate([width/2, height*(1-dateHistogramSize)/2])
                        .scale(width*0.65)
    const path = geoPath().projection(projection);
    const graticule = geoGraticule().step([1,1]);
    // console.log(counties.features.name);
    
    // console.log(kpIndex);

        
/// selecting the nearest weather station to the selected location
    function findClosestWeatherStation(selectedLocation){
        let closestDistance = null;
        let closestStation = clouds[0];
        clouds.forEach(cloudLocation => {
            let cloudValue = cloudLocation.TotCloudCoverage.find(element => element.datetime === dateTime);
            let a = selectedLocation[0] - cloudLocation.longitude;
            let b = selectedLocation[1] - cloudLocation.latitude;
            // console.log(selectedLocation[0]);
            let distance = Math.sqrt(Math.pow(a,2)+Math.pow(2*b,2));
            // console.log(cloudLocation.name +" coordinates: " + cloudLocation.longitude +" " +cloudLocation.latitude+" clicked: " + selectedLocation[0]+" "+ selectedLocation[1]+ " distance: "+ distance);
            if(closestDistance === null || distance < closestDistance && cloudValue){
                closestDistance = distance;
                closestStation = cloudLocation;
            }
        });
        setSelected(closestStation);
        /// setting sunset
        let selectedSunset = null;
        let closestDistanceSunset = 99999999999999999999999;
        // let arrayOfSunsets = kpIndex[date.toLocaleDateString('en-CA')]['sunGeojson'].features;
        kpIndex.forEach(point => {

            let lat = +point.properties.latitude;
            let lon = +point.properties.longitude;
            let a = closestStation.longitude - lon;
            let b = closestStation.latitude - lat;
            let distance = Math.sqrt(Math.pow(a,2)+Math.pow(2*b,2));
            // // console.log(cloudLocation.name +" coordinates: " + cloudLocation.longitude +" " +cloudLocation.latitude+" clicked: " + selectedLocation[0]+" "+ selectedLocation[1]+ " distance: "+ distance);
            if(selectedSunset === null || distance < closestDistanceSunset){
                closestDistanceSunset = distance;
                selectedSunset = point;
            }
        });
        setSunset(selectedSunset);
    }

    
    // if(filtered)console.log(clouds[0].longitude);
    //     console.log(selectedCoordinates[0]);

    let auroraOpacity;
    let cloudsOpacity;
    let kpOpacity;

    // if(!locked) {
    //     auroraOpacity = 1;
    //     cloudsOpacity = 1;
    //     kpOpacity = 1;
    // } 
    // console.log(lockedA +" "+ lockedC + " " + lockedK);
    if(!hovered) {
        if(!lockedA) auroraOpacity = 1;
        if(!lockedC) cloudsOpacity = 1;
        if(!lockedK) kpOpacity = 1;
    } 


    if(hovered === 'kp') {
        kpOpacity = 0;
    } 
    if(hovered === 'clouds') {
        cloudsOpacity = 0;
    } 
    if(hovered === 'aurora') {
        auroraOpacity = 0;
    } 
    
    if(lockedA) auroraOpacity = 0;
    if(lockedC) cloudsOpacity = 0;
    if(lockedK) kpOpacity = 0;
    


    if(filtered)
    return (
        <g key={id} className='map'>
        {/* //globe sphere */}
            <path className='sphere' d={path({type: 'Sphere'})} /> 
                {/* graticules are the lines or longitude and latitude */}
            
            <g id="landrender" className='land'>
                {
                    countries.features.map(function(feature) {
                        return <path 
                        key={feature.properties.name}
                        className='surrounding-countries'
                        d={path(feature)}
                    />
                    }
 
                    )
                }
                {
                
                    counties.features.map(function(feature) {
                        return (  
                            // land mass
                            <path 
                                // className='land'
                                key={feature.properties.name}
                                d={path(feature)}
                                // onClick={e => findClosestWeatherStation(projection.invert(pointer(e)))}
                            />
                        )
                    } )
                }
                <path 
                    className='interiors'
                    d={path(interiors)}
                />

                {/* using KP index array to create a clickable grid on top of the map */}
                <g opacity={0} id="clickableGrid">
                {
                    kpIndex.map( feature => {
                        
                        feature = rewind(feature,{reverse:true});

                        return <path
                            // className={}
                            key={"clickable grid " + feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onClick={() => findClosestWeatherStation([feature.properties.longitude, feature.properties.latitude])}
                        />
                    })
                }
            </g>
                {cities.map(d => {
                    const [cityLng, cityLat] = projection([d.lng,d.lat]);    
                    var fontS = fontSizeScale(sizeValue(d));              
                    
                    return <g key={d.city} className='cityContainer'>
                            <circle onClick={() => findClosestWeatherStation([d.lng,d.lat])} className='cities' cx={cityLng} cy={cityLat} r={sizeScale(sizeValue(d))}/>
                            <text style={{fontSize:fontS}} className='cityNames' x={cityLng + 3} y={cityLat + sizeScale(sizeValue(d))/2}>{d.city}</text>
                        </g>
                })}
            </g>
            <path className='graticules' d={path(graticule())} />
            <g opacity={auroraOpacity} id="auroraRender">
                {
                    currentAurora.map(feature => {
                        feature = rewind(feature,{reverse:true}); //reversing the feature so that the inside of the rectangle is inside

                        if(!visibleA)
                        return false        

                        if(feature.properties.aurora >= 5 && feature.properties.aurora < 20 ) 
                        return  <path 
                            className='aurora level1'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            // onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 20 && feature.properties.aurora < 40 ) 
                        return  <path 
                            className='aurora level2'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            // onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 40 && feature.properties.aurora < 60 ) 
                        return  <path 
                            className='aurora level3'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            // onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 60 && feature.properties.aurora < 80 ) 
                        return  <path 
                            className='aurora level4'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            // onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 80 && feature.properties.aurora <= 100 ) 
                        return  <path 
                            className='aurora level5'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            // onMouseEnter={() => console.log(feature.properties.aurora)}
                        />

                    })
                }
            </g>
            <g opacity={cloudsOpacity}>
                {
                    clouds.map( d => {
                        // stationCounter++;
                        const [stationLng, stationLat] = projection([d.longitude,d.latitude]); // getting the right values on the map for longitude and latitude, so that I am able to transform:translate the icons
                        function getCloudValue(){ // getting the cloud value for a specific date
                            // function map_range(value, low1, high1, low2, high2) { // remapping 0-100% opacity to 0-80%, so that you can see beneath the circles
                            //     return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
                            // }
                            // console.log(d);
                            // console.log(stationCounter);
                            
                            // console.log();

                            let cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);

                            if(!cloudValue) return false;
                            else if(cloudValue.cloudValue >= 0 && cloudValue.cloudValue < 20) return 0;
                            else if(cloudValue.cloudValue >= 20 && cloudValue.cloudValue < 40) return 20;
                            else if(cloudValue.cloudValue >= 40 && cloudValue.cloudValue < 60) return 40;
                            else if(cloudValue.cloudValue >= 60 && cloudValue.cloudValue < 80) return 60;
                            else return 80;
                        }
                        const cloudValue = getCloudValue();
                        if(cloudValue===false) return; 
                        else if(selectedStation === d) return <g key={d.name}  >
                            {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                            <circle className={visibleC ? 'cloudsSelected':'hide'} onClick={() => {setSelected(d)}} style={{fillOpacity: cloudValue/100}} cx={stationLng} cy={stationLat} r={10}/>  
                                <g className={visibleS ? 'stations':'hide'}>
                                <StationIcon fill={'red'} x={stationLng} y={stationLat} width={7} height={7}/> 
                                <circle onClick={() => findClosestWeatherStation([d.longitude,d.latitude])} className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                                <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
                                <text style={visibleC ? {fontSize: '0.4em', fill: 'red'} : {fontSize: '0.3em', fill: 'red'}} x={visibleC ? stationLng +10 : stationLng +5} y={visibleC ? stationLat+10 : stationLat+6}>{clouds.indexOf(d)+1}</text>
                                </g>
                            </g>
                        else return <g key={d.name}>
                        {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                        <circle className={visibleC ? 'clouds':'hide'} onClick={() => {setSelected(d)}} style={{fillOpacity: cloudValue/100}} cx={stationLng} cy={stationLat} r={10}/>  
                            <g className={visibleS ? 'stations':'hide'}>
                                <StationIcon fill={'white'} x={stationLng} y={stationLat} width={7} height={7}/> 
                                <circle onClick={() => findClosestWeatherStation([d.longitude,d.latitude])} className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                                <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
                                <text style={visibleC ? {fontSize: '0.4em'} : {fontSize: '0.3em'}} x={visibleC ? stationLng +10 : stationLng +5} y={visibleC ? stationLat+10 : stationLat+6}>{clouds.indexOf(d)+1}</text>
                            </g>
                        </g>
                    })
                }
            </g>
            <g opacity={kpOpacity} id="kpIndexRender">
                {
                    kpIndex.map( feature => {
                        
                        feature = rewind(feature,{reverse:true});

                        if(!visibleK)
                        return false

                        if(feature.properties.viewAurora === true)
                        return <path
                            className={kpClass}
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                        />
                    })
                }
            </g>
        </g>
        
        )
        else return (
            <g key={id} className='map'>
                <g id="auroraRender2">
                    {
                        currentAurora.map(feature => {
                            feature = rewind(feature,{reverse:true}); //reversing the feature so that the inside of the rectangle is inside

                            if(!visibleA)
                            return false        
    
                            if(feature.properties.aurora >= 5 && feature.properties.aurora < 20 ) 
                            return  <path 
                                className='aurora level1'
                                key={feature.properties.longitude + " " + feature.properties.latitude}
                                d={path(feature)}
                                // onMouseOver={() => console.log(feature.properties.aurora)}
                            />
                            else if(feature.properties.aurora >= 20 && feature.properties.aurora < 40 ) 
                            return  <path 
                                className='aurora level2'
                                key={feature.properties.longitude + " " + feature.properties.latitude}
                                d={path(feature)}
                                // onMouseOver={() => console.log(feature.properties.aurora)}
                            />
                            else if(feature.properties.aurora >= 40 && feature.properties.aurora < 60 ) 
                            return  <path 
                                className='aurora level3'
                                key={feature.properties.longitude + " " + feature.properties.latitude}
                                d={path(feature)}
                                // onMouseOver={() => console.log(feature.properties.aurora)}
                            />
                            else if(feature.properties.aurora >= 60 && feature.properties.aurora < 80 ) 
                            return  <path 
                                className='aurora level4'
                                key={feature.properties.longitude + " " + feature.properties.latitude}
                                d={path(feature)}
                                // onMouseOver={() => console.log(feature.properties.aurora)}
                            />
                            else if(feature.properties.aurora >= 80 && feature.properties.aurora <= 100 ) 
                            return  <path 
                                className='aurora level5'
                                key={feature.properties.longitude + " " + feature.properties.latitude}
                                d={path(feature)}
                                // onMouseOver={() => console.log(feature.properties.aurora)}
                            />
    
                        })
                    }
                </g>
                <g>
                    {
                        clouds.map( d => {
                            let index;

                            originalCloudsArray.forEach(element => {
                                if(element.name === d.name) index = originalCloudsArray.indexOf(element);
                            });
                            const [stationLng, stationLat] = projection([d.longitude,d.latitude]); // getting the right values on the map for longitude and latitude, so that I am able to transform:translate the icons
                            function getCloudValue(){ // getting the cloud value for a specific date
                                // function map_range(value, low1, high1, low2, high2) { // remapping 0-100% opacity to 0-80%, so that you can see beneath the circles
                                //     return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
                                // }

                                let cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
                                
                                if(!cloudValue) return false;
                                else if(cloudValue.cloudValue >= 0 && cloudValue.cloudValue < 20) return 0;
                                else if(cloudValue.cloudValue >= 20 && cloudValue.cloudValue < 40) return 20;
                                else if(cloudValue.cloudValue >= 40 && cloudValue.cloudValue < 60) return 40;
                                else if(cloudValue.cloudValue >= 60 && cloudValue.cloudValue < 80) return 60;
                                else return 80;
                            }
                            const cloudValue = getCloudValue();
                            if(cloudValue===false) return; 
                            else if(selectedStation === d) return <g key={d.name}  >
                                {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                                <circle className={visibleC ? 'cloudsSelected':'hide'} onClick={() => {setSelected(d)}} style={{fillOpacity: cloudValue/100}} cx={stationLng} cy={stationLat} r={10}/>  
                                    <g className={visibleS ? 'stations':'hide'}>
                                    <StationIcon fill={'red'} x={stationLng} y={stationLat} width={7} height={7}/> 
                                    <circle onClick={() => {findClosestWeatherStation([d.longitude,d.latitude])}} className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                                    <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
                                    <text style={visibleC ? {fontSize: '0.4em', fill: 'red'} : {fontSize: '0.3em', fill: 'red'}} x={visibleC ? stationLng +10 : stationLng +5} y={visibleC ? stationLat+10 : stationLat+6}>{index+1}</text>
                                    </g>
                                </g> 
                            else return <g key={d.name}  >
                            {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                            <circle className={visibleC ? 'clouds':'hide'} onClick={() => {setSelected(d)}} style={{fillOpacity: cloudValue/100}} cx={stationLng} cy={stationLat} r={10}/>  
                                <g className={visibleS ? 'stations':'hide'}>
                                    <StationIcon fill={'white'} x={stationLng} y={stationLat} width={7} height={7}/> 
                                    <circle onClick={() => {findClosestWeatherStation([d.longitude,d.latitude])}} className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                                    <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
                                    <text style={visibleC ? {fontSize: '0.4em'} : {fontSize: '0.3em'}} x={visibleC ? stationLng +10 : stationLng +5} y={visibleC ? stationLat+10 : stationLat+6}>{index+1}</text>
                                </g>
                            </g> 
                        })
                    }
                </g>
                <g id="kpIndexRender2">
                    {
                        kpIndex.map( feature => {
                            
                            feature = rewind(feature,{reverse:true});
    
                            if(!visibleK)
                            return false
    
                            if(feature.properties.viewAurora === true)
                            return <path
                                className={kpClass}
                                key={feature.properties.longitude + " " + feature.properties.latitude}
                                d={path(feature)}
                            />
                        })
                    }
                </g>
            </g>
            
            )
};