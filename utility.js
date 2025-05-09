
let map;
let dati;
//let data2visualize;
//let layerFigure;
let layerAreeIdonee;
let controlLayers;
const overlayLayers = {};
//let chiaviPredizioni;

const metriQuadrato = 1000;

let comboBoxControl = L.Control.extend({
  options: {
    position: 'topright' // puoi scegliere: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },

  onAdd: function (map) {
    // Creo il contenitore
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    // Creo la select
    var select = L.DomUtil.create('select', '', container);
    select.style.padding = "5px";

    // Aggiungo le opzioni
    select.innerHTML = `
      <option value="1sett">1 settimana</option>
      <option value="1mese">1 mese</option>
    `;

    // Gestisco l'evento change
    select.addEventListener('change', function(e) {
      const value = e.target.value;
      
      if (value === "1sett"){
        updateLayer(dati.sett1);
      }
      else if ( value === "1mese"){
        updateLayer(dati.mese1);
      }
    });

    // Evito che cliccare sulla select muova la mappa
    L.DomEvent.disableClickPropagation(container);

    return container;
  }
});

/*
async function readData() {
  try {
      const response = await fetch('test.json');
      if (!response.ok) {
          throw new Error('Errore nel caricamento del file: ' + response.status);
      }
      const data = await response.json();
      dati = data;
      chiaviPredizioni = Object.keys(dati)
  } catch (error) {
      console.error('Errore durante il caricamento dei dati:', error);
  }
}
*/
async function readDataAreeIdonee() {
  try {

    fetch('aree_idonee_venericoltura.geojson') 
        .then(response => response.json())
        .then(geojsonData => {
            let geojsonLayer = L.geoJSON(geojsonData, {
              style: function (feature) {
                return {
                  color: "blue",         // colore del bordo
                  weight: 2,             // spessore linea
                  fillColor: "lightblue",// colore interno (per poligoni)
                  fillOpacity: 0.5       // opacità riempimento
                };
              }
            });

            overlayLayers["Aree idonee alla venericoltura"] = geojsonLayer;
            geojsonLayer.addTo(map);

            updateLayerControl();
        });
    
        
  } catch (error) {
      console.error('Errore durante il caricamento dei dati rellativi alle aree idonee:', error);
  }
}

async function readDataPredizioni() {
  try {

    fetch('voronoi_clipped.geojson') 
        .then(response => response.json())
        .then(geojsonData => {

            let geojsonLayer = L.geoJSON(geojsonData, {
              style: feature => ({
                color: feature.properties.color,   // bordo
                fillColor: feature.properties.color, // riempimento
                weight: 1,
                fillOpacity: 0.5
              }),
              onEachFeature: (feature, layer) => {
                const pom = feature.properties["POM (mg/l)"];
                layer.on('click', () => {
                  layer.bindPopup(`POM: ${pom} mg/l`).openPopup();
                });
              }
            });

            geojsonLayer.addTo(map);

            overlayLayers["Indice di crescita delle ostriche"] = geojsonLayer;
            geojsonLayer.addTo(map); 
            updateLayerControl();    
            
        });
        
  } catch (error) {
      console.error('Errore durante il caricamento dei dati rellativi alle aree idonee:', error);
  }
}

function initializeMap(){
  // Inizializza la mappa specificando l'ID dell'elemento HTML che la conterrà
    // Assicurati che l'elemento con id 'mapid' esista nel DOM prima di inizializzare la mappa
    var mapElement = document.getElementById('mapid');
    if (mapElement) {
        map = L.map('mapid').setView([45.4408, 12.3155], 10); 

        // Aggiungi un layer di tile (immagini della mappa) da OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            // L'attributo 'attribution' è importante per rispettare i termini di utilizzo di OpenStreetMap
        }).addTo(map); // Aggiungi il layer alla mappa

        // Aggiungi un marker (opzionale)
        //var marker = L.marker([45.4408, 12.3155]).addTo(map);
        //marker.bindPopup("<b>Benvenuto a Venezia!</b>").openPopup(); // Aggiungi un popup al marker
    } else {
        console.error('Element with id "mapid" not found.  Map cannot be initialized.');
    }
}

function updateLayerControl() {
  if (controlLayers) {
    controlLayers.remove();
  }
  controlLayers = L.control.layers(null, overlayLayers).addTo(map);
}

/*
function createSquare(lat, lon, sideLengthMeters, color) {
  const deltaLat = (sideLengthMeters / 2) / 111320; // 1° latitudine ≈ 111.32 km
  const deltaLon = (sideLengthMeters / 2) / (40075000 * Math.cos(lat * Math.PI / 180) / 360);

  const bounds = [
    [lat - deltaLat, lon - deltaLon], // angolo sud-ovest
    [lat + deltaLat, lon + deltaLon]  // angolo nord-est
  ];

  L.rectangle(bounds, {
    color: color,
    fillColor: color,
    fillOpacity: 0.5,
    weight: 1
  }).addTo(layerFigure);
}



function updateLayer(punti){

  if (layerFigure) {
    layerFigure.clearLayers();
  }

  let greenPoints = [];
  let yellowPoints = [];
  let redPoints = [];

  punti.forEach(punto => {
    if (punto[2] > 0.7){
      greenPoints.push(punto);
    }
    else if(punto[2] > 0.35){
      yellowPoints.push(punto);
    }
    else{
      redPoints.push(punto);
    }
  });

  greenPoints.forEach(punto =>{
    createSquare(punto[0], punto[1], metriQuadrato, "green");
  });

  yellowPoints.forEach(punto =>{
    createSquare(punto[0], punto[1], metriQuadrato, "yellow");
  });

  redPoints.forEach(punto =>{
    createSquare(punto[0], punto[1], metriQuadrato, "red");
  });
}
   */
/*
map.on('zoomend', () => {
  createHeatLayer(data);
});
*/
//window.readData = readData;

document.addEventListener('DOMContentLoaded', async () => {
  initializeMap();
  //await readData();
  await readDataAreeIdonee();
  await readDataPredizioni();
  //layerFigure = L.layerGroup().addTo(map);
  //map.addControl(new comboBoxControl());
  //updateLayer(dati.sett1);
});