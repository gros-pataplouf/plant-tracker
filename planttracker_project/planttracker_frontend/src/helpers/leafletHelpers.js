import L from 'leaflet';
import plant1 from '../assets/icons/plant1.svg';
import plant2 from '../assets/icons/plant2.svg'
import plant3 from '../assets/icons/plant3.svg'


const customIcon1 = new L.Icon({
  iconUrl: plant1,
  iconRetinaUrl: plant1,
  popupAnchor:  [-0, -0],
  iconSize: [32,45],
});

const customIcon2 = new L.Icon({
  iconUrl: plant2,
  iconRetinaUrl: plant2,
  popupAnchor:  [-0, -0],
  iconSize: [32,45],
     
});

const customIcon3 = new L.Icon({
  iconUrl: plant3,
  iconRetinaUrl: plant3,
  popupAnchor:  [-0, -0],
  iconSize: [32,45],
     
});

export const plantsAndMarkers = {
    1: customIcon1,
    2: customIcon2,
    3: customIcon3
  }

export const plantsAndSymbols = {
    1: plant1,
    2: plant2,
    3: plant3
}


//overwrite leaflet.css, too high z-indices



export function leafletLowZIndex() {
  let newZIndices = {
    '.leaflet-pane' : 4,
    '.leaflet-tile-pane': 2,
    '.leaflet-overlay-pane': 4,
    '.leaflet-shadow-pane': 5,
    '.leaflet-marker-pane':  8,
    '.leaflet-tooltip-pane': 6,
    '.leaflet-popup-pane': 7,
    '.leaflet-map-pane': 1,
    '.leaflet-map-pane svg': 2,
    '.leaflet-control': 8,
    '.leaflet-bottom': 9, 
    '.leaflet-top': 9
    }

  for (let selector in newZIndices) {
    let mapElements = document.querySelectorAll(selector);
    mapElements.forEach(elt => {
      elt.setAttribute('style', `z-index: ${newZIndices[selector]}`)
    })
  }
}
