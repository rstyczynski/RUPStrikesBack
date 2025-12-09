function qs(id){return document.getElementById(id)}
function show(el){el.classList.remove('hidden')}
function hide(el){el.classList.add('hidden')}

function applyTheme(theme){const root=document.documentElement; if(theme==='dark'){root.classList.add('dark')}else{root.classList.remove('dark')}}
function initTheme(){let t=localStorage.getItem('theme'); if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'} applyTheme(t); localStorage.setItem('theme',t); const icon=qs('themeIcon'); if(window.lucide&&icon){lucide.createIcons({attrs:{}})}}
function toggleTheme(){const curr=localStorage.getItem('theme')||'light'; const next=curr==='dark'?'light':'dark'; localStorage.setItem('theme',next); applyTheme(next); if(window.lucide){const el=qs('themeIcon'); if(el){el.setAttribute('data-lucide', next==='dark'?'moon':'sun'); lucide.createIcons()}}}

let map, marker;
function ensureMap(){if(typeof L==='undefined')return; if(!map){map=L.map('map'); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(map);} show(qs('map'))}
function setMap(lat,lon){ensureMap(); if(!map)return; map.setView([lat,lon], 10); if(marker){marker.setLatLng([lat,lon])}else{marker=L.marker([lat,lon]).addTo(map)} if(!map._clickBound){map.on('click',e=>{const {lat,lng}=e.latlng; qs('lat').value=lat.toFixed(4); qs('lon').value=lng.toFixed(4); const url=`${buildBase()}/v1/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`; request(url)}); map._clickBound=true}}

function setLoading(on){const res=qs('result'); const sk=qs('skeleton'); const loc=qs('location'); const cur=qs('current'); const fc=qs('forecast'); if(on){show(res); show(sk); hide(loc); hide(cur); hide(fc)} else {hide(sk)}}

function renderLocation(el,location){if(!location){hide(el);return}const{name,country,admin1,latitude,longitude}=location;el.innerHTML=`<h2 class="text-lg font-semibold mb-2">Location</h2><div>${name||''}${admin1?', '+admin1:''}${country?', '+country:''}</div><div class="text-sm text-gray-600 dark:text-gray-300">Coordinates: ${latitude?.toFixed?.(2)??''}, ${longitude?.toFixed?.(2)??''}</div>`;show(el); if(typeof latitude==='number'&&typeof longitude==='number'){setMap(latitude,longitude)}}
function renderCurrent(el,current){if(!current){hide(el);return}const{temperature_2m,weather_code}=current;el.innerHTML=`<h2 class="text-lg font-semibold mb-2">Current Weather</h2><div class="text-2xl">${temperature_2m}°C</div><div class="text-sm text-gray-600 dark:text-gray-300">Code: ${weather_code}</div>`;show(el)}
function renderForecast(el,daily){if(!daily){hide(el);return}const rows=(daily.time||[]).map((t,i)=>{const max=daily.temperature_2m_max?.[i];const min=daily.temperature_2m_min?.[i];return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition"><td class="py-1">${t}</td><td>${max}</td><td>${min}</td></tr>`}).join('');el.innerHTML=`<h2 class="text-lg font-semibold mb-2">3-Day Forecast</h2><table class="table"><thead><tr><th>Date</th><th>Max °C</th><th>Min °C</th></tr></thead><tbody>${rows}</tbody></table>`;show(el)}

async function request(url){const errEl=qs('error');hide(errEl);setLoading(true);try{const res=await fetch(url);const text=await res.text();let data;try{data=JSON.parse(text)}catch(_){throw new Error(`Invalid JSON from API: ${text.slice(0,120)}`)}if(!res.ok){const msg=data?.error||res.statusText||`HTTP ${res.status}`;throw new Error(msg)}const locEl=qs('location');const curEl=qs('current');const fcEl=qs('forecast');renderLocation(locEl,data.location);renderCurrent(curEl,data.forecast?.current);renderForecast(fcEl,data.forecast?.daily)}catch(e){errEl.textContent=e.message||String(e);show(errEl)}finally{setLoading(false);show(qs('result'))}}

function buildBase(){let base=qs('apiBase').value.trim();if(base.endsWith('/'))base=base.slice(0,-1);return base}
function onCity(){const city=qs('city').value.trim();if(!city){qs('error').textContent='Enter city name';show(qs('error'));return}const url=`${buildBase()}/v1/weather?city=${encodeURIComponent(city)}`;request(url)}
function onCoords(){const lat=qs('lat').value.trim();const lon=qs('lon').value.trim();if(!lat||!lon){qs('error').textContent='Enter both latitude and longitude';show(qs('error'));return}const url=`${buildBase()}/v1/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;request(url)}

window.addEventListener('DOMContentLoaded',()=>{initTheme();const tbtn=qs('toggleTheme');if(tbtn){tbtn.addEventListener('click',toggleTheme)}qs('byCity').addEventListener('click',onCity);qs('byCoords').addEventListener('click',onCoords);if(window.lucide){lucide.createIcons()}})
