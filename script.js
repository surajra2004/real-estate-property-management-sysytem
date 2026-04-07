// Clean JS for home/properties - ENHANCED with advanced location features + booking
// Multi-page compatible

// Global property data with more locations
const allProperties = [
  // US
  {"id":1,"title":"Modern Beachfront Villa","location":"Miami, FL","price":1250000,"beds":4,"baths":3,"sqft":2800,"type":"House","image":"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop", "country": "US"},
  {"id":2,"title":"Luxury Downtown Condo","location":"New York, NY","price":850000,"beds":2,"baths":2,"sqft":1200,"type":"Condo","image":"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop", "country": "US"},
  // India (expanded)
  {"id":9,"title":"Mumbai Seaface Penthouse","location":"Mumbai, MH","price":75000000,"beds":4,"baths":5,"sqft":4000,"type":"Penthouse","image":"https://images.unsplash.com/photo-1558618047-3c8c76dd9b0e?w=400&h=300&fit=crop", "country": "India"},
  {"id":10,"title":"Bangalore Silicon Villa","location":"Bangalore, KA","price":25000000,"beds":5,"baths":4,"sqft":4500,"type":"House","image":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", "country": "India"},
  {"id":11,"title":"Goa Beach Resort","location":"Goa, GA","price":18000000,"beds":3,"baths":3,"sqft":2500,"type":"Condo","image":"https://images.unsplash.com/photo-1571896349840-0d6f5f47c873?w=400&h=300&fit=crop", "country": "India"},
  {"id":12,"title":"Gurgaon Corporate Loft","location":"Gurgaon, HR","price":45000000,"beds":3,"baths":3.5,"sqft":3000,"type":"Loft","image":"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop", "country": "India"},
  // More...
  {"id":17,"title":"Kolkata Heritage House","location":"Kolkata, WB","price":12000000,"beds":4,"baths":3,"sqft":3200,"type":"House","image":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop", "country": "India"},
  {"id":18,"title":"Jaipur Palace Apartment","location":"Jaipur, RJ","price":22000000,"beds":3,"baths":3,"sqft":2800,"type":"Apartment","image":"https://images.unsplash.com/photo-1571889260059-6ee8d099e5f7?w=400&h=300&fit=crop", "country": "India"}
];

// Enhanced location flags
function getLocationWithFlag(location) {
  const locLower = location.toLowerCase();
  if (locLower.includes('mumbai')) return {className: 'flag-mh', icon: '🗼 Mumbai'};
  if (locLower.includes('bangalore')) return {className: 'flag-ka', icon: '🌴 Bangalore'};
  if (locLower.includes('goa')) return {className: 'flag-ga', icon: '🏖️ Goa'};
  if (locLower.includes('gurgaon') || locLower.includes('hr')) return {className: 'flag-hr', icon: '🏢 Gurgaon'};
  return {className: '', icon: '📍 ' + location};
}

// Format price
function formatPrice(price) {
  return '₹' + (price / 100000).toLocaleString('en-IN') + ' Lakh';
}

// Booking enhancement
function openBookingModal(id) {
  const prop = allProperties.find(p => p.id === id);
  if (prop) {
    localStorage.setItem('selectedProperty', JSON.stringify(prop));
    window.location.href = 'contact.html';
  }
}

// Render with enhancements
function renderProperties(filtered = allProperties) {
  const grid = document.getElementById('property-grid');
  if (grid) {
    grid.innerHTML = filtered.map(prop => {
      const flag = getLocationWithFlag(prop.location);
      return `
        <div class="property-card enhanced-card" onclick="openModal(${prop.id})">
          <div class="property-badge ${prop.country.toLowerCase()}">${prop.country}</div>
          <img src="${prop.image}" alt="${prop.title}" loading="lazy">
          <div class="property-info">
            <h3>${prop.title}</h3>
            <p class="property-location-flag ${flag.className}">
              ${flag.icon}
            </p>
            <div class="property-stats">
              <span>🛏️ ${prop.beds} Bd</span>
              <span>🚿 ${prop.baths} Ba</span>
              <span>📏 ${prop.sqft} sqft</span>
            </div>
            <div class="price">${formatPrice(prop.price)}</div>
            <button class="book-btn" onclick="openBookingModal(${prop.id}); event.stopPropagation();">📩 Book Now</button>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Modal with enhanced map
function openModal(id) {
  const prop = allProperties.find(p => p.id === id);
  if (prop) {
    document.getElementById('modal-title').textContent = prop.title;
    document.getElementById('modal-image').src = prop.image;
    document.getElementById('modal-location').innerHTML = getLocationWithFlag(prop.location).icon;
    document.getElementById('modal-price').textContent = formatPrice(prop.price);
    document.getElementById('modal-beds').textContent = prop.beds;
    document.getElementById('modal-baths').textContent = prop.baths;
    document.getElementById('modal-sqft').textContent = prop.sqft + ' sqft';
    document.getElementById('modal-description').innerHTML = `<p>Premium ${prop.type} in ${prop.location}. ${prop.country} 🇺🇸🇮🇳</p><p>Virtual tour available! ✨</p>`;
    
    const mapDiv = document.getElementById('modal-map');
    if (mapDiv) {
      mapDiv.innerHTML = `<iframe src="https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(prop.location)}&key=&zoom=15&maptype=satellite" style="border:0; width:100%; height:250px; border-radius:12px;" allowfullscreen loading="lazy"></iframe>`;
    }
    
    document.getElementById('property-modal').style.display = 'flex';
  }
}

// Advanced filter
function filterProperties() {
  const locationQuery = document.getElementById('location-filter')?.value.toLowerCase() || '';
  const typeFilter = document.getElementById('type-filter')?.value || '';
  const countryFilter = document.getElementById('country-filter')?.value || '';
  const minPrice = parseInt(document.getElementById('min-price')?.value) || 0;
  const maxPrice = parseInt(document.getElementById('max-price')?.value) || Infinity;
  
  const filtered = allProperties.filter(prop => 
    prop.location.toLowerCase().includes(locationQuery) &&
    (!typeFilter || prop.type === typeFilter) &&
    (!countryFilter || prop.country === countryFilter) &&
    prop.price >= minPrice && prop.price <= maxPrice
  );
  
  renderProperties(filtered);
  populateSuggestions();
}

// Autocomplete suggestions
function populateSuggestions() {
  const locations = [...new Set(allProperties.map(p => p.location))];
  const datalist = document.getElementById('location-suggestions');
  if (datalist) datalist.innerHTML = locations.map(loc => `<option value="${loc}">`).join('');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  populateSuggestions();
  filterProperties();
  
  // Event listeners
  ['location-filter', 'type-filter', 'country-filter', 'min-price', 'max-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', filterProperties);
  });
  
  document.getElementById('search-btn')?.addEventListener('click', filterProperties);
  document.getElementById('modal-overlay')?.addEventListener('click', closeModal);
});

