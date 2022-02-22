import json

# Testing testing stuff...

def main():
    #totClouds = json.load(open("totalClouds.json"))
    #print(len(totClouds.keys()))
    """ filteredAurora = json.load(open("4feb_auroraFiltered.json"))
    print(len(filteredAurora['features']))
    for feature in filteredAurora['features']:
        print(feature['geometry']['coordinates']) """
    #print(totClouds['188790']['TotCloudCoverage'])

    #auroraPoints = json.load(open("AuraExplora\data files\currentAurora3febFiltered.json"))
    #print(len(auroraPoints['features']))

    #auroraPolygon = json.load(open(r"AuraExplora\data files\aurora_3feb_polygonGeo.json"))
    #print(len(auroraPolygon['features']))

    #sunSthlmPeriod = json.load(open("AuraExplora\data files\sunToday.json"))
    #print(sunSthlmPeriod['2022-02-10']['features'])

    """ sunSwe = json.load(open(r"AuraExplora\data files\sunAuroraSwe.json"))
    for date in sunSwe.keys():
        print(len(sunSwe[date]['sunGeojson']['features'])) """
    
    t = 0
    f=0
    sun = json.load(open(r"AuraExplora/data files/sunKp_polygon.json"))
    for date in sun['2022-02-03']['sunGeojson']['features']:
        if date['properties']['viewAurora'] == True:
            t = t+1
        elif date['properties']['viewAurora'] == False:
            f = f+1
    print("t: "+str(t))
    print("f: ",str(f))


    #print(len(sun.keys()))
        

    #StationsJson2Geojson(totClouds)



main()

