// State & Map instances
let map = null;
let marker = null;

// DOM Elements
const ipv4AddressEl = document.getElementById('ipv4-address');
const ipv6AddressEl = document.getElementById('ipv6-address');
const ipInput = document.getElementById('ip-input');
const searchBtn = document.getElementById('search-btn');
const myIpBtn = document.getElementById('my-ip-btn');
const toastEl = document.getElementById('toast');

// Details Elements
const detailsLoading = document.getElementById('details-loading');
const detailsContent = document.getElementById('details-content');
const detailsError = document.getElementById('details-error');
const ipTypeBadge = document.getElementById('ip-type-badge');

const countryVal = document.getElementById('country-val');
const regionVal = document.getElementById('region-val');
const cityVal = document.getElementById('city-val');
const postalVal = document.getElementById('postal-val');
const ispVal = document.getElementById('isp-val');
const orgVal = document.getElementById('org-val');
const asnVal = document.getElementById('asn-val');
const timezoneVal = document.getElementById('timezone-val');
const coordsVal = document.getElementById('coords-val');
const flagImg = document.getElementById('flag-img');

// Initialize Leaflet Map
function initMap(lat = 0, lng = 0, zoom = 2) {
  if (!map) {
    map = L.map('map').setView([lat, lng], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  } else {
    map.setView([lat, lng], zoom);
  }

  if (marker) {
    map.removeLayer(marker);
  }

  if (lat !== 0 || lng !== 0) {
    marker = L.marker([lat, lng]).addTo(map);
  }
}

// Show toast notification
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2500);
}

// Fetch user's IPv4 address
async function fetchIPv4() {
  ipv4AddressEl.textContent = 'Carregando...';
  try {
    const res = await fetch('https://api4.ipify.org?format=json');
    if (!res.ok) throw new Error('Falha ao buscar IPv4');
    const data = await res.json();
    ipv4AddressEl.textContent = data.ip || 'Não detectado';
  } catch (err) {
    ipv4AddressEl.textContent = 'Indisponível / Não suportado';
  }
}

// Fetch user's IPv6 address
async function fetchIPv6() {
  ipv6AddressEl.textContent = 'Carregando...';
  try {
    const res = await fetch('https://api64.ipify.org?format=json');
    if (!res.ok) throw new Error('Falha ao buscar IPv6');
    const data = await res.json();
    // If returned IP contains colon ':', it's IPv6
    if (data.ip && data.ip.includes(':')) {
      ipv6AddressEl.textContent = data.ip;
    } else {
      ipv6AddressEl.textContent = 'Indisponível (Conexão IPv4)';
    }
  } catch (err) {
    ipv6AddressEl.textContent = 'Indisponível / Não suportado';
  }
}

// Fetch Geolocation & Whois details for an IP (or current IP if parameter empty)
async function fetchIPDetails(queryIp = '') {
  detailsLoading.classList.remove('hidden');
  detailsContent.classList.add('hidden');
  detailsError.classList.add('hidden');

  try {
    const url = queryIp ? `https://ipwho.is/${encodeURIComponent(queryIp)}` : 'https://ipwho.is/';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro na requisição');

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'IP inválido ou não encontrado.');
    }

    // Populate Details
    ipTypeBadge.textContent = data.type || 'IP';
    countryVal.textContent = `${data.country || '-'} (${data.country_code || ''})`;
    regionVal.textContent = `${data.region || '-'} (${data.region_code || ''})`;
    cityVal.textContent = data.city || '-';
    postalVal.textContent = data.postal || 'Não informado';

    const conn = data.connection || {};
    ispVal.textContent = conn.isp || '-';
    orgVal.textContent = conn.org || '-';
    asnVal.textContent = conn.asn ? `AS${conn.asn}` : '-';

    const tz = data.timezone || {};
    timezoneVal.textContent = tz.id ? `${tz.id} (UTC ${tz.utc || ''})` : '-';

    const lat = data.latitude;
    const lng = data.longitude;
    coordsVal.textContent = (lat !== undefined && lng !== undefined) ? `${lat}, ${lng}` : '-';

    if (data.flag && data.flag.img) {
      flagImg.src = data.flag.img;
      flagImg.alt = data.country || 'Bandeira';
      flagImg.style.display = 'inline-block';
    } else {
      flagImg.style.display = 'none';
    }

    // Update Map
    if (lat !== undefined && lng !== undefined) {
      initMap(lat, lng, 12);
      if (marker) {
        marker.bindPopup(`<b>${data.ip}</b><br>${data.city || ''}, ${data.country || ''}`).openPopup();
      }
    }

    detailsLoading.classList.add('hidden');
    detailsContent.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    detailsLoading.classList.add('hidden');
    detailsError.textContent = err.message || 'Ocorreu um erro ao buscar os dados do IP.';
    detailsError.classList.remove('hidden');
  }
}

// Copy to Clipboard handler
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const textToCopy = document.getElementById(targetId)?.textContent;

    if (textToCopy && textToCopy !== 'Carregando...' && !textToCopy.includes('Indisponível')) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('IP copiado para a área de transferência!');
      }).catch(() => {
        showToast('Erro ao copiar.');
      });
    }
  });
});

// Search button event listener
searchBtn.addEventListener('click', () => {
  const query = ipInput.value.trim();
  fetchIPDetails(query);
});

// Press enter in input
ipInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = ipInput.value.trim();
    fetchIPDetails(query);
  }
});

// My IP button event listener
myIpBtn.addEventListener('click', () => {
  ipInput.value = '';
  fetchIPDetails('');
});

// Initial Setup on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  fetchIPv4();
  fetchIPv6();
  fetchIPDetails();
});
