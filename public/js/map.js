window.onload = () => {
  console.log('script has loaded')
};


// Map creation and initialization for the map page
function initMap(poopData, mapTilerApiKey) {
  // Center on Brooklyn, NY
  const brooklynCoords = [40.6782, -73.9442];
  
  // Set MapTiler API key
  maptilersdk.config.apiKey = mapTilerApiKey;
  
  // Create map centered on Brooklyn
  const map = L.map('map').setView(brooklynCoords, 13);
  
  // Add MapTiler layer with custom toner-v2 style
  L.maptilerLayer({
    style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${mapTilerApiKey}`
  }).addTo(map);
  
  // Custom poop icon
  const poopIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4481/4481132.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  // Add markers for each poop location
  if (poopData && poopData.length > 0) {
    poopData.forEach(point => {
      L.marker([point.lat, point.lng], { icon: poopIcon })
        .addTo(map)
        .bindPopup(point.note);
    });
  }
  
  return map;
}

// Map for location selection on the submit page
function initSelectionMap(mapTilerApiKey) {
  // Center on Brooklyn, NY
  const brooklynCoords = [40.6782, -73.9442];
  
  // Set MapTiler API key
  maptilersdk.config.apiKey = mapTilerApiKey;
  
  // Create map centered on Brooklyn
  const map = L.map('selection-map').setView(brooklynCoords, 13);
  
  // Add MapTiler layer with custom toner-v2 style
  L.maptilerLayer({
    style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${mapTilerApiKey}`
  }).addTo(map);
  
  // Create a marker that will be movable
  let marker = null;
  
  // Function to update the hidden form fields with the marker position
  function updateLocationFields(latlng) {
    document.getElementById('lat').value = latlng.lat;
    document.getElementById('lng').value = latlng.lng;
  }
  
  // Function to handle map clicks
  function onMapClick(e) {
    // If a marker already exists, remove it
    if (marker) {
      map.removeLayer(marker);
    }
    
    // Create a new marker at the clicked location
    marker = L.marker(e.latlng).addTo(map);
    
    // Update the form fields
    updateLocationFields(e.latlng);
  }
  
  // Add click event handler to the map
  map.on('click', onMapClick);
  
  // Add geolocation button
  const geolocateBtn = document.getElementById('geolocate');
  if (geolocateBtn) {
    geolocateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Center map on user's location
          map.setView([latlng.lat, latlng.lng], 16);
          
          // Place marker
          if (marker) {
            map.removeLayer(marker);
          }
          
          marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
          
          // Update form fields
          updateLocationFields(latlng);
        }, function(error) {
          alert('Error getting your location: ' + error.message);
        });
      } else {
        alert('Geolocation is not supported by your browser');
      }
    });
  }
  
  return map;
} 