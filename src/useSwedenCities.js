import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl = "https://gist.githubusercontent.com/Adaman32/f905cb2f25dac3410862736255be7208/raw/791163d9dcea6e7f315c87093ae4d9d497a7fdfa/swedishCities.csv"
export const useSwedenCities = () =>{
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let cancel = false;

    const row = (d) => {
      d.lat = +d.lat;
      d.lng = +d.lng;
      d.population = +d.population;
      return d;
    };

    csv(csvUrl, row).then((data) => {
      if(cancel) return;
      setData(data);
      // console.log(data);
    });

    return () => {
      cancel = true;
    }

  }, []);

  return data;
}