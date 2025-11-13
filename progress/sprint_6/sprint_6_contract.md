# Sprint 6 Contracting Phase

**Mode**: YOLO (Autonomous execution)
**Sprint**: 6 - WebUI map extension
**Backlog Item**: RSB-6 - Add map presentation for city location disambiguation

## Contract Reused

This sprint reuses the contracting agreements from Sprint 5, as the technology stack and cooperation rules remain unchanged.

**Reference**: See `progress/sprint_5/sprint_5_contract_review_1.md` for detailed contracting terms.

## Key Points Confirmed

**Project Scope**: Add interactive map to WebUI for city disambiguation using OpenStreetMap/Leaflet.js

**Technology Stack** (unchanged from Sprint 5):
- Go backend with REST API
- HTML/CSS/JavaScript frontend
- OpenWeather API integration
- Now adding: Leaflet.js + OpenStreetMap

**Cooperation Rules**:
- ✓ Generic rules apply (GENERAL_RULES.md, GIT_RULES.md, PRODUCT_OWNER_GUIDE.md)
- ✓ Semantic commit messages required
- ✓ Git push after each phase
- ✓ State management via PLAN.md updates
- ✓ Brief documentation (YOLO mode: max 1 page per phase)

**Current Sprint Status**: Progress
**Execution Mode**: YOLO - autonomous with reasonable assumptions

## Responsibilities

**Allowed to edit**:
- `weather-webui/` directory (HTML/CSS/JS files)
- `weather-api/` directory if geo-coordinates need to be added to API response
- Documentation in `progress/sprint_6/`
- PLAN.md status updates

**Must not modify**:
- BACKLOG.md structure
- Previous sprint artifacts
- Git workflow configuration

## Open Questions

None - Requirements are clear:
1. Add map view to WebUI
2. Show city location on map
3. Sync map with weather data (same coordinates)
4. Use open-source mapping solution

## Status

✓ **Contracting Complete - Ready for Inception**

## Artifacts Created

- `progress/sprint_6/sprint_6_contract.md`

## Next Phase

Inception Phase (Agent-Analyst)

---

**Token Usage**: ~25,000 tokens (reading phase + contracting setup)
