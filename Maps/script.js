let map;
let heatmap;
let ulezPolygon;

let currentMode = "normal"; // "normal" | "low-emission"

const emissionsPoints = [
  // Mock high emissions near central London
  { lat: 51.5074, lng: -0.1278, weight: 0.9 },
  { lat: 51.509, lng: -0.12, weight: 0.8 },
  { lat: 51.505, lng: -0.13, weight: 0.7 },
  { lat: 51.51, lng: -0.11, weight: 0.9 },
  // Some medium emissions
  { lat: 51.515, lng: -0.09, weight: 0.5 },
  { lat: 51.498, lng: -0.09, weight: 0.4 },
  // Lower emissions further out
  { lat: 51.52, lng: -0.15, weight: 0.3 },
  { lat: 51.53, lng: -0.18, weight: 0.2 },
];

function initMap() {
  const londonCenter = { lat: 51.5074, lng: -0.1278 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: londonCenter,
    zoom: 12,
    disableDefaultUI: false,
    styles: mapStyleDark,
  });

  // Heatmap layer
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: emissionsPoints.map((p) => ({
      location: new google.maps.LatLng(p.lat, p.lng),
      weight: p.weight,
    })),
    map: map,
    radius: 40,
  });

  // Mock ULEZ polygon (rough shape, not accurate)
  ulezPolygon = new google.maps.Polygon({
    paths: [
      { lat: 51.54, lng: -0.2 },
      { lat: 51.54, lng: -0.02 },
      { lat: 51.47, lng: -0.02 },
      { lat: 51.47, lng: -0.2 },
    ],
    strokeColor: "#22c55e",
    strokeOpacity: 0.7,
    strokeWeight: 1.5,
    fillColor: "#22c55e",
    fillOpacity: 0.08,
    map: map,
  });

  // Map click handler → show area info
  map.addListener("click", (event) => {
    handleMapClick(event.latLng);
  });

  // Setup UI handlers
  setupUi();
}

/**
 * Basic dark map style to match your UI theme
 */
const mapStyleDark = [
  { elementType: "geometry", stylers: [{ color: "#0b1120" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#e5e7eb" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1f2937" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
];

/**
 * UI wiring: toggles, buttons, forms
 */
function setupUi() {
  const heatmapToggle = document.getElementById("toggle-heatmap");
  const ulezToggle = document.getElementById("toggle-ulez");
  const modeButtons = document.getElementById("mode-buttons");
  const tripForm = document.getElementById("trip-form");

  heatmapToggle.addEventListener("change", (e) => {
    heatmap.setMap(e.target.checked ? map : null);
  });

  ulezToggle.addEventListener("change", (e) => {
    ulezPolygon.setMap(e.target.checked ? map : null);
  });

  modeButtons.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    currentMode = btn.dataset.mode;

    // Update button active state
    [...modeButtons.querySelectorAll("button")].forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");

    updateTripResultText(); // Recalculate if needed
  });

  // Set initial mode button active
  modeButtons.querySelector('[data-mode="normal"]').classList.add("active");

  tripForm.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateTripEmissions();
  });
}

/**
 * Calculate mock emissions for a trip
 */
function calculateTripEmissions() {
  const distanceInput = document.getElementById("distance-input");
  const transportSelect = document.getElementById("transport-select");
  const resultBox = document.getElementById("trip-result");

  const distanceKm = parseFloat(distanceInput.value || "0");
  const mode = transportSelect.value;

  if (distanceKm <= 0) {
    resultBox.innerHTML =
      '<span class="warning">Enter a distance greater than zero.</span>';
    return;
  }

  // Very rough emission factors (kg CO2 per km) – purely illustrative
  const factors = {
    car: 0.18,
    diesel: 0.2,
    bus: 0.1,
    train: 0.05,
    bike: 0,
    walk: 0,
  };

  let base = factors[mode] ?? 0.18;
  let co2 = base * distanceKm;

  // Apply current app mode effect (mock)
  if (currentMode === "low-emission") {
    // Assume user follows a route that cuts emissions by ~30%
    co2 *= 0.7;
  }

  const rounded = co2.toFixed(2);

  const isHigh = co2 > 1.5;

  resultBox.innerHTML = `
    <div><strong>Estimated CO₂:</strong> ${rounded} kg</div>
    <div>Transport: <strong>${modeLabel(mode)}</strong></div>
    <div>Distance: <strong>${distanceKm.toFixed(1)} km</strong></div>
    ${
      currentMode === "low-emission"
        ? "<div>Mode: <strong>Low Emission Route</strong> (assumed smarter routing and mode shift)</div>"
        : "<div>Mode: <strong>Normal Route</strong></div>"
    }
    ${
      isHigh
        ? '<div class="warning" style="margin-top:0.4rem;">Tip: This is a relatively high-emission trip. Consider public transport, cycling, or splitting the journey.</div>'
        : '<div style="margin-top:0.4rem;">Nice. This trip’s emissions are on the lower side.</div>'
    }
  `;
}

/**
 * When travel mode changes but user already calculated something
 */
function updateTripResultText() {
  const resultBox = document.getElementById("trip-result");
  if (!resultBox.textContent || resultBox.textContent.includes("Enter details"))
    return;
  // Recalculate with new mode
  calculateTripEmissions();
}

function modeLabel(mode) {
  switch (mode) {
    case "car":
      return "Car (petrol)";
    case "diesel":
      return "Car (diesel)";
    case "bus":
      return "Bus";
    case "train":
      return "Train";
    case "bike":
      return "Bike";
    case "walk":
      return "Walk";
    default:
      return mode;
  }
}

/**
 * Handle map clicks → approximate local emissions
 */
function handleMapClick(latLng) {
  const infoBox = document.getElementById("area-info");
  const { lat, lng } = latLng.toJSON();

  // Find nearest emissions point (mock proximity check)
  let nearest = null;
  let nearestDist = Infinity;

  for (const p of emissionsPoints) {
    const d = distance2(lat, lng, p.lat, p.lng);
    if (d < nearestDist) {
      nearestDist = d;
      nearest = p;
    }
  }

  let level = "Low";
  let advice =
    "This area is currently estimated to have relatively low emissions. Active transport is ideal here.";
  if (nearest && nearest.weight > 0.7) {
    level = "High";
    advice =
      "This region is estimated to have high emissions. Avoid idling, prefer public transport, or reroute around congested roads.";
  } else if (nearest && nearest.weight > 0.4) {
    level = "Moderate";
    advice =
      "Emissions are moderate. If possible, avoid driving during peak hours and consider walking or public transport.";
  }

  const insideUlez = google.maps.geometry
    ? google.maps.geometry.poly.containsLocation(latLng, ulezPolygon)
    : pointRoughInsideUlez(lat, lng);

  infoBox.innerHTML = `
    <div><strong>Lat:</strong> ${lat.toFixed(5)}, <strong>Lng:</strong> ${lng.toFixed(5)}</div>
    <div><strong>Emissions level:</strong> ${level}</div>
    <div style="margin-top:0.3rem;">${advice}</div>
    <div style="margin-top:0.4rem;">
      <strong>ULEZ status:</strong>
      ${
        insideUlez
          ? '<span class="warning">Inside or near ULEZ. Charges may apply for non-compliant vehicles.</span>'
          : "Outside main ULEZ boundary (mock polygon)."
      }
    </div>
  `;
}

/**
 * Quick squared distance (no sqrt, it's just for comparison)
 */
function distance2(lat1, lng1, lat2, lng2) {
  const dLat = lat1 - lat2;
  const dLng = lng1 - lng2;
  return dLat * dLat + dLng * dLng;
}

/**
 * Fallback rough ULEZ check if geometry library isn’t loaded
 */
function pointRoughInsideUlez(lat, lng) {
  return lat >= 51.47 && lat <= 51.54 && lng >= -0.2 && lng <= -0.02;
}
