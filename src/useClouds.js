import { json } from 'd3';
import {useState, useEffect} from 'react';
// import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/Adaman32/f4176d6858cd1e17c9564289c9e99b98/raw/80586989423921a27d7efabe881294d98bf85dc8/cloudCoverage2.json';

export const useClouds = () => {
  const [data, setData] = useState(null);


  // console.log(data);

  useEffect(() => {
    json(jsonUrl).then(setData);
  }, []);

  let dataArray = [];
if(data){
  // // console.log(data.length);
  // data.forEach(element => {
  //   console.log(element);
  // });

  

  for(let key in data){
    let entry = data[key];
    // entry.name = key;
    dataArray.push(entry);
  }

  // console.log(dataArray);
}


  return dataArray;
}