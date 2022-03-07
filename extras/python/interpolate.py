import json

def main():

    # Interpolate and covert to geojson, type: polygons, for current aurora 
    currentAuroraGeo = json.load(open("AuraExplora\extras\data files\currentAurora3febFiltered.json"))
    currentAuroraPolygon = interpolate(currentAuroraGeo)

    outputCurrentAurora = open("AuraExplora/extras/data files/aurora_3feb_polygonGeo.json", "w")
    json.dump(currentAuroraPolygon, outputCurrentAurora)

    # Interpolate and convert to geojson, type: polygons, for sun data

def interpolate(coordsGeo):  
    geoPoly = { 
        "type": "FeatureCollection",
            "features": []
            }
    for coord in coordsGeo['features']:
        
        long = float(coord['geometry']['coordinates'][0])
        lat = float(coord['geometry']['coordinates'][1])
    
        geoPoly['features'].append({
            "type":"Feature",
            "geometry": { 
                "type":"Polygon",
                "coordinates": [[[(long-0.5),(lat-0.5)],[(long+0.5),(lat-0.5)],[(long+0.5),(lat+0.5)],[(long-0.5),(lat+0.5)],[(long-0.5),(lat-0.5)]]]},
                "properties": coord['properties']
                })
    print(geoPoly)
    return(geoPoly)

def interpolateSun(long, lat):
    long = float(long)
    lat = float(lat)
    polygon = {"coordinates": [[[(long-0.5),(lat-0.5)],[(long+0.5),(lat-0.5)],[(long+0.5),(lat+0.5)],[(long-0.5),(lat+0.5)],[(long-0.5),(lat-0.5)]]],
            }
    return(polygon)


main()