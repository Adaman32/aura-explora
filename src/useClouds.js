import { json } from 'd3';
import {useState, useEffect} from 'react';
// import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/Adaman32/4f54265cdc4fa1cc7e045ffe4aeea492/raw/20812e78cbaeae417346e0a074ca528521d7c313/cloudCoverage.json';

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