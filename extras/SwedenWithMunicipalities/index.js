import { select, json, geoPath, geoMercator, zoom,event } from 'd3'; //geoMercator works fine too
import {feature} from 'topojson';
const svg = select('svg');

const projection = geoMercator ()
		.center([0,67])
		.scale(1800)

const g =svg.append('g');
const height = 3000;
const width = 3000;

svg.call(zoom().scaleExtent([1,10]).on('zoom', () => {
  g.attr('transform',event.transform);
})
  );

const pathGenerator = geoPath().projection(projection);
//https://gist.githubusercontent.com/HarisVidimlic/cd3ae6e9ca6a3211f89c1e75e34db6c8/raw/sverige.json = regions
json('https://gist.githubusercontent.com/HarisVidimlic/2ee03c97f981175a0e15aa297c4f2243/raw/gistfile1.json') //municipalities
	.then(data => {
  	 console.log(data);
  	const SWE_adm2 = feature(data, data.objects.SWE_adm2)
     console.log(data);
  
  	g.selectAll('path').data(SWE_adm2.features)
  		.enter().append('path')
  		.attr('class','region')
  		.attr('d', pathGenerator)
  	.append ('title')
  		.text(d => (d.properties.NAME_2));
});

//change SWE_adm2 to SWE_adm1 if you want regions
//Check properties.NAME_1/2 or what else is wanted.






