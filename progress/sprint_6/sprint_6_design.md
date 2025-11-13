# Sprint 6 - Design

## RSB-6: Add Map Presentation for City Location Disambiguation

Status: Accepted

### Requirement Summary

Add interactive map to Weather WebUI displaying the location of searched cities. Map helps users disambiguate between cities with identical names by showing geographic context.

### YOLO Mode Decisions

#### Decision 1: Map Library (Leaflet.js)
**Context**: Need to select open-source mapping solution
**Decision Made**: Leaflet.js v1.9+ with OpenStreetMap tiles
**Rationale**: Industry standard, 40KB gzipped, excellent React integration, free tile servers
**Alternatives Considered**: Google Maps (requires API key/billing), Mapbox (requires account)
**Risk**: Low - proven library with extensive documentation

#### Decision 2: Component Integration Point
**Context**: Where to place map in existing UI
**Decision Made**: New MapView component inserted above CurrentConditionsCard
**Rationale**: Provides immediate geographic context before weather details
**Alternatives Considered**: Side-by-side layout (complex responsive), below forecast (loses visibility)
**Risk**: Low - can be repositioned via CSS

#### Decision 3: Map Dimensions
**Context**: Map size affects usability and page layout
**Decision Made**: Full-width container, 400px height on desktop, 300px on mobile
**Rationale**: Balance between useful map size and not dominating page
**Alternatives Considered**: Fixed aspect ratio (wastes space), collapsible (adds complexity)
**Risk**: Low - standard web map sizing

### Feasibility Analysis

**API Availability:**
✓ Leaflet.js available via npm/CDN
✓ OpenStreetMap tiles free and unrestricted
✓ Weather API already returns `latitude` and `longitude` in LocationResponse

**Technical Constraints:**
- Requires internet access for map tiles (acceptable for web app)
- Adds ~200KB to bundle size (40KB Leaflet + ~150KB tiles cached)
- Leaflet requires DOM element with defined height

**Risk Assessment:**
- **Tile server availability**: LOW - OpenStreetMap is highly reliable, fallback to alternative tile servers possible
- **Browser compatibility**: LOW - Leaflet supports all modern browsers
- **Performance**: LOW - Maps render efficiently, tiles cached by browser

### Design Overview

**Architecture:**
```
WebUI Component Tree:
  App.tsx
    ├─ SearchForms (existing)
    ├─ MapView (NEW) ← receives coordinates from search result
    ├─ CurrentConditionsCard (existing)
    └─ ForecastGrid (existing)
```

**Key Components:**
1. **MapView Component**: React component that initializes Leaflet map, displays marker at coordinates
2. **Coordinate Flow**: useWeatherSearch hook extracts coordinates from API response, passes to MapView

**Data Flow:**
```
User searches → API returns WeatherResponse with location.latitude/longitude
  → App.tsx extracts coordinates → MapView receives coords prop
  → Leaflet centers map and places marker
```

### Technical Specification

**Dependencies to Add:**
```json
{
  "leaflet": "^1.9.4",
  "@types/leaflet": "^1.9.8"
}
```

**New Component API:**
```typescript
interface MapViewProps {
  latitude: number;
  longitude: number;
  cityName?: string; // for marker popup
}

function MapView({ latitude, longitude, cityName }: MapViewProps): JSX.Element
```

**Leaflet Configuration:**
```typescript
const map = L.map('map-container').setView([latitude, longitude], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

L.marker([latitude, longitude])
  .bindPopup(cityName || 'Location')
  .addTo(map);
```

**Error Handling:**
- Invalid coordinates (NaN, null): Hide map component gracefully
- Tile loading failure: Leaflet displays gray tiles, app continues functioning
- Missing cityName: Use generic "Location" popup text

### Implementation Approach

**Step 1:** Install dependencies
```bash
npm install leaflet @types/leaflet
```

**Step 2:** Create MapView component in `src/components/MapView.tsx`
- Import Leaflet CSS
- Initialize map in useEffect hook
- Handle cleanup on unmount
- Update map center when coordinates change

**Step 3:** Update App.tsx
- Extract coordinates from weatherData response
- Add MapView component conditionally (only when weatherData exists)
- Pass latitude, longitude, and cityName props

**Step 4:** Add responsive CSS
- 400px height desktop, 300px mobile
- Full-width container
- Margin spacing to separate from other components

### Testing Strategy

**Functional Tests:**
1. Search "Paris" → Verify map shows Paris, France location
2. Search "London" → Verify map centers on London, UK
3. Search coordinates (51.5,-0.1) → Verify map displays at those exact coordinates
4. New search → Verify map updates to new location

**Edge Cases:**
1. API returns no coordinates → Map should not render (conditional display)
2. Invalid coordinates (0,0) → Map shows ocean (technically correct)
3. Rapid consecutive searches → Map should smoothly update without errors

**Success Criteria:**
- Map displays for all successful weather searches
- Marker accurately placed at returned coordinates
- Map is interactive (zoom, pan functional)
- No console errors related to Leaflet

### Integration Notes

**Dependencies:**
- Existing weather API (no changes needed)
- Existing useWeatherSearch hook (minor modification to expose coordinates)

**Compatibility:**
- Integrates as new component in existing React tree
- No breaking changes to existing components
- CSS scoped to avoid conflicts

**Reusability:**
- MapView component can be reused if future features need maps
- Coordinate extraction pattern reusable for other location features

### Documentation Requirements

**User Documentation:**
- Update README: "WebUI displays interactive map showing searched city location"
- No user action required - map automatically appears with weather results

**Technical Documentation:**
- Document MapView component props
- Note Leaflet dependency and OpenStreetMap attribution requirement
- Add comment explaining coordinate flow from API to map

### Design Decisions Summary

1. **Leaflet.js + OpenStreetMap**: Free, reliable, industry standard
2. **Map placement**: Above weather card for immediate context
3. **Sizing**: 400px desktop / 300px mobile for usability
4. **Integration**: New component, minimal changes to existing code

### Open Design Questions

None

---

# Design Summary

## Overall Architecture

Single new React component (MapView) integrated into existing App.tsx layout. Leverages coordinates already returned by weather API. No backend changes required.

## Shared Components

MapView component could be extracted to shared component library if other features need mapping in future.

## Design Risks

All risks assessed as LOW. Primary technical dependencies (Leaflet.js, OpenStreetMap) are mature and reliable.

## Resource Requirements

- **Libraries**: leaflet (npm), @types/leaflet (npm)
- **External Services**: OpenStreetMap tile servers (free, no API key)
- **Bundle Size Impact**: +200KB (acceptable for feature value)

## Design Approval Status

Accepted (YOLO mode - auto-approved)

---

**Token Usage**: ~35,000 tokens (design creation)
