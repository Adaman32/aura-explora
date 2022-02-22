import { json } from 'd3';
import {useState, useEffect} from 'react';
import { feature } from 'topojson';

const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

export const useSurroundingCountries = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(jsonUrl).then(topojsonData => {
        const {countries} = topojsonData.objects;
        setData({
            countries: feature(topojsonData, countries),
            // borders: mesh(topojsonData, countries, (a,b) => a !== b),
            // countryId:countries.id
        });
    });
  }, []);

  
  if(data){
    data.countries.features = data.countries.features.filter(function(d) {if( d.properties.name == "Finland" ||  d.properties.name == "Norway" ||  d.properties.name == "Denmark") return true});
  }

  return data;
}