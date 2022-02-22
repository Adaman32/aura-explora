import requests
import json
from datetime import datetime

def main():
    period = "/period/latest-months"
    
    startTime = datetime(2022, 1, 27, 00, 00)
    endTime = datetime(2022, 2, 10, 23, 59)

    URL = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/16"

    stations = GetStations(URL)
    #print(stations.keys())

    # Get total cloud coverage data for each station
    # Remove stations with no data for total cloud coverage the given time
    noCloudData = []

    for station in stations.keys():
        clouds =  GetClouds(URL, period, station, startTime, endTime)
        #print(clouds)
        stations[station]["TotCloudCoverage"] = clouds

        if clouds == None:
           noCloudData.append(station)
    

    for station in noCloudData:
        del stations[station]
    
    #StationsJson2Geojson(stations)
        

    # Write data to file
    outputFile = open("AuraExplora/data files/totalClouds.json", "w")
    json.dump(stations, outputFile)


# Get all stations that are active and within our area of interest
def GetStations(URL):
    stations = {}
    response = requests.get(URL+".json")
    data = response.json()
    for station in data['station']:
        if (10 <= station['longitude'] <= 25) and (55 <= station['latitude'] <= 70) and (station['active']):
            stations[station['id']] = {"longitude":station['longitude'],"latitude":station['latitude'], "name":station['name']}
    return(stations)

# Convert only station coordinate data to geojson
def StationsJson2Geojson(stations):
    stationsGeojson = { 
    "type": "FeatureCollection",
            "features": [
                {
                    "type":"Feature",
                    "geometry": { 
                        "type":"Point",
                        "coordinates": [stations[station]['longitude'], stations[station]['latitude']]},
                        "properties": { 
                            "longitude" : stations[station]['longitude'],
                            "latitude" : stations[station]['latitude'],
                            "stationID" : stations[station]
                        }

                } 
                for station in stations.keys()]
        }
    output = open("AuraExplora/data files/stationsGeojson.json", "w")
    json.dump(stationsGeojson, output)
    return

# Get total cloud coverage for one station within desired timeframe 
def GetClouds(URL, period, station, startTime, endTime):
    startEpoch = startTime.timestamp()
    endEpoch = endTime.timestamp()
    
    try:
        response = requests.get(URL+"/station/"+str(station)+period+"/data.json")
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as error:
        print(error)
        #print("No total cloud coverage available for station with id:"+str(station))
    else:
        clouds = []
        for entry in data['value']:
            if startEpoch <= entry['date']/1000 <= endEpoch:
                dateTime = datetime.fromtimestamp(entry['date']/1000).strftime('%Y-%m-%d %H:%M.%f')
                clouds.append({"timestamp":entry['date'], "datetime":dateTime, "cloudValue":entry['value']})
        
        return(clouds)
    
main()