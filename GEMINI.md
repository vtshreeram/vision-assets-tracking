# Vision Asset Tracking

## Project Overview
Vision Asset Tracking is a single-page frontend application (SPA) designed to serve as a comprehensive dashboard for tracking physical assets, connected devices, drivers, and incidents. It provides a visual interface for managing fleet operations, monitoring device health, resolving incidents, and viewing real-time analytics.

**Key Technologies:**
*   **Vanilla HTML/CSS/JS**: Built entirely without frontend frameworks like React or Vue.
*   **Chart.js**: Utilized for rendering interactive analytics charts.
*   **Leaflet.js**: Used for plotting asset locations on interactive maps.
*   **In-Memory Data**: Currently relies on a hardcoded, in-memory state architecture initialized within the main JavaScript class.

## Building and Running
The application does not use package managers (like `npm` or `yarn`) or bundlers (like Webpack or Vite). 

To run the project:
1.  Serve the project directory using any local static HTTP server. For example:
    *   Python: `python3 -m http.server`
    *   Node.js: `npx serve` or `npx http-server`
2.  Open the local address (e.g., `http://localhost:8000`) in your web browser to view `index.html`.
*Note: Opening `index.html` directly in the browser via the `file://` protocol will also work, but using a local server is recommended to ensure complete compatibility.*

## Development Conventions
*   **JavaScript Architecture**: The entire application logic is encapsulated within a central `AssetTrackingApp` class in `app.js`. It handles routing (module switching), event binding, rendering HTML via template literals, and managing the state object (`this.data`).
*   **CSS Design System**: The project utilizes a robust, custom design system in `style.css` defined via CSS Custom Properties (`:root`). It includes extensive design tokens for colors, typography, spacing, and shadows, and natively supports dark mode (`@media (prefers-color-scheme: dark)` and `[data-color-scheme="dark"]`).
*   **CSS Methodology**: Class naming loosely follows BEM-like conventions (e.g., `sidebar__item`, `btn--primary`, `btn--sm`) for component variations and elements.
*   **External Dependencies**: Libraries (Chart.js and Leaflet) are loaded via external CDNs directly in the `<head>` of `index.html`. Do not attempt to run `npm install` for these dependencies.