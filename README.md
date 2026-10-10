# SENTINEL Command Center

SENTINEL is a responsive emergency-response dashboard built with React, TypeScript, Vite, and React-Leaflet. It presents a Chennai incident-monitoring demo with a ranked response board, a live map, incident evidence and resource details, notifications, and operator profile screens.

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To create and preview a production build:

```sh
npm run build
npm run preview
```

This repository also includes `pnpm-lock.yaml` for installations using pnpm.

## Dashboard features

- Operations navigation opens from the menu button or the left screen edge and closes after five seconds.
- The command center summarizes recent emergency signals and ranks incidents for operator attention.
- Select an incident on the map or in the incident list to review its priority, reported location, coordinates, people affected, requested resources, evidence, and status.
- Incident updates, notification preferences, the profile page, and the demo sign-in flow are frontend demonstrations.
- High-priority incidents can show a popup alert. Alert sound is off until enabled in settings.

## Map and demo data

Incident records and reports are sample data in `src/data.ts`. They are not live dispatch information. The blue circles and blue resource markers are illustrative demo locations, not verified impact boundaries or verified service-facility locations. OpenStreetMap tiles are loaded on demand and require an internet connection; the map displays OpenStreetMap attribution.

## Project structure

```text
src/
  components/IncidentMap.tsx   Leaflet incident map and demo resource markers
  App.tsx                      Dashboard, navigation, notifications, and demo pages
  data.ts                      Sample incidents and reports
  styles.css                   Base styles
  overrides.css                Dashboard and responsive styles
index.html                     Vite entry point
```

## Limitations

There is no backend, authentication service, persistent data store, or dispatch integration. Edits are held in browser memory for the current session. Use a verified operational data source before treating any incident or map information as real.
