import './App.css';
import { useSwedenCities } from './useSwedenCities';
import { useCounties } from './useCounties';
import { World } from './World';
import React, { useState, useLayoutEffect } from 'react';
import { scaleSqrt, max } from 'd3';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSurroundingCountries } from './useSurroundingCountries';
import { useCurrentAurora } from './useCurrentAurora';
import { useClouds } from './useClouds';
import { useKpIndex } from './useKpIndex'
import AuraExploraLogo from './images/AuraExploraLogo'
import Checkbox from './checkbox';
import { AuroraScale, CloudScale, KPScale } from './FilterScale';
import StationIcon from './images/meteo-station';
import './DetailedInfo';
import { DayCloudTime, DayLightTime } from './DetailedInfo';

// const width =  window.innerWidth;
// const height = window.innerHeight;


export const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

function App() {
  const [width, height] = useWindowSize();
  const swedishCities = useSwedenCities();
  const counties = useCounties();
  const surroundingCountries = useSurroundingCountries();
  const currentAuroraPolygons = useCurrentAurora();
  const cloudsArray = useClouds();
  const kpIndex = useKpIndex();
  const kpIndexForFiltering = useKpIndex();
  const [visibleC, setVisibleC] = React.useState(true);
  const [visibleS, setVisibleS] = React.useState(true);
  const [visibleA, setVisibleA] = React.useState(true);
  const [visibleK, setVisibleK] = React.useState(false);
  let kpClass = null;

  const [hoveredValue, setHoveredValue] = useState(null);
  let hoveredDomain = "";
  let filteredClouds = [];
  let filteredAurora = [];
  let filteredKP = [];
  let filteredKPClass = kpClass;

  const dateTime = '2022-02-03 12:00.000000';

  if (!swedishCities || !counties || !surroundingCountries || !currentAuroraPolygons || !cloudsArray || !kpIndex) {
    return <pre>Loading...</pre>
  }


  ///// Setting KP Color
  if(kpIndex['2022-02-03']['kp-value'] >= 0 || kpIndex['2022-02-03']['kp-value'] < 2) kpClass = 'kpIndex level0';
  if(kpIndex['2022-02-03']['kp-value'] >= 2 || kpIndex['2022-02-03']['kp-value'] < 3) kpClass = 'kpIndex level1';
  if(kpIndex['2022-02-03']['kp-value'] >= 3 || kpIndex['2022-02-03']['kp-value'] < 4) kpClass = 'kpIndex level2';
  if(kpIndex['2022-02-03']['kp-value'] >= 4 || kpIndex['2022-02-03']['kp-value'] < 5) kpClass = 'kpIndex level3';
  if(kpIndex['2022-02-03']['kp-value'] >= 5 || kpIndex['2022-02-03']['kp-value'] < 6) kpClass = 'kpIndex level4';
  if(kpIndex['2022-02-03']['kp-value'] >= 6) kpClass = 'kpIndex level5';
  console.log(kpClass);


  //// VISUAL FILTERING
  /// filtering clouds
  if(hoveredValue === 'c0') {
    hoveredDomain = 'clouds';
     filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
      if(!cloudValue) return false;
      if (cloudValue.cloudValue < 20 && cloudValue.cloudValue >= 0) return true;
      else return false;
    })
  }
  if(hoveredValue === 'c1') {
    hoveredDomain = 'clouds';
     filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
      if(!cloudValue) return false;
      if (cloudValue.cloudValue < 40 && cloudValue.cloudValue >= 20) return true;
      else return false;
    })
  }
  if(hoveredValue === 'c2') {
    hoveredDomain = 'clouds';
     filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
      if(!cloudValue) return false;
      if (cloudValue.cloudValue < 60 && cloudValue.cloudValue >= 40) return true;
      else return false;
    })
  }
  if(hoveredValue === 'c3') {
    hoveredDomain = 'clouds';
     filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
      if(!cloudValue) return false;
      if (cloudValue.cloudValue < 80 && cloudValue.cloudValue >= 60) return true;
      else return false;
    })
  }
  if(hoveredValue === 'c4') {
    hoveredDomain = 'clouds';
     filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime);
      if(!cloudValue) return false;
      if (cloudValue.cloudValue >= 80) return true;
      else return false;
    })
  }

    /// filtering aurora
    if(hoveredValue === 'a0') {
      hoveredDomain = 'aurora';
       filteredAurora = currentAuroraPolygons.features.filter(d => {
        if (d.properties.aurora < 20 && d.properties.aurora >= 0)return true;
        else return false;
      })
    }
    if(hoveredValue === 'a1') {
      hoveredDomain = 'aurora';
       filteredAurora = currentAuroraPolygons.features.filter(d => {
        if (d.properties.aurora < 40 && d.properties.aurora >= 20) return true;
        else return false;
      })
    }
    if(hoveredValue === 'a2') {
      hoveredDomain = 'aurora';
       filteredAurora = currentAuroraPolygons.features.filter(d => {
        if (d.properties.aurora < 60 && d.properties.aurora >= 40) return true;
        else return false;
      })
    }
    if(hoveredValue === 'a3') {
      hoveredDomain = 'aurora';
       filteredAurora = currentAuroraPolygons.features.filter(d => {
        if (d.properties.aurora < 80 && d.properties.aurora >= 60) return true;
        else return false;
      })
    }
    if(hoveredValue === 'a4') {
      hoveredDomain = 'aurora';
       filteredAurora = currentAuroraPolygons.features.filter(d => {
        if (d.properties.aurora <= 100 && d.properties.aurora >= 80) return true;
        else return false;
      })
    }

    /// filtering kp - using a clone of kpIndex
    if(hoveredValue === 'kp0') {
      hoveredDomain = 'kp';
      filteredKPClass = 'kpIndex level0';
      const kpToFilter = kpIndexForFiltering['2022-02-03']['sunGeojson']['features'];
      filteredKP =  kpToFilter.filter( d => {
        if (+d.properties.required_kp <= 1 )
        {
          d.properties.viewAurora = true;
          return true;
        }
        else return false;
      })
    }
    if(hoveredValue === 'kp1') {
      hoveredDomain = 'kp';
      filteredKPClass = 'kpIndex level1';
      const kpToFilter = kpIndexForFiltering['2022-02-03']['sunGeojson']['features'];
      filteredKP =  kpToFilter.filter( d => {
        if (+d.properties.required_kp <= 2)
        {
          d.properties.viewAurora = true;
          return true;
        }
        else return false;
      })
    }
    if(hoveredValue === 'kp2') {
      hoveredDomain = 'kp';
      filteredKPClass = 'kpIndex level2';
      const kpToFilter = kpIndexForFiltering['2022-02-03']['sunGeojson']['features'];
      filteredKP =  kpToFilter.filter( d => {
        if (+d.properties.required_kp <= 3)
        {
          d.properties.viewAurora = true;
          return true;
        }
        else return false;
      })
    }
    if(hoveredValue === 'kp3') {
      hoveredDomain = 'kp';
      filteredKPClass = 'kpIndex level3';
      const kpToFilter = kpIndexForFiltering['2022-02-03']['sunGeojson']['features'];
      filteredKP =  kpToFilter.filter( d => {
        if (+d.properties.required_kp <= 4)return true;
        else return false;
      })
    }

    if(hoveredValue === 'kp4') {
      hoveredDomain = 'kp';
      filteredKPClass = 'kpIndex level4';
      const kpToFilter = kpIndexForFiltering['2022-02-03']['sunGeojson']['features'];
      filteredKP =  kpToFilter.filter( d => {
        if (+d.properties.required_kp <= 5){
          d.properties.viewAurora = true;
          return true;
        }
        else return false;
      })
    }
    if(hoveredValue === 'kp5') {
      hoveredDomain = 'kp';
      filteredKPClass = 'kpIndex level5';
        const kpToFilter = kpIndexForFiltering['2022-02-03']['sunGeojson']['features'];
        filteredKP =  kpToFilter.filter( d => {
        if (+d.properties.required_kp <= 9)
        { 
          d.properties.viewAurora = true;
          return true;
        }
        else return false;
      })
    }

  const sizeValue = d => d.population;
  const maxRadius = width / 100;

  const sizeScale = scaleSqrt()
    .domain([0, max(swedishCities, sizeValue)])
    .range([3, maxRadius]);

  function auroraClick(e) {
    e.preventDefault()
    let k = document.getElementById("kp");
    let a = document.getElementById("aurora");
    let kScale = document.getElementById("kpScale");
    let aScale = document.getElementById("auroraScale");
    if (!visibleA){
      a.style.display = "flex";
      aScale.className  = "";
      if (visibleK) {
        setVisibleK(!visibleK)
        k.style.display = "none";
        kScale.className  = "hidden";
      }
    } else{
      a.style.display = "none";
      aScale.className  = "hidden";
    }
    setVisibleA(!visibleA);
  }

  function cloudClick(e) {
    e.preventDefault()
    setVisibleC(!visibleC);
  }

  function stationClick(e) {
    e.preventDefault()
    setVisibleS(!visibleS);
  }

  function kpIndexClick(e) {
    e.preventDefault()
    let k = document.getElementById("kp");
    let a = document.getElementById("aurora");
    let aScale = document.getElementById("auroraScale");
    let kScale = document.getElementById("kpScale");
    if (!visibleK){
      k.style.display = "flex";
      kScale.className = "";
      if (visibleA) {
        setVisibleA(!visibleA)
        a.style.display = "none";
        aScale.className  = "hidden";
      }
    } else{
      k.style.display = "none";
      kScale.className  = "hidden";
    }
    setVisibleK(!visibleK);

  }

  return (
    <>
      <div className='largeContainer'>
        <div className="containerLogo">
          <div className="aura-explora-logo">
            <AuraExploraLogo /></div>
        </div>

        <div className='containerFilters'>
          <div className="checkboxes">
          <h2>Filter by layers</h2>
            <div>
              <Checkbox className="checkbox" onClickEvent={auroraClick} isChecked={!visibleA} id="auroraCheckbox" labelText="Current probability of Aurora Borealis" />
              <div id="auroraScale" >
                <AuroraScale 
                  onHover={setHoveredValue} 
                  totalWidth={300} 
                  maxHeight={30} 
                  labels={["5-20%", "20-40%", "40-60%", "60-80%", "80-100%"]} 
                  ids={["a0", "a1", "a2", "a3", "a4"]}
                  scaleTitle="% probability of seeing Aurora Borealis" />
              </div>
              {/* <input className="checkbox" type="checkbox" name="stations" id="auroraCheckbox" onClick={() => setVisibleA(!visibleA)} defaultChecked={checked}
              onChange={() => setChecked(!checked)} />
              <label className="checkboxLabels" htmlFor="auroraCheckbox">Current probability of Aurora Borealis</label>  */}
            </div>

            <hr className='line' size="1" width="100%" color="white"></hr>
            <div>
              <Checkbox className="checkbox" onClickEvent={kpIndexClick} isChecked={!visibleK} id="kpIndexCheckbox" labelText="Kp Index" />
              <div id="kpScale" className='hidden'>
                <KPScale 
                  onHover={setHoveredValue} 
                  totalWidth={300} 
                  maxHeight={30} 
                  labels={["1","2", "3", "4", "5", "6-9"]} 
                  ids={["kp0", "kp1", "kp2", "kp3", "kp4", "kp5"]}
                  scaleTitle="KP index" />
                  <p>Hovering over the scale will show you the minimum KP value needed to have a possibility of seeing aurora in the highlighted area</p>
              </div>
            </div>

            <hr className='line' size="1" width="100%" color="white"></hr>
            <div id="cloudScale" >
              <Checkbox className="checkbox" onClickEvent={cloudClick} isChecked={!visibleC} id="cloudCheckbox" labelText="Cloudiness" />
              <CloudScale 
                onHover={setHoveredValue} 
                totalWidth={300} 
                maxHeight={30} 
                labels={["0-20%", "20-40%", "40-60%", "60-80%", "80-100%"]} 
                ids={["c0", "c1", "c2", "c3", "c4"]}
                scaleTitle="% of cloud coverage" />
              {/* <input className="checkbox" type="checkbox" name="clouds" id="cloudCheckbox" onClick={() => setVisibleC(!visibleC)} defaultChecked={checked}
              onChange={() => setChecked(!checked)}></input>
              <label className="checkboxLabels" htmlFor="cloudCheckbox">Cloudiness</label> */}
            </div>
            <hr className='line' size="1" width="100%" color="white"></hr>
            <div className="meteoContainer">
              <Checkbox className="checkbox" onClickEvent={stationClick} isChecked={!visibleS} id="stationCheckbox" labelText="Weather stations" />
              <svg className="stationIconLegend" width={20} height={20} x={20/2} y={20/2} viewBox="0 0 194 204" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <title>Group 3</title>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Group-3" fill="#FFFFFF">
                        <circle id="Oval" cx="98" cy="24" r="24"></circle>
                        <circle id="Oval-Copy-9" cx="24" cy="136" r="24"></circle>
                        <circle id="Oval-Copy-10" cx="170" cy="136" r="24"></circle>
                        <rect id="Rectangle" x="93" y="39" width="10" height="66"></rect>
                        <rect id="Rectangle-Copy-38" x="89" y="94" width="18" height="110"></rect>
                        <rect id="Rectangle-Copy-36" transform="translate(67.000000, 112.000000) rotate(-120.000000) translate(-67.000000, -112.000000) " x="62" y="79" width="10" height="66"></rect>
                        <rect id="Rectangle-Copy-37" transform="translate(129.000000, 112.000000) scale(-1, 1) rotate(-120.000000) translate(-129.000000, -112.000000) " x="124" y="79" width="10" height="66"></rect>
                        <rect id="Rectangle" x="67" y="186" width="62" height="18"></rect>
                    </g>
                </g>
              </svg>
              {/* <StationIcon className="stationIconLegend" style="position: absolute" width="20px" height="20px" x={0} y={0}/> */}
              {/* <input className="checkbox" type="checkbox" name="stations" id="stationsCheckbox" onClick={() => setVisibleS(!visibleS)} defaultChecked={checked}
              onChange={() => setChecked(!checked)}></input>
              <label className="checkboxLabels" htmlFor="stationsCheckbox">Meteorological stations stations</label>  */}
            </div>
          </div>
        </div>
        
        <div id="kp" className="containerInfoK">
          
          <p><h3>What is the Kp Index?</h3>The Kp index is a measurement of geomagnetic activity in Earth’s atmosphere. It can serve as an
            indicator of whether geomagnetic events (such as an aurora) are likely to happen. Based on its value,
            it is possible to estimate how far south geomagnetic activity can occur.<br></br><br></br>
            Learn more at the <a href="https://www.swpc.noaa.gov/">Space Weather Prediction Center </a>
            </p>
          
        </div>
        <div id="aurora" className="containerInfoA">
          
          <p><h3>What is the aurora?</h3> Aurora is a phenomenon which can be seen in the skies around the north and south poles. It occurs 
            when solar wind particles accelerate into the upper parts 
            of Earth's atmosphere, disturbing the magnetosphere. There has to be darkness and clear skies 
            in order to see the aurora.<br></br><br></br>
            The probability of seeing aurora computed through the OVATION model, which depends on solar wind 
            velocity and geomagnetic activity. If the solar wind data is not avaiable, an estimation can be made
            based on the measured Kp index.
            <br></br><br></br>
            Learn more at the <a href="https://www.swpc.noaa.gov/">Space Weather Prediction Center </a>
            </p>
        </div>

      </div>

      <MapInteractionCSS minScale={1} maxScale={5} showControls={true}>
        <svg width={width} height={height}>
          <World
            hovered={hoveredDomain}
            filtered={true}
            id="world"
            cities={swedishCities}
            sizeScale={sizeScale}
            sizeValue={sizeValue}
            countyArray={counties}
            surroundingCountries={surroundingCountries}
            currentAurora={currentAuroraPolygons.features}
            clouds={cloudsArray}
            dateTime={dateTime}
            kpIndex={kpIndex['2022-02-03']['sunGeojson']['features']}
            kpClass={kpClass}
            visibleC={visibleC}
            visibleS={visibleS}
            visibleA={visibleA}
            visibleK={visibleK}
          />
           <World
            hovered={null}
            filtered={false}
            id="world"
            cities={swedishCities}
            sizeScale={sizeScale}
            sizeValue={sizeValue}
            countyArray={counties}
            surroundingCountries={surroundingCountries}
            currentAurora={filteredAurora}
            clouds={filteredClouds}
            dateTime={dateTime}
            kpIndex={filteredKP}
            kpClass={filteredKPClass}
            visibleC={visibleC}
            visibleS={visibleS}
            visibleA={visibleA}
            visibleK={visibleK}
          />
        </svg>
      </MapInteractionCSS>

      <div className="containerDetails">
        <h2>(Date, Location)</h2>
        <DayLightTime />
        <DayCloudTime />
      </div>

    </>
  );
}

export default App;

// Components:
// Filters
//   -
//   -
//   -
// Map
// Timeline
//   -kp view
//   -cloud view
// Detail info
//   -sun
//   -cloud
