window.onload = () => {
  console.log('script has loaded');
  
  // Navigation highlighting code
  const currentPath = window.location.pathname;
  
  // Select all nav links
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Loop through each link
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // If the link path matches the current path (or both are home)
    if (linkPath === currentPath || (linkPath === '/' && currentPath === '/')) {
      // Add the active class
      link.classList.add('nav-link-active');
    }
  });
};

// MapTiler API key hardcoded directly in the JS file
const MAPTILER_API_KEY = 'SDAH1HS7z8VGHOhYwhFv';

// Map creation and initialization for the map page
function initMap(poopData) {
  // Center on Brooklyn, NY
  const brooklynCoords = [40.6782, -73.9442];
  
  // Set MapTiler API key
  maptilersdk.config.apiKey = MAPTILER_API_KEY;
  
  // Create map centered on Brooklyn
  const map = L.map('map').setView(brooklynCoords, 13);
  
  L.maptilerLayer({
    style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`
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
function initSelectionMap() {
  // Center on Brooklyn, NY
  const brooklynCoords = [40.6782, -73.9442];
  
  // Set MapTiler API key
  maptilersdk.config.apiKey = MAPTILER_API_KEY;
  
  // Create map centered on Brooklyn
  const map = L.map('selection-map').setView(brooklynCoords, 13);
  
  // Add MapTiler layer with custom toner-v2 style
  L.maptilerLayer({
    style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`
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