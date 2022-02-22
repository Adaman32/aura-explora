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
import { AuroraScale, CloudScale } from './AuroraScale';
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
  const [visibleC, setVisibleC] = React.useState(true);
  const [visibleS, setVisibleS] = React.useState(true);
  const [visibleA, setVisibleA] = React.useState(true);
  const [visibleK, setVisibleK] = React.useState(false);
  // const [checked, setChecked] = React.useState(true);

  // console.log(counties);
  if (!swedishCities || !counties || !surroundingCountries || !currentAuroraPolygons || !cloudsArray || !kpIndex) {
    return <pre>Loading...</pre>
  }

  const sizeValue = d => d.population;
  const maxRadius = width / 100;

  const sizeScale = scaleSqrt()
    .domain([0, max(swedishCities, sizeValue)])
    .range([3, maxRadius]);

  function auroraClick(e) {
    e.preventDefault()
    var k = document.getElementById("kp");
    var a = document.getElementById("aurora");
    if (!visibleA){
      a.style.display = "flex";
      if (visibleK) {
        setVisibleK(!visibleK)
        k.style.display = "none";
      }
    } else{
      a.style.display = "none";
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
    var k = document.getElementById("kp");
    var a = document.getElementById("aurora");
    if (!visibleK){
      k.style.display = "flex";
      if (visibleA) {
        setVisibleA(!visibleA)
        a.style.display = "none";
      }
    } else{
      k.style.display = "none";
    }
    setVisibleK(!visibleK);

  }

  return (
    <>
      <div className='largeContainer'>
        <div className="containerLogo">
          <div className="aura-explora-logo"><AuraExploraLogo /></div>
        </div>
        <div className='containerFilters'>
          <h2>Filter by layers</h2>
          <div className="checkboxes">
            <div>
              <Checkbox className="checkbox" onClickEvent={auroraClick} isChecked={!visibleA} id="auroraCheckbox" labelText="Current probability of Aurora Borealis" />
              <AuroraScale totalWidth={300} totalHeight={30} labels={["5-20%", "20-40%", "40-60%", "60-80%", "80-100%"]} scaleTitle="% probability of seeing Aurora Borealis" />
              {/* <input className="checkbox" type="checkbox" name="stations" id="auroraCheckbox" onClick={() => setVisibleA(!visibleA)} defaultChecked={checked}
              onChange={() => setChecked(!checked)} />
              <label className="checkboxLabels" htmlFor="auroraCheckbox">Current probability of Aurora Borealis</label>  */}
            </div>

            <hr className='line' size="1" width="100%" color="white"></hr>
            <div>
              <Checkbox className="checkbox" onClickEvent={kpIndexClick} isChecked={!visibleK} id="kpIndexCheckbox" labelText="Kp Index" />
            </div>

            <hr className='line' size="1" width="100%" color="white"></hr>
            <div>
              <Checkbox className="checkbox" onClickEvent={cloudClick} isChecked={!visibleC} id="cloudCheckbox" labelText="Cloudiness" />
              <CloudScale totalWidth={300} totalHeight={30} labels={["0-20%", "20-40%", "40-60%", "60-80%", "80-100%"]} scaleTitle="% of cloud coverage" />
              {/* <input className="checkbox" type="checkbox" name="clouds" id="cloudCheckbox" onClick={() => setVisibleC(!visibleC)} defaultChecked={checked}
              onChange={() => setChecked(!checked)}></input>
              <label className="checkboxLabels" htmlFor="cloudCheckbox">Cloudiness</label> */}
            </div>
            <hr className='line' size="1" width="100%" color="white"></hr>
            <div className="meteoContainer">
              <Checkbox className="checkbox" onClickEvent={stationClick} isChecked={!visibleS} id="stationCheckbox" labelText="Weather stations" />
              <StationIcon width="20px" height="20px" />
              {/* <input className="checkbox" type="checkbox" name="stations" id="stationsCheckbox" onClick={() => setVisibleS(!visibleS)} defaultChecked={checked}
              onChange={() => setChecked(!checked)}></input>
              <label className="checkboxLabels" htmlFor="stationsCheckbox">Meteorological stations stations</label>  */}
            </div>
          </div>
        </div>
        <div id="kp" className="containerInfoK">
          <h3>What is the KP Index?</h3>
          <p>The KP index is a measurement of geomagnetic activity in the Earth’s atmosphere. It can serve as an
            indicator of whether geomagnetic events (such as Aurora) are likely to happen. Based on its value,
            it is possible to estimate how far south can geomagnetic activity occur.</p>
          
        </div>
        <div id="aurora" className="containerInfoA">
          <h3>What is Aurora Borealis?</h3>
          <p></p>
        </div>

      </div>

      <MapInteractionCSS minScale={1} maxScale={5} showControls={true}>
        <svg width={width} height={height}>
          <World
            id="world"
            cities={swedishCities}
            sizeScale={sizeScale}
            sizeValue={sizeValue}
            countyArray={counties}
            surroundingCountries={surroundingCountries}
            currentAurora={currentAuroraPolygons}
            clouds={cloudsArray}
            kpIndex={kpIndex}
            visibleC={visibleC}
            visibleS={visibleS}
            visibleA={visibleA}
            visibleK={visibleK}
          />
        </svg>
      </MapInteractionCSS>

      <div className="containerDetails">
        <h1>Today</h1>
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
