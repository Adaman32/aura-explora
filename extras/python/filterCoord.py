from sys import argv
from os.path import exists
import json
import requests

script, in_file, out_file= argv


data = json.load(open(in_file))

filteredCoord = []
#print(len(data['features']))

for coord in data['features']:
	if (10 <= coord['geometry']['coordinates'][0] <= 25) and (55 <= coord['geometry']['coordinates'][1] <= 70):
		filteredCoord.append(coord)

print(len(filteredCoord))

newOut = {}
newOut['type'] = 'FeatureCollection'
newOut['features'] = filteredCoord

output = open(out_file, 'w')
json.dump(newOut, output)

