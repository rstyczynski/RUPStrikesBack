function qs(id) { return document.getElementById(id); }
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function renderLocation(el, location) {
  if (!location) { hide(el); return; }
  const { name, country, admin1, latitude, longitude } = location;
  el.innerHTML = `<h2>Location</h2>
    <div>${name || ''}${admin1 ? ', ' + admin1 : ''}${country ? ', ' + country : ''}</div>
    <div>Coordinates: ${latitude?.toFixed?.(2) ?? ''}, ${longitude?.toFixed?.(2) ?? ''}</div>`;
  show(el);
}

function renderCurrent(el, current) {
  if (!current) { hide(el); return; }
  const { temperature_2m, weather_code } = current;
  el.innerHTML = `<h2>Current Weather</h2>
    <div>Temperature: ${temperature_2m}°C</div>
    <div>Code: ${weather_code}</div>`;
  show(el);
}

function renderForecast(el, daily) {
  if (!daily) { hide(el); return; }
  const rows = (daily.time || []).map((t, i) => {
    const max = daily.temperature_2m_max?.[i];
    const min = daily.temperature_2m_min?.[i];
    return `<tr><td>${t}</td><td>${max}</td><td>${min}</td></tr>`;
  }).join('');
  el.innerHTML = `<h2>3-Day Forecast</h2>
    <table class="table">
      <thead><tr><th>Date</th><th>Max °C</th><th>Min °C</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  show(el);
}

async function request(url) {
  const errEl = qs('error');
  const resultEl = qs('result');
  hide(errEl);
  hide(resultEl);
  try {
    const res = await fetch(url);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (_) { throw new Error(`Invalid JSON from API: ${text.slice(0,120)}`); }
    if (!res.ok) {
      const msg = data?.error || res.statusText || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    const locEl = qs('location');
    const curEl = qs('current');
    const fcEl = qs('forecast');
    renderLocation(locEl, data.location);
    renderCurrent(curEl, data.forecast?.current);
    renderForecast(fcEl, data.forecast?.daily);
    show(resultEl);
  } catch (e) {
    errEl.textContent = e.message || String(e);
    show(errEl);
  }
}

function buildBase() {
  let base = qs('apiBase').value.trim();
  if (base.endsWith('/')) base = base.slice(0, -1);
  return base;
}

function onCity() {
  const city = qs('city').value.trim();
  if (!city) { qs('error').textContent = 'Enter city name'; show(qs('error')); return; }
  const url = `${buildBase()}/v1/weather?city=${encodeURIComponent(city)}`;
  request(url);
}

function onCoords() {
  const lat = qs('lat').value.trim();
  const lon = qs('lon').value.trim();
  if (!lat || !lon) { qs('error').textContent = 'Enter both latitude and longitude'; show(qs('error')); return; }
  const url = `${buildBase()}/v1/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  request(url);
}

window.addEventListener('DOMContentLoaded', () => {
  qs('byCity').addEventListener('click', onCity);
  qs('byCoords').addEventListener('click', onCoords);
});
