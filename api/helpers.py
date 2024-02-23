import requests, json

def get_osm_display_name(requestdata):
    if dict(requestdata).get('location'):
        coordinates = json.loads(dict(requestdata)['location'][0])['coordinates']
        lon = str(coordinates[0])
        lat = str(coordinates[1])
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
        geocoded = requests.get(url)
        return geocoded.json().get('display_name', 'unknown address')
    return 'unknown address'
    