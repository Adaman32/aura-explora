from sys import argv
from os.path import exists
import json
import requests

script, in_file, out_file = argv

data = json.load(open(in_file))

coordinates = data['coordinates']

geojson = { 
    "type": "FeatureCollection",
            "features": [
                {
                    "type":"Feature",
                    "geometry": { 
                        "type":"Point",
                        "coordinates": [coordinate[0], coordinate[1]]},
                        "properties": { 
                            "longitude" : coordinate[0],
                            "latitude" : coordinate[1],
                            "aurora" : coordinate[2]
                        }

                } 
                for coordinate in coordinates]
        }

output = open(out_file, 'w')
json.dump(geojson, output)


