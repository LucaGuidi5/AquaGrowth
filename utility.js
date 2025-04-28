
let map;

function readData(){
    const mioSpan = document.getElementById('xxx');
    fetch('test.json')
  .then(response => response.json())
  .then(data => {
    mioSpan.innerText = data.pippo
  });
}

function initializeMap(){
  // Inizializza la mappa specificando l'ID dell'elemento HTML che la conterrà
    // Assicurati che l'elemento con id 'mapid' esista nel DOM prima di inizializzare la mappa
    var mapElement = document.getElementById('mapid');
    if (mapElement) {
        map = L.map('mapid').setView([45.4408, 12.3155], 10); // Coordinate di Rimini, Italia; Zoom 13

        // Aggiungi un layer di tile (immagini della mappa) da OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            // L'attributo 'attribution' è importante per rispettare i termini di utilizzo di OpenStreetMap
        }).addTo(map); // Aggiungi il layer alla mappa

        // Aggiungi un marker (opzionale)
        var marker = L.marker([45.4408, 12.3155]).addTo(map);
        marker.bindPopup("<b>Benvenuto a Venezia!</b>").openPopup(); // Aggiungi un popup al marker
    } else {
        console.error('Element with id "mapid" not found.  Map cannot be initialized.');
    }
}

function metersToPixels(meters, lat, zoom) {
  const earthCircumference = 40075017; // in metri
  const latitudeRadians = lat * (Math.PI / 180);
  const metersPerPixel = earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoom + 8);
  return meters / metersPerPixel;
}


function addLayer(){
 
  var heatData = [
    [45.4408, 12.3155, 0.01], // Venezia centro
    [45.4378, 12.3150, 0.4],
    [45.4418, 12.3185, 0.7],
    [45.4438, 12.3205, 1],
    // Puoi aggiungere quanti punti vuoi
  ];

  var currentZoom = map.getZoom();
  var centerLat = 45.4408; // puoi anche calcolare la media dei tuoi punti
  var radiusInPixels = metersToPixels(5000, centerLat, currentZoom);

  var heat = L.heatLayer(heatData, {
    radius: radiusInPixels,
    blur: -15,
    maxZoom: 0,
    gradient: {
        //0.0: 'red',    // intensità 0 -> rosso
        //0.5: 'yellow', // intensità 0.5 -> giallo
        1.0: 'green'   // intensità 1 -> verde
    }
  }).addTo(map);
}

window.readData = readData;

document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  addLayer();
});