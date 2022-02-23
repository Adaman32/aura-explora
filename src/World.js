import { geoPath, geoGraticule} from 'd3';
import { geoMercator } from 'd3-geo';
import  { useWindowSize } from './App';
import StationIcon from './images/meteo-station';
import {rewind} from '@turf/turf';


export const World = ({
    filtered,
    hovered,
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
    sizeValue }) => {

    const [width, height] = useWindowSize();
    const projection = geoMercator()
                        .center([15,63])
                        .translate([width/2, height/2])
                        .scale(width*0.80)
    const path = geoPath().projection(projection);
    const graticule = geoGraticule().step([1,1]);
    // console.log(counties.features.name);
    

    let auroraOpacity = 1;
    let cloudsOpacity = 1;
    let kpOpacity = 1;

    if(!hovered) {
        auroraOpacity = 1;
        cloudsOpacity = 1;
        kpOpacity = 1;
    } 
    if(hovered === 'kp') {
        auroraOpacity = 0.1;
        cloudsOpacity = 0.2;
        kpOpacity = 0.2;
    } 
    if(hovered === 'clouds') {
        auroraOpacity = 0.1;
        cloudsOpacity = 0.2;
        kpOpacity = 0.2;
    } 
    if(hovered === 'aurora') {
        auroraOpacity = 0.1;
        cloudsOpacity = 0.2;
        kpOpacity = 0.2;
    } 
 
    

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
                                onClick={() => console.log(feature.properties.name)}
                            />
                        )
                    } )
                }
                <path 
                    className='interiors'
                    d={path(interiors)}
                />
                {cities.map(d => {
                    const [cityLng, cityLat] = projection([d.lng,d.lat]);
                    
                    return <g key={d.city} className='cityContainer'>
                            <circle className='cities' cx={cityLng} cy={cityLat} r={sizeScale(sizeValue(d))} />
                            <text className='cityNames' x={cityLng + sizeScale(sizeValue(d))*1.2} y={cityLat + sizeScale(sizeValue(d))/2}>{d.city}</text>
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
                            onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 20 && feature.properties.aurora < 40 ) 
                        return  <path 
                            className='aurora level2'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 40 && feature.properties.aurora < 60 ) 
                        return  <path 
                            className='aurora level3'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 60 && feature.properties.aurora < 80 ) 
                        return  <path 
                            className='aurora level4'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onMouseEnter={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 80 && feature.properties.aurora <= 100 ) 
                        return  <path 
                            className='aurora level5'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onMouseEnter={() => console.log(feature.properties.aurora)}
                        />

                    })
                }
            </g>
            <g opacity={cloudsOpacity}>
                {
                    clouds.map( d => {
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
                        else return <g key={d.name}  >
                            {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                            <circle className={visibleC ? 'clouds':'hide'} style={{opacity: cloudValue/100}} cx={stationLng} cy={stationLat} r={20}/>  
                                <g className={visibleS ? 'stations':'hide'}>
                                <StationIcon x={stationLng} y={stationLat} width={10} height={10}/> 
                                <circle className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                                <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
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
                            else return <g key={d.name}  >
                                {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                                <circle className={visibleC ? 'clouds':'hide'} style={{opacity: cloudValue/100}} cx={stationLng} cy={stationLat} r={20}/>  
                                    <g className={visibleS ? 'stations':'hide'}>
                                    <StationIcon x={stationLng} y={stationLat} width={10} height={10}/> 
                                    <circle className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                                    <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
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