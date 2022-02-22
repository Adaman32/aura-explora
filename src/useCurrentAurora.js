import { json } from 'd3';
import {useState, useEffect} from 'react';
// import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/Adaman32/4c5b37ce2796a59768a8bbe5b07120fa/raw/bf4ff3b4de4cd38979466be29c96f592b213ff9b/currentAuroraPolygons.json';

export const useCurrentAurora = () => {
  const [data, setData] = useState(null);

  // console.log(data);

  useEffect(() => {
    json(jsonUrl).then(setData);
  }, []);

  return data;
}