import { json } from 'd3';
import {useState, useEffect} from 'react';
// import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/Adaman32/94dcbad0c9574e9e9d8f261e6aae984b/raw/1189524fb9b1511711727ce76f08d89108ff51c2/currentAuroraSimulation.json';

export const useCurrentAurora = () => {
  const [data, setData] = useState(null);

  // console.log(data);

  useEffect(() => {
    json(jsonUrl).then(setData);
  }, []);

  return data;
}