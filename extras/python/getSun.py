import json
import requests
import datetime
import csv
from interpolate import interpolateSun

def main():
    # Lat(float) in decimal degrees
    # Lng(float) in decimal degrees
    # Date(str) formated YYYY-MM-DD
    URL="https://api.sunrise-sunset.org/json"
    longs = [format(val, ".6f") for val in [*range(10, 26)]]
    lats = [format(val, ".6f") for val in [*range(55, 71)]]
    
    # List of days to query 
    startDate = datetime.date(2022, 1, 27)
    numDays = 15
    dateList = []
    for day in range(numDays):
        date = (startDate + datetime.timedelta(days = day)).isoformat()
        dateList.append(date)
    # GetSunPeriod(URL, dateList, lats, longs)

    #SunAuroraPropabilty()
    #SunAddKp()
    Sun2GeoPolygon()
    #FilterSunKpData()
    
def SunAuroraPropabilty():
    kpLong = [*range(10,26,3)]
    kpLat = [*range(55,71,3)]
    sun = json.load(open(r"AuraExplora\extras\data files\sunKp_points.json"))
    kp = json.load(open(r"AuraExplora\extras\data files\coords_convertion.json"))

    for datevalue in sun.values():
     
        for feature in datevalue['sunGeojson']['features']:
            #print(feature.keys())
            sunLong = float(feature['geometry']['coordinates'][1])
            sunLat = float(feature['geometry']['coordinates'][0])
            closestKpLong = min(kpLong, key=lambda x:abs(x-sunLong))
            closestKpLat = min(kpLat, key=lambda x:abs(x-sunLat))
            closestKpCoord = str(closestKpLong)+', '+str(closestKpLat)
            
            feature['properties']['required_kp'] = kp[closestKpCoord]['required_kp']
            if datevalue['kp-value'] >= kp[closestKpCoord]['required_kp']:
                feature['properties']['viewAurora'] = True
                
            elif datevalue['kp-value'] < kp[closestKpCoord]['required_kp']:
                feature['properties']['viewAurora'] = False
    outSun = open("sunkpSwe.json", "w")
    json.dump(sun, outSun)


def SunAddKp():
    kpTimeperiod = {}
    # Notice the local path
    with open(r"C:\Users\manda\Documents\KTH\DH2321 Information Visualization\Project\AuraExplora\data files\kp_index.csv") as kpcsv:
        reader1 = csv.DictReader(kpcsv)
        for row in reader1:
            date = row[r'ï»¿YYYY']+'-0'+row['MM']+'-'+row['DD']
            kpTimeperiod[date] = row['max_Kp']

    sun = json.load(open(r"AuraExplora\data files\sunSwe.json"))
    for sunkey, sunvalue in sun.items():
        for kpkey, kpvalue in kpTimeperiod.items():
            if sunkey == kpkey:
                newsunval = {'kp-value':kpvalue, 'sunGeojson':sunvalue}
                sun[sunkey] = newsunval
    outsunkp = open(r"AuraExplora\data files\sunKpSwe.json", "w")
    json.dump(sun, outsunkp)
    
def convertCoord(): 
    coordConvertion = json.load(open(r"AuraExplora\data files\coords_convertion.json"))

    requiredkp = {}
    with open(r"AuraExplora\data files\kp_for_latitude.csv") as kpcsv:
        reader = csv.DictReader(kpcsv)
        for row in reader:
            requiredkp[row['Magnetic lat']] = row['Kp']
    
    for key1, value1 in coordConvertion.items():
        for key2, value2 in requiredkp.items():
            print(value1['magnetic lat'])
            print(key2)
            if value1['magnetic lat'] >= float(key2):
                if not 'required_kp' in coordConvertion[key1]:
                    coordConvertion[key1]['required_kp'] = value2
    
    outCoord = open(r"AuraExplora\data files\coords_convertion2.json", "w")
    json.dump(coordConvertion, outCoord)
    outCoord.close()

def FilterSunKpData():
    # Filter sun data
    sunKp = json.load(open(r"AuraExplora\data files\fullSunKp_points.json"))
    for datavalue in sunKp.values():
        for coord in datavalue['sunGeojson']['features']:
            del coord['properties']['civil_twilight_begin']
            del coord['properties']['civil_twilight_end']
            del coord['properties']['nautical_twilight_begin']
            del coord['properties']['nautical_twilight_end']
            del coord['properties']['astronomical_twilight_begin']
            del coord['properties']['astronomical_twilight_end']
    
    outSun = open(r"sunKp_points.json", "w")
    json.dump(sunKp, outSun)
    return

def Sun2GeoPolygon():
    sun = json.load(open(r"sunkpSwe.json"))

    geoPolys = {}
    geoPoly = { 
        "type": "FeatureCollection",
            "features": []
            }
    i = 0
    p = 0
    # Fixed wrong order of long and lat 
    for datevalue in sun.values():
        for value in datevalue['sunGeojson']['features']:
            value['geometry']['type'] = 'Polygon'
            lat = value['geometry']['coordinates'][0]
            long = value['geometry']['coordinates'][1]
            polygon = interpolateSun(long, lat)
            value['properties']['longitude']= long
            value['properties']['latitude']= lat
            value['geometry']['coordinates'] = polygon['coordinates']
              
    outSun = open(r"sunKp_polygon.json", "w")
    json.dump(sun, outSun)

    return


def GetSunPeriod(URL, dateList, lats, longs):
    sunData = {}

    for date in dateList:
        sunData[date] = { 
        "type": "FeatureCollection",
            "features": []
            }
        #print(sunData)

        for lat in lats:
            for long in longs:
                #print(lat)
                #print(long)
                #print(sunData)
                data = GetSunURL(URL, lat, long, date)
                sunData[date]["features"].append(
                        {
                            "type":"Feature",
                            "geometry": {
                                "type":"Point",
                                "coordinates": [lat, long]
                            },
                            "properties": {
                                "sunrise":data['results']['sunrise'],
                                "sunset":data['results']['sunset'],
                                "civil_twilight_begin":data['results']['civil_twilight_begin'],
                                "civil_twilight_end":data['results']['civil_twilight_end'],
                                "nautical_twilight_begin":data['results']['nautical_twilight_begin'],
                                "nautical_twilight_end":data['results']['nautical_twilight_end'],
                                "astronomical_twilight_begin":data['results']['astronomical_twilight_begin'],
                                "astronomical_twilight_end":data['results']['astronomical_twilight_end'],
                            }
                        })

    # = {"date": {...geojson}, "date2":{}}
    
    output = open("AuraExplora/data files/sunToday.json", "w")
    json.dump(sunData, output)

def GetSunURL(URL, lat, lng, date):
    query = {"lat": lat, "lng": lng, "date":date}
    try:
        response = requests.get(URL, params=query)
        data = response.json()
    except requests.exceptions.HTTPError as error:
        print(error)
    else:
        return data 

main()
