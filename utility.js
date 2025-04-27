
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

window.readData = readData;

document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
});