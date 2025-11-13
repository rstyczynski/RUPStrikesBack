# RUP Strikes Back demo

version: 1
status: Progress

Experimenting with GitHub workflows to validate its behavior.

## Instructions for the Implementor

### Project overview

This Backlog presents exemplary project coded using RUP Strikes Back method. Exemplary program informs about weather forecast using regular software stack: CLI, REST API and Web UI. Demo is build in phases presenting 

## Backlog

Project aim to deliver all the features listed in a below Backlog. Backlog Items selected for implementation are added to iterations detailed in `PLAN.md`. Full list of Backlog Items presents general direction and aim for this project.

### RSB-1. Prepare tools and techniques

Project is coded using Go! language on OSX, Linux or Windows. It is mandatory to document system configuration to prepare for development and runtime. This is is the moment to select proper public weather service that will be used by this solution.

### RSB-2. Weather forecast CLI

This backlog item involves creating a command-line interface application that provides weather forecast information to users through their terminal. Users can interact with the weather service by typing commands and receiving text-based weather data. This represents the foundational layer establishing core weather data retrieval and display functionality. User provides city name or GPS coordinates to get current weather information and forecast for next 3 days.

### RSB-3. Weather forecast CLI asks for user's name to remember her/his preferences

This item adds personalization by prompting for the user's name and storing their preferences across sessions. The system would remember settings like preferred location, temperature units, or display format. This introduces data persistence and user profile management to make the CLI more user-friendly.

### RSB-4. Weather forecast exposes REST API

This backlog item involves developing a RESTful API that exposes weather forecast data through standard HTTP methods. The API enables programmatic access to weather information in formats like JSON, allowing multiple client types to consume the service. This creates a service-oriented architecture that separates data logic from presentation layers.

### RSB-5. Weather forecast WebUI

This item involves building a web-based graphical user interface accessible through browsers. The WebUI would provide an interactive experience with visual elements like weather icons, maps, and charts while consuming the REST API. This represents the most sophisticated presentation layer demonstrating full-stack development with modern frontend frameworks and responsive design.

### RSB-6. WebUI: Add map presentation for city location disambiguation

Enhance the WebUI by integrating a map view that visually presents the location of the searched city. As city names can often be ambiguous (multiple cities with the same name in different regions or countries), this feature will display a map centered on the selected city's coordinates to help users confirm the intended location. The map should update dynamically based on the user's search input and be clearly visible alongside or near the weather data. Incorporate open-source map solutions (such as OpenStreetMap or Leaflet.js) and ensure seamless interaction between the map and the existing REST API-based weather data retrieval. Weather REST API need to return geo-coordinates for searched city to be sure that map shows always the same location that weather REST API uses.
