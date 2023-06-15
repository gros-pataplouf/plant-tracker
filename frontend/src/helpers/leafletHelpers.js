// convert an array of coordinates to userfriendly degrees, minutes, seconds.
// return statement: prefix with N (positive) or S (negative) for latitude, W (negative) or E (positive) for longitude

export function convertGPS(coords) {
  return coords.map((_) => {
    const degrees = Math.floor(_);
    const minutes = Math.floor((_ - degrees) * 60);
    const seconds = Math.floor((_ - degrees - minutes / 60) * 3600);
    return `
    ${
      coords.indexOf(_) === 0
        ? degrees > 0
          ? "N"
          : "S"
        : degrees > 0
        ? "E"
        : "W"
    } 
    ${Math.abs(degrees)}°${minutes}'${seconds}'' `;
  });
}

//overwrite leaflet.css, too high z-indices

export function leafletLowZIndex() {
  let newZIndices = {
    ".leaflet-pane": 4,
    ".leaflet-tile-pane": 2,
    ".leaflet-overlay-pane": 4,
    ".leaflet-shadow-pane": 5,
    ".leaflet-marker-pane": 6,
    // '.leaflet-marker-icon': 6,
    ".leaflet-tooltip-pane": 6,
    ".leaflet-popup-pane": 7,
    ".leaflet-map-pane": 1,
    ".leaflet-map-pane svg": 2,
    ".leaflet-control": 8,
    ".leaflet-bottom": 9,
    ".leaflet-top": 9,
  };

  for (let selector in newZIndices) {
    let mapElements = document.querySelectorAll(selector);
    mapElements.forEach((elt) => {
      elt.setAttribute("style", `z-index: ${newZIndices[selector]}`);
    });
  }
}
