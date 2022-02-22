import { json } from 'd3';
import {useState, useEffect} from 'react';
import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/Adaman32/6bdef05eb45b66635f1c659eb55139cc/raw/c48600dae8ee004f9eb499640da50235886be31f/swedishCounties.json';
export const useCounties = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(jsonUrl).then(topojsonData => {
        const {counties} = topojsonData.objects;

        setData({
            counties: feature(topojsonData, counties),
            interiors: mesh(topojsonData, counties, (a,b) => a !== b),
        });
    });
  }, []);

  return data;
}