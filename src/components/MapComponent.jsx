import { Circle, MapContainer, ImageOverlay, Marker } from "react-leaflet";
import L from 'leaflet';
import { useState } from "react";
import treasureCoffers from '../data/poi/treasure-coffers.json';

const mapParameters = {
  "bounds": {
      "min": {
        "lat": -1,
        "lon": 1
      },
      "max": {
        "lat": -42,
        "lon": 42
      }
    },
    "center": {
      "lat": -21,
      "lon": 21
    },
    "zoom": {
      "default": 4.5,
      "min": 3,
      "max": 8,
      "delta": 0.5,
      "snap": 0.5,
      "scrollPx": 200
    }
}

// // Hack to support leaflet, see https://github.com/PaulLeCam/react-leaflet/issues/255
// /* eslint-disable no-underscore-dangle, global-require, comma-dangle */
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

const getIconPath = (iconName) => {
    return `${process.env.PUBLIC_URL}/assets/maps/poi-markers/${iconName}`
};

const MapComponent = () => {

    const initialVisited = {};
    treasureCoffers.treasureCoffers.waymarks.forEach( (waymark) => {
        initialVisited[waymark['@id']] = 0;
    });

    const totalChests = treasureCoffers.treasureCoffers.waymarks.length

    const [visited, setVisited] = useState(initialVisited);


    const toggleVisted = (e) => {
        const coffer_id = e.target.options.id;
        const newVisited = visited;
        newVisited[coffer_id] = (visited[coffer_id] + 1) % 3;
        setVisited({...newVisited});
    }

    const calculateChests = () => {
        return Object.values(visited).reduce((sum, value) => sum + (value > 0), 0);
    }

    const defaultIcon = treasureCoffers.treasureCoffers.markerIcon;
    const markers = [];

    markers.push(...treasureCoffers.treasureCoffers.waymarks.map( (waymark) => (
            <Marker
                key={waymark['@id']}
                id={waymark['@id']}
                value={visited[waymark['@id']]}
                position={[waymark.position.y, waymark.position.x]}
                eventHandlers={{
                    click: toggleVisted
                }}
                icon={
                L.icon({
                iconUrl: `${waymark.iconOverride ? getIconPath(waymark.iconOverride) : getIconPath(defaultIcon)}`,
                iconSize: [32, 32],
                tooltipAnchor: [4, 0],
                })}
            >
                {
                    visited[waymark['@id']] == 1 && (<Circle
                    center={[waymark.position.y, waymark.position.x]}
                    value={visited[waymark['@id']]}
                    pathOptions={{
                        color: '#80f127',
                        fillColor: '#80f127',
                        fillOpacity: 0.5,
                        dashArray: '4, 4'}}
                    radius={0.6}
                    />)
                }

                {
                    visited[waymark['@id']] == 2 && (<Circle
                    center={[waymark.position.y, waymark.position.x]}
                    value={visited[waymark['@id']]}
                    pathOptions={{
                        color: '#dc3c19',
                        fillColor: '#dc3c19',
                        fillOpacity: 0.5,
                        dashArray: '4, 4'}}
                    radius={0.6}
                    />)
                }
            </Marker>
        )
    ));


  return (
    <div>
        <div class="sidebar">
            <p>Total Chests: {totalChests}</p>
            <p>Visited Chests: {calculateChests()}</p>
            <p>Remaining Chests: {totalChests - calculateChests()} </p>
        </div>
        <div class="map">
            <MapContainer 
                        crs={L.CRS.Simple}
                        center={[mapParameters.center.lat, mapParameters.center.lon]}
                        zoom={mapParameters.zoom.default}
                        minZoom={mapParameters.zoom.min}
                        maxZoom={mapParameters.zoom.max}
                        zoomDelta={mapParameters.zoom.delta}
                        zoomSnap={mapParameters.zoom.snap}
                        wheelPxPerZoomLevel={mapParameters.zoom.scrollPx}
                        doubleClickZoom={false}
                    >
                        <ImageOverlay
                        url={`${process.env.PUBLIC_URL}/assets/maps/backgrounds/southhorn.jpg`} 
                        noWrap
                        bounds={
                        [
                            [mapParameters.bounds.min.lat,
                            mapParameters.bounds.min.lon,
                            ], [
                            mapParameters.bounds.max.lat,
                            mapParameters.bounds.max.lon,
                            ],
                        ]
                        }/>
                        {markers}
            </MapContainer>
        </div>
    </div>
  )
}

export default MapComponent;