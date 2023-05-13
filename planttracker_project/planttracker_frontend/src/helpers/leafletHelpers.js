
//overwrite leaflet.css, too high z-indices



export function leafletLowZIndex() {
  let newZIndices = {
    '.leaflet-pane' : 4,
    '.leaflet-tile-pane': 2,
    '.leaflet-overlay-pane': 4,
    '.leaflet-shadow-pane': 5,
    '.leaflet-marker-pane':  6,
    // '.leaflet-marker-icon': 6,
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
