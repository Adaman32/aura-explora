import { scaleSqrt, max } from 'd3';
import React, { useState, useLayoutEffect } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import './App.css';
import { World } from './World';
import { useCounties } from './useCounties';
import { useSurroundingCountries } from './useSurroundingCountries';
import { useSwedenCities } from './useSwedenCities';
import { useCurrentAurora } from './useCurrentAurora';
import { useClouds } from './useClouds';
import { useKpIndex } from './useKpIndex'
import AuraExploraLogo from './images/AuraExploraLogo'
import Checkbox from './checkbox';
import { AuroraScale, CloudScale, KPScale } from './FilterScale';
import { DayCloudTime, DayLightTime } from './DetailedInfo';
import { Timeline } from './Timeline';

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
  const [date, setDate] = React.useState(new Date(2022, 1, 3));

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [timelineMode, setTimelineMode] = useState('Cloudiness')
  // if(selectedLocation)console.log(selectedLocation.latitude);

  let kpClass = null;


  const start = new Date(2022, 0, 27);
  const end = new Date(2022, 1, 10, 23, 59);

  function dateTime(date) {
    const formattedDate = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}.${date.getSeconds().toString().padStart(2, '0')}${date.getMilliseconds().toString().padStart(4, '0')}`
    return formattedDate;
  };

  const [hoveredValue, setHoveredValue] = useState(null);
  const [lockedValueA, setLockedValueA] = useState(null);
  const [lockedValueC, setLockedValueC] = useState(null);
  const [lockedValueK, setLockedValueK] = useState(null);

  let hoveredDomain = "";
  let filteredClouds = [];
  let filteredAurora = [];
  let filteredKP = [];
  let filteredKPClass = kpClass;

  //const dateTime = '2022-02-03 12:00.000000';

  if (!swedishCities || !counties || !surroundingCountries || !currentAuroraPolygons || !cloudsArray || !kpIndex) {
    return <pre>Loading...</pre>
  }

  ///// Setting KP Color
  if (+kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] >= 0.0 && +kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] < 2.0) kpClass = 'kpIndex kpScale1';
  if (+kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] >= 2.0 && +kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] < 3.0) kpClass = 'kpIndex kpScale2';
  if (+kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] >= 3.0 && +kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] < 4.0) kpClass = 'kpIndex kpScale3';
  if (+kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] >= 4.0 && +kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] < 5.0) kpClass = 'kpIndex kpScale4';
  if (+kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] >= 5.0 && +kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] < 6.0) kpClass = 'kpIndex kpScale5';
  if (+kpIndex[date.toLocaleDateString('en-CA')]['kp-value'] >= 6.0) kpClass = 'kpIndex kpScale6';



  //// handling locking through scale
  function handleScaleClickAurora(newValue) {
    if (lockedValueA === null) {
      setLockedValueA(newValue);
    }
    else if (lockedValueA === newValue && lockedValueA !== null) {
      setLockedValueA(null);
    }
    else {
      setLockedValueA(newValue);
    }
  }

  function handleScaleClickClouds(newValue) {

    if (lockedValueC === null) {
      setLockedValueC(newValue);
    }
    else if (lockedValueC === newValue && lockedValueC !== null) {
      setLockedValueC(null);
    }
    else {
      setLockedValueC(newValue);
    }
  }

  function handleScaleClickKP(newValue) {
    if (lockedValueK === null) {
      setLockedValueK(newValue);
    }
    else if (lockedValueK === newValue && lockedValueK !== null) {
      setLockedValueK(null);
    }
    else {
      setLockedValueK(newValue);
    }
  }

  //// VISUAL FILTERING
  /// filtering clouds
  if (hoveredValue === 'c0' || lockedValueC === 'c0' && !hoveredValue) {
    hoveredDomain = 'clouds';
    filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime(date));
      if (!cloudValue) return false;
      if (cloudValue.cloudValue < 20 && cloudValue.cloudValue >= 0) return true;
      else return false;
    })
  }
  if (hoveredValue === 'c1' || lockedValueC === 'c1' && !hoveredValue) {
    hoveredDomain = 'clouds';
    filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime(date));
      if (!cloudValue) return false;
      if (cloudValue.cloudValue < 40 && cloudValue.cloudValue >= 20) return true;
      else return false;
    })
  }
  if (hoveredValue === 'c2' || lockedValueC === 'c2' && !hoveredValue) {
    hoveredDomain = 'clouds';
    filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime(date));
      if (!cloudValue) return false;
      if (cloudValue.cloudValue < 60 && cloudValue.cloudValue >= 40) return true;
      else return false;
    })
  }
  if (hoveredValue === 'c3' || lockedValueC === 'c3' && !hoveredValue) {
    hoveredDomain = 'clouds';
    filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime(date));
      if (!cloudValue) return false;
      if (cloudValue.cloudValue < 80 && cloudValue.cloudValue >= 60) return true;
      else return false;
    })
  }
  if (hoveredValue === 'c4' || lockedValueC === 'c4' && !hoveredValue) {
    hoveredDomain = 'clouds';
    filteredClouds = cloudsArray.filter(d => {
      const cloudValue = d.TotCloudCoverage.find(element => element.datetime === dateTime(date));
      if (!cloudValue) return false;
      if (cloudValue.cloudValue >= 80) return true;
      else return false;
    })
  }

  /// filtering aurora
  if (hoveredValue === 'a0' || lockedValueA === 'a0' && !hoveredValue) {
    hoveredDomain = 'aurora';
    // console.log('a0');
    filteredAurora = currentAuroraPolygons.features.filter(d => {
      if (d.properties.aurora < 20 && d.properties.aurora >= 0) return true;
      else return false;
    })
  }
  if (hoveredValue === 'a1' || lockedValueA === 'a1' && !hoveredValue) {
    hoveredDomain = 'aurora';
    // console.log('a1');
    filteredAurora = currentAuroraPolygons.features.filter(d => {
      if (d.properties.aurora < 40 && d.properties.aurora >= 20) return true;
      else return false;
    })
  }
  if (hoveredValue === 'a2' || lockedValueA === 'a2' && !hoveredValue) {
    // console.log('a2');
    hoveredDomain = 'aurora';
    filteredAurora = currentAuroraPolygons.features.filter(d => {
      if (d.properties.aurora < 60 && d.properties.aurora >= 40) return true;
      else return false;
    })
  }
  if (hoveredValue === 'a3' || lockedValueA === 'a3' && !hoveredValue) {
    // console.log('a3');
    hoveredDomain = 'aurora';
    filteredAurora = currentAuroraPolygons.features.filter(d => {
      if (d.properties.aurora < 80 && d.properties.aurora >= 60) return true;
      else return false;
    })
  }
  if (hoveredValue === 'a4' || lockedValueA === 'a4' && !hoveredValue) {
    // console.log('a4');
    hoveredDomain = 'aurora';
    filteredAurora = currentAuroraPolygons.features.filter(d => {
      if (d.properties.aurora <= 100 && d.properties.aurora >= 80) return true;
      else return false;
    })
  }

  /// filtering kp - using a clone of kpIndex
  if (hoveredValue === 'kp0' || lockedValueK === 'kp0' && !hoveredValue) {
    hoveredDomain = 'kp';
    filteredKPClass = 'kpIndex kpScale1';
    const kpToFilter = kpIndexForFiltering[date.toLocaleDateString('en-CA')]['sunGeojson']['features'];
    filteredKP = kpToFilter.filter(d => {
      if (+d.properties.required_kp <= 1) {
        d.properties.viewAurora = true;
        return true;
      }
      else return false;
    })
  }
  if (hoveredValue === 'kp1' || lockedValueK === 'kp1' && !hoveredValue) {
    hoveredDomain = 'kp';
    filteredKPClass = 'kpIndex kpScale2';
    const kpToFilter = kpIndexForFiltering[date.toLocaleDateString('en-CA')]['sunGeojson']['features'];
    filteredKP = kpToFilter.filter(d => {
      if (+d.properties.required_kp <= 2) {
        d.properties.viewAurora = true;
        return true;
      }
      else return false;
    })
  }
  if (hoveredValue === 'kp2' || lockedValueK === 'kp2' && !hoveredValue) {
    hoveredDomain = 'kp';
    filteredKPClass = 'kpIndex kpScale3';
    const kpToFilter = kpIndexForFiltering[date.toLocaleDateString('en-CA')]['sunGeojson']['features'];
    filteredKP = kpToFilter.filter(d => {
      if (+d.properties.required_kp <= 3) {
        d.properties.viewAurora = true;
        return true;
      }
      else return false;
    })
  }
  if (hoveredValue === 'kp3' || lockedValueK === 'kp3' && !hoveredValue) {
    hoveredDomain = 'kp';
    filteredKPClass = 'kpIndex kpScale4';
    const kpToFilter = kpIndexForFiltering[date.toLocaleDateString('en-CA')]['sunGeojson']['features'];
    filteredKP = kpToFilter.filter(d => {
      if (+d.properties.required_kp <= 4) {
        d.properties.viewAurora = true;
        return true;
      }
      else return false;
    })
  }

  if (hoveredValue === 'kp4' || lockedValueK === 'kp4' && !hoveredValue) {
    hoveredDomain = 'kp';
    filteredKPClass = 'kpIndex kpScale5';
    const kpToFilter = kpIndexForFiltering[date.toLocaleDateString('en-CA')]['sunGeojson']['features'];
    filteredKP = kpToFilter.filter(d => {
      if (+d.properties.required_kp <= 5) {
        d.properties.viewAurora = true;
        return true;
      }
      else return false;
    })
  }
  if (hoveredValue === 'kp5' || lockedValueK === 'kp5' && !hoveredValue) {
    hoveredDomain = 'kp';
    filteredKPClass = 'kpIndex kpScale6';
    const kpToFilter = kpIndexForFiltering[date.toLocaleDateString('en-CA')]['sunGeojson']['features'];
    filteredKP = kpToFilter.filter(d => {
      if (+d.properties.required_kp <= 9) {
        d.properties.viewAurora = true;
        return true;
      }
      else return false;
    })
  }

  const sizeValue = d => d.population;
  const maxRadius = width / 400;
  const maxFontSize = 4;

  const sizeScale = scaleSqrt()
    .domain([0, max(swedishCities, sizeValue)])
    .range([1, maxRadius]);

  const fontSizeScale = scaleSqrt()
    .domain([0, max(swedishCities, sizeValue)])
    .range([3, maxFontSize]);

  function auroraClick(e) {
    e.preventDefault()
    let kScale = document.getElementById("kpScale");
    let aScale = document.getElementById("auroraScale");
    if (!visibleA) {
      aScale.className = "";
      if (visibleK) {
        setVisibleK(!visibleK)
        kScale.className = "hidden";
      }
    } else {
      aScale.className = "hidden";
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
    let aScale = document.getElementById("auroraScale");
    let kScale = document.getElementById("kpScale");
    if (!visibleK) {
      kScale.className = "";
      if (visibleA) {
        setVisibleA(!visibleA)
        aScale.className = "hidden";
      }
    } else {
      kScale.className = "hidden";
    }
    setVisibleK(!visibleK);
  }

  var popupkClicked = false;
  var popupaClicked = false;
  var popupkHovered = false;
  var popupaHovered = false;

  function kpInfoClick() {

    var popupk = document.getElementById("kp");
    var popupa = document.getElementById("aurora");

    if (!popupkClicked) {
      popupk.classList.add("show");
      popupkClicked = true;
      popupkHovered = false;
      if (popupa.classList.contains("show")) {
        popupa.classList.remove("show");
        popupaClicked = false;
        popupaHovered = false;
      }
    } else if (!popupkHovered) {
      popupk.classList.remove("show");
      popupkClicked = false;
      popupkHovered = false;
    }

  }

  function auroraInfoClick() {

    var popupk = document.getElementById("kp");
    var popupa = document.getElementById("aurora");

    if (!popupaClicked) {
      popupa.classList.add("show");
      popupaClicked = true;
      popupaHovered = false;
      if (popupk.classList.contains("show")) {
        popupk.classList.remove("show");
        popupkClicked = false;
        popupkHovered = false;
      }
    } else if (!popupaHovered) {
      popupa.classList.remove("show");
      popupaClicked = false;
      popupaHovered = false;
    }
  }

  function kpInfoHover() {
    var popupk = document.getElementById("kp");

    if (!popupkClicked && !popupkHovered) {
      popupk.classList.add("show");
      popupkHovered = true;
    }
  }

  function auroraInfoHover() {

    var popupa = document.getElementById("aurora");

    if (!popupaClicked && !popupaHovered) {
      popupa.classList.add("show");
      popupaHovered = true;
    }
  }

  function kpInfoLeave() {
    var popupk = document.getElementById("kp");
    if (popupkHovered) {
      popupk.classList.remove("show");
      popupkHovered = false;
    }
  }

  function auroraInfoLeave() {
    var popupa = document.getElementById("aurora");
    if (popupaHovered) {
      popupa.classList.remove("show");
      popupaHovered = false;
    }
  }

  function changeTimeline() {
    var select = document.getElementById("selectTimeline");
    if (select.value == 'kp') {
      setTimelineMode('KP-Index');
    } else {
      setTimelineMode('Cloudiness');
    }
  }




  const dateHistogramSize = 0.2;

  return (
    <>
      <div className='largeContainer'>
        <div className="containerLogo">
          <div className="aura-explora-logo">
            <AuraExploraLogo /></div>
        </div>


        <div className='containerFilters'>
          <div className="checkboxes">
            <h1>Filter by layers</h1>
            <div>
              <Checkbox className="checkbox" onClickEvent={auroraClick} isChecked={!visibleA} id="auroraCheckbox" labelText="Current probability of Aurora Borealis" />

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="qlogo" width='16px'>
                <circle r="8px" className='infoClick' />
                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 
                  12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 
                  13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 
                  83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
                />
                <circle className="infoClick" cx="50%" cy="50%" r="50%" onClick={auroraInfoClick} onMouseOver={auroraInfoHover} onMouseLeave={auroraInfoLeave} ></circle>
              </svg>

              <div id="auroraScale">
                <AuroraScale
                  onHover={setHoveredValue}
                  lockedValueSetter={handleScaleClickAurora}
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
              <Checkbox className="checkbox" onClickEvent={kpIndexClick} isChecked={!visibleK} id="kpIndexCheckbox" labelText="Kp-index" />
              <svg className="qlogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='15px' >
                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 
              12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 
              13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 
              83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"/>
                <circle className="infoClick" cx="50%" cy="50%" r="50%" onClick={kpInfoClick} onMouseOver={kpInfoHover} onMouseLeave={kpInfoLeave}></circle>
              </svg>
              <div id="kpScale" className='hidden'>
                <KPScale
                  onHover={setHoveredValue}
                  lockedValueSetter={handleScaleClickKP}
                  totalWidth={300}
                  maxHeight={30}
                  labels={["1", "2", "3", "4", "5", "6+"]}
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
                lockedValueSetter={handleScaleClickClouds}
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
              <svg className="stationIconLegend" width={20} height={20} x={20 / 2} y={20 / 2} viewBox="0 0 194 204" version="1.1" xmlns="http://www.w3.org/2000/svg">
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

        <div className="popup" onClick={kpInfoClick}>
          <div id="kp" className="containerInfo">

            <div><h3>What is the Kp index?</h3><p>The Kp index is a measurement of geomagnetic activity in Earth’s atmosphere. It can serve as an
              indicator of whether geomagnetic events (such as an aurora) are likely to happen. Based on its value,
              it is possible to estimate how far south geomagnetic activity can occur.<br></br><br></br>
              Learn more at the <a href="https://www.swpc.noaa.gov/">Space Weather Prediction Center </a>
            </p></div>

          </div>
        </div>
        <div className="popup" onClick={auroraInfoClick}>
          <div id="aurora" className="containerInfo">

            <div><h3>What is the aurora?</h3> <p>Aurora Borealis is a phenomenon which can be seen in the skies around the north pole. It occurs
              when solar wind particles accelerate into the upper parts
              of Earth's atmosphere, disturbing the magnetosphere. There has to be darkness and clear skies
              in order to see the aurora.<br></br><br></br>
              The probability of seeing aurora computed through the OVATION model, which depends on solar wind
              velocity and geomagnetic activity. If the solar wind data is not avaiable, an estimation can be made
              based on the measured Kp index.
              <br></br><br></br>
              Learn more at the <a href="https://www.swpc.noaa.gov/">Space Weather Prediction Center </a>
            </p></div>
          </div>
        </div>

      </div>

      <div className="cityLegend">
          <h3>Population per city</h3>
          <svg className="legend" height="30" width="150">
            <line x1="20" y1="8" x2="130" y2="8" stroke="#103a9b" strokeWidth="1.5"></line>
            <circle cx="20" cy="8" r="3" stroke="none" strokeWidth="3" fill="#103a9b" />
            <circle cx="75" cy="8" r="6" stroke="none" strokeWidth="3" fill="#103a9b" />
            <circle cx="130" cy="8" r="8" stroke="none" strokeWidth="3" fill="#103a9b" />
            <text x='0' y='30' fill='white' fontSize='0.6em'>{'<'} 3430</text>
            <text x='110' y='30' fill='white' fontSize='0.6em'>972 657</text>
          </svg>
        </div>

      <MapInteractionCSS minScale={1} maxScale={5} showControls={true}>
        <svg width={width} height={height}>
          <World
            hovered={hoveredDomain}
            lockedA={lockedValueA}
            lockedC={lockedValueC}
            lockedK={lockedValueK}
            filtered={true}
            id="world"
            cities={swedishCities}
            sizeScale={sizeScale}
            fontSizeScale={fontSizeScale}
            sizeValue={sizeValue}
            countyArray={counties}
            surroundingCountries={surroundingCountries}
            currentAurora={currentAuroraPolygons.features}
            clouds={cloudsArray}
            dateTime={dateTime(date)}
            date={date}
            kpIndex={kpIndex[date.toLocaleDateString('en-CA')]['sunGeojson']['features']}
            kpClass={kpClass}
            visibleC={visibleC}
            visibleS={visibleS}
            visibleA={visibleA}
            visibleK={visibleK}
            setSelected={setSelectedLocation}
            setSunset={setSunset}
            dateHistogramSize={dateHistogramSize}
          />
          <World
            hovered={null}
            filtered={false}
            lockedA={lockedValueA}
            lockedC={lockedValueC}
            lockedK={lockedValueK}
            id="world2"
            cities={swedishCities}
            sizeScale={sizeScale}
            fontSizeScale={fontSizeScale}
            sizeValue={sizeValue}
            countyArray={counties}
            surroundingCountries={surroundingCountries}
            currentAurora={filteredAurora}
            clouds={filteredClouds}
            dateTime={dateTime(date)}
            kpIndex={filteredKP}
            kpClass={filteredKPClass}
            visibleC={visibleC}
            visibleS={visibleS}
            visibleA={visibleA}
            visibleK={visibleK}
            setSelected={setSelectedLocation}
            setSunset={setSunset}
            dateHistogramSize={dateHistogramSize}
          />

        </svg>
      </MapInteractionCSS>
      <div className='timelineContainer'>
        <div className='selectWrapper'>
          <select id="selectTimeline" className="dropdown" onChange={changeTimeline}>
            <option value="cloud">Cloudiness</option>
            <option value="kp">Kp-index</option>
          </select>
          <p>Selecting a location on the map shows the forecast and history for that location on the timeline</p>
        </div>
        <div className='timelineWrapper'>
          <svg style={{ transform: 'translate(-50%)' }} width={width * 0.90} height='100%' viewBox={'0 0 ' + width + ' ' + dateHistogramSize * height} className="timelineBottom" >
            <Timeline
              kpIndex={kpIndex}
              selectedLocation={selectedLocation}
              width={width}
              height={dateHistogramSize * height}
              setDate={setDate}
              currentDate={date}
              startDate={start}
              endDate={end}
              mode={timelineMode}
            />
          </svg>
        </div>


      </div>
      <div className="containerDetails">
        <h2>
          {selectedLocation ? selectedLocation.name : 'Please select a location on the map to view details'} - {date && selectedLocation ? date.toDateString() : ''}
        </h2>
        <DayLightTime width={300} sunrise={sunset ? sunset.properties.sunrise : null} sunset={sunset ? sunset.properties.sunset : null} location={selectedLocation} />
        <svg width={300} height={150} viewBox={'20 0 300 150'} >
          <DayCloudTime width={300} height={150} date={date} location={selectedLocation} />
        </svg>

      </div>
    </>
  );
}

export default App;
