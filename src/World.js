import { geoPath, geoGraticule} from 'd3';
import { geoMercator } from 'd3-geo';
import  { useWindowSize } from './App';
import StationIcon from './images/meteo-station';
import {rewind} from '@turf/turf';


export const World = ({countyArray: {counties, interiors, id}, surroundingCountries: {countries}, clouds, kpIndex, visibleC, visibleS, visibleA, visibleK, currentAurora, cities, sizeScale, sizeValue }) => {

    const [width, height] = useWindowSize();
    const projection = geoMercator()
                        .center([15,63])
                        .translate([width/2, height/2])
                        .scale(width*0.80)
    const path = geoPath().projection(projection);
    const graticule = geoGraticule().step([1,1]);
    // console.log(counties.features.name);

    return (
        <g key={id} className='map'>
        {/* //globe sphere */}
            <path className='sphere' d={path({type: 'Sphere'})} /> 
                {/* graticules are the lines or longitude and latitude */}
            
            <g id="landrender" className='land'>
                {
                    countries.features.map(feature => (
                        <path 
                            key={feature.properties.name}
                            className='surrounding-countries'
                            d={path(feature)}
                        />
                    ))
                }
                {
                
                    counties.features.map(feature => (  
                        // land mass
                        <path 
                            // className='land'
                            key={feature.properties.name}
                            d={path(feature)}
                            onClick={() => console.log(feature.properties.name)}
                        />
                    ))
                }
                <path 
                    className='interiors'
                    d={path(interiors)}
                />
                {cities.map(d => {
                    const [cityLng, cityLat] = projection([d.lng,d.lat]);
                    
                    return <g className='cityContainer'>
                            <circle className='cities' cx={cityLng} cy={cityLat} r={sizeScale(sizeValue(d))} />
                            <text className='cityNames' x={cityLng + sizeScale(sizeValue(d))*1.3} y={cityLat + sizeScale(sizeValue(d))/2}>{d.city}</text>
                        </g>
                })}
            </g>
            <path className='graticules' d={path(graticule())} />
            <g id="auroraRender">
                {
                    currentAurora.features.map(feature => {
                        feature = rewind(feature,{reverse:true}); //reversing the feature so that the inside of the rectangle is inside

                        if(!visibleA)
                        return false        

                        if(feature.properties.aurora >= 5 && feature.properties.aurora < 20 ) 
                        return  <path 
                            className='aurora level1'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onClick={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 20 && feature.properties.aurora < 40 ) 
                        return  <path 
                            className='aurora level2'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onClick={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 40 && feature.properties.aurora < 60 ) 
                        return  <path 
                            className='aurora level3'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onClick={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 60 && feature.properties.aurora < 80 ) 
                        return  <path 
                            className='aurora level4'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onClick={() => console.log(feature.properties.aurora)}
                        />
                        else if(feature.properties.aurora >= 80 && feature.properties.aurora <= 100 ) 
                        return  <path 
                            className='aurora level5'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                            onClick={() => console.log(feature.properties.aurora)}
                        />

                    })
                }
            </g>
            <g>
                {
                    clouds.map( d => {
                        const [stationLng, stationLat] = projection([d.longitude,d.latitude]); // getting the right values on the map for longitude and latitude, so that I am able to transform:translate the icons
                        function getCloudValue(){ // getting the cloud value for a specific date
                            function map_range(value, low1, high1, low2, high2) { // remapping 0-100% opacity to 0-80%, so that you can see beneath the circles
                                return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
                            }
                            const dateTime = '2022-02-03 12:00.000000';
                            const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
                            if(!cloudValue) return 0;
                            else return map_range(+cloudValue.cloudValue,0,100,0,80);
                        }
                    return <g key={d.name}  >
                        {/* 1st circle creates cloud circles, station Icon is the icon in the middle, 2nd circle is invisible - only used for the hover interaction, text is the station's name */}
                            <circle className={visibleC ? 'clouds':'hide'} style={{opacity: getCloudValue()/100}} cx={stationLng} cy={stationLat} r={20}/>  
                            <g className={visibleS ? 'stations':'hide'}>
                            <StationIcon x={stationLng} y={stationLat} width={10} height={10}/> 
                            <circle className='innerCircle' cx={stationLng} cy={stationLat} r={10} />
                            <text className='hide' x={stationLng +10} y={stationLat}>{d.name}</text>
                            </g>
                        </g>
                    })
                }
            </g>
            <g id="kpIndexRender">
                {
                    kpIndex['2022-02-03']['sunGeojson']['features'].map( feature => {
                        
                        feature = rewind(feature,{reverse:true});

                        if(!visibleK)
                        return false

                        if(feature.properties.viewAurora === true)
                        return <path
                            className='kpIndex'
                            key={feature.properties.longitude + " " + feature.properties.latitude}
                            d={path(feature)}
                        />
                    })
                }
            </g>
        </g>
        
        )
};