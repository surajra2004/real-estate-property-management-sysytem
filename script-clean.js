// Enhanced clean script - mirrored location features from enhanced.js
// Added flags, Indian properties, autocomplete support, map preview

// Location flag mapping (same as enhanced)
function getLocationWithFlag(location) {
  const locLower = location.toLowerCase();
  const flags = {
    'mumbai, mh': { class: 'flag-mh', icon: '🗼' },
    'bangalore, ka': { class: 'flag-ka', icon: '🌴' },
    'goa, ga': { class: 'flag-ga', icon: '🏖️' },
    'gurgaon, hr': { class: 'flag-hr', icon: '🏭' },
    'delhi, dl': { class: 'flag-in', icon: '🇮🇳' },
    'pune, mh': { class: 'flag-mh', icon: '⛰️' },
    'hyderabad, ts': { class: 'flag-in', icon: '🏰' },
    'chennai, tn': { class: 'flag-in', icon: '🌊' },
    default: { class: '', icon: '📍' }
  };
  for (let key in flags) {
    if (locLower.includes(key)) return flags[key];
  }
  return flags.default;
}

// Load properties - updated with Indian + numeric prices for INR
async function loadProperties() {
  try {
    const response = await fetch('properties.json');
    return await response.json();
  } catch (e) {
    return [
      // Updated US with numeric prices for consistency
      {"id":1,"title":"Modern Beachfront Villa","location":"Miami, FL","price":1250000,"beds":4,"baths":3,"sqft":2800,"type":"House","image":"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"},
      {"id":2,"title":"Luxury Downtown Condo","location":"New York, NY","price":850000,"beds":2,"baths":2,"sqft":1200,"type":"Condo","image":"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"},
      {"id":3,"title":"Spacious Family Home","location":"Los Angeles, CA","price":2100000,"beds":5,"baths":4,"sqft":3800,"type":"House","image":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"},
      {"id":4,"title":"Cozy Suburban Apartment","location":"Chicago, IL","price":420000,"beds":3,"baths":2,"sqft":1500,"type":"Apartment","image":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"},
      // Indian NEW
      {"id":9,"title":"Seaface Luxury Apartment","location":"Mumbai, MH","price":25000000,"beds":3,"baths":3,"sqft":2000,"type":"Apartment","image":"https://images.unsplash.com/photo-1558618047-3c8c76dd9b0e?w=400&h=300&fit=crop"},
      {"id":10,"title":"Silicon Valley Villa","location":"Bangalore, KA","price":18000000,"beds":4,"baths":4,"sqft":3500,"type":"House","image":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"},
      {"id":11,"title":"Beach Resort Condo","location":"Goa, GA","price":12000000,"beds":2,"baths":2,"sqft":1500,"type":"Condo","image":"https://images.unsplash.com/photo-1571896349840-0d6f5f47c873?w=400&h=300&fit=crop"},
      {"id":12,"title":"Corporate Tower Loft","location":"Gurgaon, HR","price":35000000,"beds":3,"baths":3.5,"sqft":2500,"type":"Loft","image":"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"}
    ];
  }
}

// Price formatter
function formatPrice(price) {
  return '₹' + new Intl.NumberFormat('en-IN').format(price);
}

// Render with flags
function renderProperties(properties) {
  const grid = document.getElementById('property-grid');
  grid.innerHTML = properties.map(prop => {
    const flagInfo = getLocationWithFlag(prop.location);
    return `
      <div class="property-card" onclick="openModal(${prop.id})">
        <img src="${prop.image}" alt="${prop.title}" loading="lazy">
        <div class="property-info">
          <h3>${prop.title}</h3>
          <p class="property-location-flag ${flagInfo.class}">
            <span class="location-icon">${flagInfo.icon}</span>
            ${prop.location}
          </p>
          <div class="property-stats">
            <span>${prop.beds} beds</span>
            <span>${prop.baths} baths</span>
            <span>${prop.sqft} sqft</span>
          </div>
          <div class="price">${formatPrice(prop.price)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Filter (price now numeric)
function filterProperties() {
  const location = document.getElementById('location-filter').value.toLowerCase();
  const type = document.getElementById('type-filter').value;
  const minPrice = parseInt(document.getElementById('min-price').value) || 0;
  const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;

  loadProperties().then(properties => {
    const filtered = properties.filter(prop => 
      prop.location.toLowerCase().includes(location) &&
      (!type || prop.type === type) &&
      prop.price >= minPrice &&
      prop.price <= maxPrice
    );
    renderProperties(filtered);
    // Autocomplete
    const allLocs = [...new Set(properties.map(p => p.location))];
    const datalist = document.getElementById('location-suggestions');
    if (datalist) datalist.innerHTML = allLocs.map(loc => `<option value="${loc}">`).join('');
  });
}

// Open modal with flag and map
function openModal(id) {
  loadProperties().then(properties => {
    const prop = properties.find(p => p.id === id);
    if (prop) {
      const flagInfo = getLocationWithFlag(prop.location);
      document.getElementById('modal-title').textContent = prop.title;
      document.getElementById('modal-image').src = prop.image;
      document.getElementById('modal-location').innerHTML = `<span class="property-location-flag ${flagInfo.class}"><span class="location-icon">${flagInfo.icon}</span> ${prop.location}</span>`;
      document.getElementById('modal-price').textContent = formatPrice(prop.price);
      document.getElementById('modal-beds').textContent = prop.beds;
      document.getElementById('modal-baths').textContent = prop.baths;
      document.getElementById('modal-sqft').textContent = prop.sqft + ' sqft';
      document.getElementById('modal-description').innerHTML = '<p>Luxury ' + prop.type + ' in ' + prop.location + '. Contact for viewing!</p>';
      
      const modalMap = document.getElementById('modal-map');
      if (modalMap) {
        modalMap.innerHTML = `<iframe src="https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(prop.location)}&key=&zoom=14" style="border:0; width:100%; height:200px;" allowfullscreen loading="lazy"></iframe>`;
      }
      
      document.getElementById('property-modal').style.display = 'flex';
    }
  });
}

function closeModal() {
  document.getElementById('property-modal').style.display = 'none';
}

function submitContact() {
  const name = document.getElementById('contact-name')?.value;
  const email = document.getElementById('contact-email')?.value;
  const message = document.getElementById('contact-message')?.value;
  if (name && email && message) {
    alert('Thank you! Your inquiry has been sent.');
  } else {
    alert('Please fill all fields.');
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  filterProperties();
  
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) searchBtn.onclick = filterProperties;
  
  ['location-filter', 'type-filter', 'min-price', 'max-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.oninput = filterProperties;
  });
  
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) modalOverlay.onclick = closeModal;
});

