// Variabel untuk peta dan marker
let map = null;
let marker = null;
let selectedLat = null;
let selectedLon = null;

// Initialize map for story list
export function initStoryListMap(containerId, stories) {
  const map = L.map(containerId).setView([-6.2088, 106.8456], 13);
  
  // Base layers
    const baseMaps = {
    "Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    }),
    "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    })
  };

  // Add default layer
  baseMaps["Default"].addTo(map);

  // Add layer control
    L.control.layers(baseMaps).addTo(map);

  // Add markers for each story
  stories.forEach(story => {
      if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(`
        <div class="popup-content">
          <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;" loading="lazy">
          <h3>${story.name}</h3>
          <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
          <a href="#/story/${story.id}" class="btn-detail">Lihat Detail</a>
        </div>
      `);
    }
  });
    
    return map;
}

// Initialize map for story detail
export function initStoryDetailMap(containerId, story) {
  const map = L.map(containerId).setView([story.lat, story.lon], 13);
  
  // Base layers
  const baseMaps = {
    "Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    }),
    "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    })
  };

  // Add default layer
  baseMaps["Default"].addTo(map);

  // Add layer control
  L.control.layers(baseMaps).addTo(map);

  // Add marker for story location
  const marker = L.marker([story.lat, story.lon]).addTo(map);
  marker.bindPopup(`
    <div class="popup-content">
      <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;" loading="lazy">
      <h3>${story.name}</h3>
      <p>${story.description}</p>
    </div>
  `);
    
    return map;
}

// Initialize map for adding new story
export function initAddStoryMap(containerId, locationDisplayId) {
  const map = L.map(containerId).setView([-6.2088, 106.8456], 13);
  
  // Base layers with more options
  const baseMaps = {
    "Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    }),
    "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    }),
    "Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    })
  };

  // Add default layer
  baseMaps["Default"].addTo(map);

  // Add layer control with custom styling
  const layerControl = L.control.layers(baseMaps, null, {
    position: 'topright',
    collapsed: false
  }).addTo(map);

  // Customize layer control appearance
  const layerControlContainer = document.querySelector('.leaflet-control-layers');
  if (layerControlContainer) {
    layerControlContainer.style.padding = '10px';
    layerControlContainer.style.background = 'white';
    layerControlContainer.style.borderRadius = '8px';
    layerControlContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  let marker = null;
  const locationDisplay = document.getElementById(locationDisplayId);

  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    
    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup('Lokasi cerita Anda').openPopup();
    
    if (locationDisplay) {
      locationDisplay.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  });

  // Add getSelectedLocation method
  map.getSelectedLocation = () => {
    if (marker) {
      const latlng = marker.getLatLng();
      return {
        lat: latlng.lat,
        lon: latlng.lng
      };
    }
    return null;
  };

  return map;
}