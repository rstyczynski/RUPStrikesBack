# Sprint 5 - Design

## RSB-6. WebUI: Add map presentation for city location disambiguation

Status: Proposed

### Requirement Summary

Display interactive map centered on searched city coordinates to visually confirm location and disambiguate cities with identical names (e.g., "Springfield" in multiple states/countries).

### Feasibility Analysis

**API Availability:**

✅ Sprint 3 REST API confirmed returns coordinates in response (verified in Sprint 3 design):
- `/weather?city=<name>` → Returns `location.latitude`, `location.longitude`
- Sprint 3 design lines 110-128: JSON structure includes lat/lon

✅ Open-Meteo API provides coordinates via Sprint 3 geocoding (Open-Meteo Geocoding API)

✅ Leaflet.js library available:
- CDN: https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
- OpenStreetMap tiles: Free, no API key required
- Mature library (~40KB), widely used

**Technical Constraints:**

- Browser JavaScript (ES6+) - consistent with Sprint 4
- CDN dependency for Leaflet.js (or local bundle)
- Internet connectivity for OSM tile loading
- No backend changes needed (Sprint 3 API sufficient)

**Risk Assessment:**

| Risk | Severity | Mitigation |
|------|----------|------------|
| CDN unavailable | Low | Use reliable CDN (unpkg.com), consider local fallback |
| OSM tile loading slow | Low | Leaflet handles caching, acceptable for MVP |
| Coordinates missing in API | Low | Verified in Sprint 3 design (lat/lon present) |
| Map rendering on mobile | Low | Leaflet responsive by default |

**Feasibility:** HIGH - All APIs confirmed, Leaflet.js proven technology, ~90% code reuse

### Design Overview

**Architecture:**

```
User searches city → JavaScript fetch() → Sprint 3 API
                                              ↓
                         Returns JSON with location.latitude, location.longitude
                                              ↓
                         JavaScript: map.setView([lat, lon], zoom)
                                              ↓
                         Leaflet.js centers map on location
                                              ↓
                         Add marker to show city position
```

**Key Components:**

1. **Leaflet.js Library** - Map rendering, tile management, marker display
2. **Map Container (HTML)** - `<div id="map"></div>` in `static/index.html`
3. **Map Initialization (JS)** - `app.js`: Initialize map on page load
4. **Map Update Logic (JS)** - Center map and add marker on weather search success
5. **CSS Styling** - Map container sizing, responsive layout

**Data Flow:**

1. Page load → Initialize empty map (default view: world map)
2. User searches "London" → Existing fetch() calls Sprint 3 API
3. API returns `{"location": {"latitude": 51.5, "longitude": -0.1, ...}, ...}`
4. `displayWeather()` function updated to:
   - Center map: `map.setView([lat, lon], 10)`
   - Add marker: `L.marker([lat, lon]).addTo(map)`
   - Update weather display (existing logic)

### Technical Specification

**Project Structure (modifications to Sprint 4):**

```
weather-web/static/
├── index.html       # Add map container <div>
├── style.css        # Add map styling (#map { height: 400px; })
└── app.js           # Add map init, update logic
```

**HTML Changes (index.html):**

Add in `<head>`:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

Add after search form, before results:
```html
<!-- Map Container -->
<div id="map"></div>
```

**CSS Changes (style.css):**

```css
#map {
    height: 400px;
    width: 100%;
    margin: 20px 0;
    border-radius: 5px;
    display: none; /* Hidden until first search */
}

#map.visible {
    display: block;
}

@media (max-width: 600px) {
    #map { height: 300px; }
}
```

**JavaScript Changes (app.js):**

**1. Initialize map on page load:**

```javascript
// Global map instance
let map = null;
let marker = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize map (hidden initially)
    map = L.map('map').setView([0, 0], 2); // World view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
});
```

**2. Update displayWeather() function:**

```javascript
function displayWeather(data) {
    // Existing weather display logic...

    // NEW: Center map on location and add marker
    const lat = data.location.latitude;
    const lon = data.location.longitude;

    // Remove previous marker if exists
    if (marker) {
        map.removeLayer(marker);
    }

    // Center map and add new marker
    map.setView([lat, lon], 10);
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`${data.location.name}, ${data.location.country}`)
        .openPopup();

    // Show map
    document.getElementById('map').classList.add('visible');

    // Existing display logic continues...
}
```

### Implementation Approach

**Step 1:** Add Leaflet.js CDN links to `index.html` `<head>`
**Step 2:** Add `<div id="map"></div>` to HTML (after search form)
**Step 3:** Add map CSS to `style.css` (height, responsive rules)
**Step 4:** Add map initialization to `app.js` (on DOMContentLoaded)
**Step 5:** Modify `displayWeather()` to center map and add marker
**Step 6:** Test with city searches (London, Tokyo, Springfield)
**Step 7:** Verify responsive behavior (mobile, desktop)

### Testing Strategy

**Functional Tests:**

| Test | Input | Expected Output | Verification |
|------|-------|----------------|--------------|
| Map loads | Page load | Empty map visible (world view) | Visual check |
| Map centers | Search "London" | Map centers on London (51.5°N, 0.1°W), marker visible | Visual + coordinates |
| Marker popup | Click marker | Popup shows "London, United Kingdom" | Visual |
| Multiple searches | Search "Tokyo" after "London" | Map re-centers, old marker removed, new marker added | Visual |
| Responsive | Resize browser | Map height adjusts (400px → 300px on mobile) | Visual |

**Success Criteria:**

- ✅ Map displays on page load (hidden until first search)
- ✅ Map centers on searched city coordinates
- ✅ Marker shows city location
- ✅ Popup displays city name and country
- ✅ Previous marker removed on new search
- ✅ Responsive design works on mobile/desktop

### Integration Notes

**Dependencies:**

- **Sprint 3 (CRITICAL):** REST API returns `location.latitude` and `location.longitude`
- **Sprint 4 (CRITICAL):** Existing `displayWeather()` function extended
- **External:** Leaflet.js CDN, OpenStreetMap tiles

**Compatibility:**

- Extends Sprint 4 WebUI (modifies existing files)
- No backend changes required
- Forward compatible with RSB-7 (click handler will use same map instance)

**Reusability:**

- Map instance shared with RSB-7
- Marker management pattern reusable

### Documentation Requirements

**User Documentation:**
- Map feature description in README
- How map syncs with weather search
- Visual location confirmation benefit

**Technical Documentation:**
- Leaflet.js integration details
- Map initialization parameters
- Coordinate data flow

---

## RSB-7. WebUI: User clicks on a map to get forecast for this point

Status: Proposed

### Requirement Summary

Enable users to click any point on the map to receive weather forecast for that location. Supports arbitrary geographic queries beyond city names.

### Feasibility Analysis

**API Availability:**

✅ Sprint 3 REST API supports coordinate endpoint (verified in Sprint 3 design):
- `/weather?lat=<lat>&lon=<lon>` → Returns forecast for coordinates
- Sprint 3 design lines 95-97: Coordinate endpoint documented

✅ Leaflet.js click event available:
- `map.on('click', callback)` - Standard Leaflet API
- `event.latlng.lat`, `event.latlng.lng` - Coordinate extraction

**Technical Constraints:**

- Reuse existing `displayWeather()` function (Sprint 4)
- Reuse existing map instance (RSB-6)
- Browser JavaScript (ES6+)

**Risk Assessment:**

| Risk | Severity | Mitigation |
|------|----------|------------|
| Ocean/remote clicks | Low | Open-Meteo returns forecast for any valid coordinates |
| Coordinate precision | Low | Leaflet provides float values, API accepts them |
| Duplicate markers | Low | Clear marker before adding new one |

**Feasibility:** HIGH - All APIs confirmed, simple event handler, 100% code reuse

### Design Overview

**Architecture:**

```
User clicks map → Leaflet click event fires
                        ↓
              Extract lat/lon from event.latlng
                        ↓
         fetch('/weather?lat=${lat}&lon=${lon}')
                        ↓
              Sprint 3 API returns forecast
                        ↓
              Reuse displayWeather(data)
                        ↓
              Map re-centers, marker updates
```

**Key Components:**

1. **Map Click Event Handler** - Capture click, extract coordinates
2. **Fetch Function** - Reuse existing API call logic (extend to support coordinates)
3. **Display Function** - Reuse existing `displayWeather()` (already handles coordinate responses)

**Data Flow:**

1. User clicks map at arbitrary point (e.g., ocean, mountain)
2. Click event: `(e) => { lat = e.latlng.lat; lon = e.latlng.lng; }`
3. Fetch: `fetch(/weather?lat=${lat}&lon=${lon})`
4. Sprint 3 API returns: `{"location": {"latitude": lat, "longitude": lon, ...}, "current": {...}, "daily": {...}}`
5. Call existing `displayWeather(data)` → Map re-centers, marker updates, forecast displays

### Technical Specification

**JavaScript Changes (app.js):**

**Add map click event handler:**

```javascript
// Add to initialization after map creation
map.on('click', async (e) => {
    const lat = e.latlng.lat.toFixed(2);
    const lon = e.latlng.lng.toFixed(2);

    try {
        const response = await fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error('Failed to fetch weather for coordinates');

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
});
```

**Extend displayWeather() to handle coordinate-only locations:**

```javascript
function displayWeather(data) {
    // Handle both city names and coordinate-only locations
    const locationName = data.location.name || `${data.location.latitude}°, ${data.location.longitude}°`;
    const locationCountry = data.location.country || '';

    document.getElementById('location').innerHTML =
        `<h2>${locationName}${locationCountry ? ', ' + locationCountry : ''}</h2>`;

    // Rest of existing logic unchanged...
    // Map centering and marker logic (from RSB-6)
}
```

### Implementation Approach

**Step 1:** Add map click event listener in `app.js` (after map initialization)
**Step 2:** Extract coordinates from `event.latlng`
**Step 3:** Fetch weather using coordinate endpoint
**Step 4:** Handle coordinate-only responses (no city name)
**Step 5:** Reuse existing `displayWeather()` function
**Step 6:** Test with ocean clicks, mountain clicks, city clicks

### Testing Strategy

**Functional Tests:**

| Test | Action | Expected Output | Verification |
|------|--------|----------------|--------------|
| Ocean click | Click Atlantic Ocean | Forecast for coordinates, no city name | Visual + API response |
| City click | Click on Tokyo area | Forecast for Tokyo coordinates | Visual |
| Multiple clicks | Click 3 different locations | Each updates forecast, marker moves | Visual |
| Coordinate precision | Click → Check API call | Coordinates rounded to 2 decimals | Network tab |

**Edge Cases:**

- Click near poles (extreme latitudes) → API handles correctly
- Click on dateline (longitude ±180) → API handles correctly
- Rapid clicks → Only last fetch completes

**Success Criteria:**

- ✅ Map click triggers weather fetch
- ✅ Coordinates extracted correctly
- ✅ Forecast displays for arbitrary locations
- ✅ Marker updates to clicked position
- ✅ Coordinate-only locations handled (no city name)

### Integration Notes

**Dependencies:**

- **RSB-6 (CRITICAL):** Map instance must exist
- **Sprint 3:** Coordinate endpoint `/weather?lat=<lat>&lon=<lon>`
- **Sprint 4:** `displayWeather()` function reused

**Compatibility:**

- Works seamlessly with RSB-6 (shares map instance)
- Extends city search functionality (coordinate alternative)
- No backend changes required

**Reusability:**

- Click event pattern reusable for future features
- Coordinate-to-forecast logic encapsulated

### Documentation Requirements

**User Documentation:**
- Click-to-forecast feature description
- Arbitrary location support
- Coordinate display format

**Technical Documentation:**
- Click event handling
- Coordinate extraction and formatting
- API call flow

---

# Design Summary

## Overall Architecture

Extend Sprint 4 WebUI with Leaflet.js map integration. RSB-6 adds map display synchronized with city search (coordinates from Sprint 3 API). RSB-7 adds click-to-forecast via same map instance. Minimal new code (~100 lines), maximum reuse from Sprint 3-4.

**Data Flow:**
```
User Input (City Search OR Map Click)
          ↓
Sprint 3 REST API (/weather?city=X OR /weather?lat=Y&lon=Z)
          ↓
JSON Response (location + forecast)
          ↓
displayWeather() → Update DOM + Center Map + Add Marker
```

## Shared Components

- **Map Instance:** Single `L.map()` shared by RSB-6 (search sync) and RSB-7 (click handler)
- **displayWeather():** Extended to handle both city and coordinate responses
- **Sprint 3 API:** Both city and coordinate endpoints reused
- **Leaflet.js:** CDN library for all map functionality

## Design Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| CDN unavailable | Low | Reliable CDN (unpkg.com), could add local fallback |
| Coordinates missing in API | Low | Verified in Sprint 3 design (lat/lon present) |
| Map performance on slow networks | Low | Leaflet caching, acceptable for MVP |
| Mobile map usability | Low | Leaflet responsive, 300px height on mobile |

## Resource Requirements

**Tools:**
- Sprint 4 WebUI (`weather-web/`) ✅
- Leaflet.js 1.9.4 (CDN) - External dependency

**External Services:**
- OpenStreetMap tiles (free, no API key)
- Sprint 3 REST API (localhost:8080) ✅

**Browser Support:**
- Modern browsers with ES6+ (Chrome, Firefox, Safari, Edge)
- JavaScript enabled

## YOLO Mode Decisions

**Decision 1: Leaflet.js CDN vs Local Bundle**

**Context:** Leaflet.js can be served via CDN or bundled locally
**Decision Made:** Use CDN (unpkg.com)
**Rationale:** Simpler setup (no build step), faster initial dev, CDN caching benefits, consistent with Sprint 4 (no build process)
**Alternatives Considered:** Local bundle (rejected - adds complexity, premature optimization)
**Risk:** Low - unpkg.com reliable, could add local fallback if needed

**Decision 2: Default Map View**

**Context:** Initial map center and zoom not specified
**Decision Made:** World view (lat=0, lon=0, zoom=2), hidden until first search
**Rationale:** Neutral starting point, avoids geographic bias, map becomes visible/useful after search
**Alternatives Considered:** Center on US (rejected - not globally neutral), Visible on load (rejected - map empty until search)
**Risk:** Low - Map updates immediately on first use, initial view barely noticed

**Decision 3: Marker Management Strategy**

**Context:** Should multiple searches/clicks create multiple markers or replace previous?
**Decision Made:** Single marker (remove previous before adding new)
**Rationale:** Cleaner UI, focuses on current forecast, matches single forecast display, reduces clutter
**Alternatives Considered:** Multiple markers with history (rejected - clutters map, over-engineering for MVP)
**Risk:** Low - Aligns with single forecast focus, user can re-click for history

## Design Approval Status

**Status: Proposed → Auto-Approved (YOLO Mode)**

YOLO mode auto-approval: Design complete, all requirements addressed, feasibility confirmed, Sprint 3-4 integration verified. No blocking issues. Ready for Construction.

**Mode:** YOLO
**Speed:** FAST
**New Code:** ~100 lines JS + ~30 lines HTML/CSS
**Reused:** Sprint 3 API (100%), Sprint 4 display logic (~90%)

---

**Design Complete**
**Status:** Accepted (YOLO auto-approved)
**Ready for Construction**
