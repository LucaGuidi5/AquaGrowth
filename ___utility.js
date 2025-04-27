// Non usato - Utilizza leaflet per la mappa

let map;
let marker;
let dotNetHelperRef;

export function initializeMap(dotNetHelper) {
    dotNetHelperRef = dotNetHelper;
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0], { draggable: true }).addTo(map);

    marker.on('dragend', function (event) {
        const latlng = event.target.getLatLng();
        dotNetHelperRef.invokeMethodAsync('UpdateCoordinates', latlng.lat, latlng.lng);
        updateUI(latlng.lat, latlng.lng)
    });

    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        dotNetHelperRef.invokeMethodAsync('UpdateCoordinates', e.latlng.lat, e.latlng.lng);
        updateUI(e.latlng.lat, e.latlng.lng)
    });
}

export function geocodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const latitude = parseFloat(data[0].lat);
                const longitude = parseFloat(data[0].lon);

                updateUI(latitude, longitude)

            } else {
                alert('Località non trovata. Inserire manualmente le coordinate.');
            }
        })
        .catch(error => {
            console.error('Errore nel geocoding:', error);
            alert('Si è verificato un errore nel geocoding. Riprova o inserisci le coordinate manualmente.');
        });
}
function updateUI(latitude, longitude) {

    dotNetHelperRef.invokeMethodAsync('UpdateCoordinates', latitude, longitude);
    geocodeFromCoord(latitude, longitude);
}

export function geocodeFromCoord(latitude, longitude) {
    updateMap(latitude, longitude);
    getElevation(latitude, longitude);
    reverseGeocode(latitude, longitude);
}
export function updateMap(lat, lng) {
    if (map && marker) {
        map.setView([lat, lng], 10);
        marker.setLatLng([lat, lng]);
    }
}

export function getElevation(latitude, longitude) {
    const elevationUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
    fetch(elevationUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.results && data.results.length > 0) {
                const elevation = data.results[0].elevation;
                dotNetHelperRef.invokeMethodAsync('UpdateElevation', elevation);
            } else {
                console.warn('Quota non trovata per la località.');
            }
        })
        .catch(error => {
            console.error('Errore nel recupero della quota:', error);
        });
}

export function reverseGeocode(latitude, longitude) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                dotNetHelperRef.invokeMethodAsync('UpdateLocalita', data.display_name);
            } else {
                console.warn('Località non trovata per le coordinate.');
            }
        })
        .catch(error => {
            console.error('Errore nel geocoding inverso:', error);
        });
}

export function disposeMap() {
    if (map) {
        map.remove(); // Rimuove la mappa dal DOM e pulisce tutto
        map = null;
        marker = null;
    }
}

export async function downloadFileFromStream(fileName, contentStreamReference) {
    const arrayBuffer = await contentStreamReference.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = fileName ?? "";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(url);
}

export function downloadReport(fileName, base64Data) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export function showModal(id) {
    var modal = new bootstrap.Modal(document.getElementById(id));
    modal.show();
}

export function hideModal(id) {
    var modal = bootstrap.Modal.getInstance(document.getElementById(id));
    if (modal) {
        modal.hide();
    }
}
export function submitFormJS(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.requestSubmit(); // simula il click sul submit
    } else {
        console.warn("Form non trovata con ID:", formId);
    }
}

export function scrollToElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
