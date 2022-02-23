import { json } from 'd3';
import {useState, useEffect} from 'react';
// import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/Amandisen/b9caad066f69056a850647f7ad59cb38/raw/8dc1dd8650e38b6cbc21ffcd3fe90b005e3c9459/totalCloudsFiltered.json';

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