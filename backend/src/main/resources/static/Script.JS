const normalizeBaseUrl = (baseUrl) => String(baseUrl || "").replace(/\/+$/, "");
const API_BASE = normalizeBaseUrl(
  localStorage.getItem("ECOMOVE_API_BASE") || ""
);
const SESSION_KEY = "ecomove.session";

const apiUrl = (path) => `${API_BASE}${path}`;

const formatKgOrTons = (kg) => {
  const value = Number(kg ?? 0);
  if (value >= 1000) return `${(value / 1000).toFixed(1)} t`;
  return `${value.toFixed(1)} kg`;
};

const getSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// --- Session interval tracking ---

const sendHeartbeat = () => {
  const session = getSession();
  if (!session?.sessionId) return;
  apiFetch(`/api/sessions/${session.sessionId}/heartbeat`, { method: "POST" }).catch(() => {});
};

const sendLogout = () => {
  const session = getSession();
  if (!session?.sessionId) return;
  // Use sendBeacon so it fires even when tab is closing
  navigator.sendBeacon(
    apiUrl(`/api/sessions/${session.sessionId}/logout`)
  );
};

// Heartbeat every 2 minutes while page is open
let heartbeatInterval = null;
const startHeartbeat = () => {
  stopHeartbeat();
  sendHeartbeat(); // immediate first ping
  heartbeatInterval = setInterval(sendHeartbeat, 2 * 60 * 1000);
};
const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Fire logout when tab/browser closes
window.addEventListener("beforeunload", sendLogout);

const apiFetch = async (path, { method = "GET", body } = {}) => {
  const res = await fetch(apiUrl(path), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.ok) {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  const errText = await res.text().catch(() => "");
  let detail = errText;
  try {
    const parsed = JSON.parse(errText);
    detail = parsed?.message || parsed?.error || parsed?.path || errText;
  } catch {
    // ignore
  }
  throw new Error(`${res.status}${detail ? `: ${detail}` : ""}`);
};

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const showFormMsg = (id, message, isError) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `form-msg form-msg--${isError ? "error" : "success"}`;
  el.style.display = "block";
  // Auto-hide success messages after 4 seconds
  if (!isError) setTimeout(() => { el.style.display = "none"; }, 4000);
};

const shorten = (s, max = 60) => {
  const str = String(s ?? "");
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
};

const setApiStatus = ({ apiOk, dbOk, detail } = {}) => {
  let msg = "Checking…";
  let footerMsg = "API: Checking…";
  let color = "#fbbf24";

  if (apiOk === false) {
    msg = "Not connected";
    footerMsg = `API: Not connected${detail ? ` (${shorten(detail)})` : ""}`;
    color = "#fca5a5";
  } else if (apiOk === true && dbOk === false) {
    msg = "API ok, DB down";
    footerMsg = `API: Connected · DB: Down${detail ? ` (${shorten(detail)})` : ""}`;
    color = "#fbbf24";
  } else if (apiOk === true && dbOk === true) {
    msg = "Connected";
    footerMsg = "API: Connected · DB: Connected";
    color = "#34d399";
  } else if (apiOk === true) {
    msg = "Connected";
    footerMsg = "API: Connected";
    color = "#34d399";
  }

  const footer = document.getElementById("api-status");
  const auth = document.getElementById("api-status-auth");

  if (footer) {
    footer.textContent = footerMsg;
    footer.style.color = color;
  }

  if (auth) {
    auth.textContent = msg;
    auth.style.color = color;
  }
};

let transportTypeIdByNameLower = null;

const ensureTransportTypes = async () => {
  if (transportTypeIdByNameLower) return transportTypeIdByNameLower;
  const types = await apiFetch("/api/transport-types");
  transportTypeIdByNameLower = new Map(
    (types ?? []).map((t) => [String(t.name ?? "").toLowerCase(), t.id])
  );
  return transportTypeIdByNameLower;
};

const modeToTransportTypeNameLower = (mode) => {
  switch (String(mode || "").toLowerCase()) {
    case "car":
      return "car";
    case "bus":
      return "bus";
    case "train":
      return "train";
    case "cycling":
    case "bike":
      return "bike";
    case "walking":
      return "walking";
    default:
      return "car";
  }
};

const refreshSummaryUI = async () => {
  try {
    setApiStatus({ apiOk: undefined, dbOk: undefined });
    const summary = await apiFetch("/api/stats/summary");
    setApiStatus({ apiOk: true });
    setText("meta-trips", String(summary.totalTrips ?? 0));
    setText("meta-co2", formatKgOrTons(summary.totalCO2Saved ?? 0));
    setText("stat-active-users", String(summary.activeUsers ?? 0));
    setText("stat-low-carbon-trips", String(summary.lowCarbonTripsToday ?? 0));

    try {
      await apiFetch("/api/health/db");
      setApiStatus({ apiOk: true, dbOk: true });
    } catch (e) {
      // If the backend is up but doesn't have this endpoint yet, don't treat as "down".
      const is404 = String(e.message || "").startsWith("404");
      if (!is404) {
        setApiStatus({ apiOk: true, dbOk: false, detail: e.message });
      }
    }

    const leaderboardEl = document.getElementById("leaderboard-snapshot");
    if (leaderboardEl) {
      const rows = (summary.leaderboardTop ?? [])
        .map(
          (row) => `
          <div class="stat-card__row">
            <span>${row.name ?? "Unknown"}</span>
            <span>${Number(row.totalCO2Saved ?? 0).toFixed(1)} kg</span>
          </div>
        `
        )
        .join("");
      leaderboardEl.innerHTML =
        rows ||
        `<div class="stat-card__row"><span>No data yet</span><span>—</span></div>`;
    }
  } catch (e) {
    setApiStatus({ apiOk: false, dbOk: false, detail: e.message || "start backend" });
    console.warn("EcoMove API summary unavailable:", e);
  }
};

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const el = document.querySelector(targetId);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Navbar mobile toggle
const navToggle = document.querySelector(".navbar__toggle");
const mobileMenu = document.querySelector(".navbar__mobile");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("navbar__mobile--open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close mobile menu on click of a link/button
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.matches("a, button")) {
      mobileMenu.classList.remove("navbar__mobile--open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Auth buttons -> scroll to auth section + highlight card
const authButtons = document.querySelectorAll("[data-open-auth]");
const authSection = document.getElementById("auth");

authButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.getAttribute("data-open-auth");
    if (authSection) {
      authSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const loginCard = document.getElementById("login-form");
    const signupCard = document.getElementById("signup-form");

    if (mode === "login" && loginCard && signupCard) {
      loginCard.classList.add("auth-card--highlight");
      signupCard.classList.remove("auth-card--highlight");
    } else if (mode === "signup" && loginCard && signupCard) {
      signupCard.classList.add("auth-card--highlight");
      loginCard.classList.remove("auth-card--highlight");
    }
  });
});

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name")?.value?.trim();
    const email = document.getElementById("signup-email")?.value?.trim();
    const password = document.getElementById("signup-password")?.value;

    try {
      await apiFetch("/api/users", {
        method: "POST",
        body: { name, email, password },
      });
      // Auto-login after signup to get a sessionId
      const session = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setSession({ userId: session.userId, name: session.name, email: session.email, sessionId: session.sessionId });
      startHeartbeat();
      updateNavbarAuth();
      await refreshSummaryUI();
      await loadUserDashboard();
      updateSpeedometer();
      showFormMsg("signup-msg", "Account created. You’re now logged in!", false);
    } catch (err) {
      showFormMsg("signup-msg", `Sign up failed: ${err.message}`, true);
    }
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email")?.value?.trim();
    const password = document.getElementById("login-password")?.value;

    try {
      const session = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setSession({ userId: session.userId, name: session.name, email: session.email, sessionId: session.sessionId });
      startHeartbeat();
      updateNavbarAuth();
      await refreshSummaryUI();
      await loadUserDashboard();
      updateSpeedometer();
      showFormMsg("login-msg", `Welcome back, ${session.name}!`, false);
    } catch (err) {
      showFormMsg("login-msg", `Login failed: ${err.message}`, true);
    }
  });
}

// Footer year
const yearSpan = document.getElementById("footer-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// CO₂ + cost calculator logic with savings bar
const co2Form = document.getElementById("co2-form");
const co2Result = document.getElementById("co2-result");

if (co2Form && co2Result) {
  co2Form.addEventListener("submit", (e) => {
    e.preventDefault();

    const distanceInput = document.getElementById("distance");
    const modeSelect = document.getElementById("mode");
    if (!distanceInput || !modeSelect) return;

    const distance = parseFloat(distanceInput.value);
    const tripStartTime = new Date().toISOString().slice(0, 19); // capture when user calculated
    const mode = modeSelect.value;

    if (!distance || distance <= 0 || !mode) {
      co2Result.innerHTML =
        '<p class="calculator__placeholder">Please enter a valid distance and choose a transport mode.</p>';
      return;
    }

    // EMISSIONS (kg CO₂ per km) – demo factors
    const EMISSION_FACTORS = {
      car: 0.192,   // petrol car approx
      bus: 0.082,
      train: 0.041,
      cycling: 0,
      walking: 0,
    };

    // COST (£ per km) – rough demo assumptions
    // Car: ~6.5 L/100 km @ ~£1.55/L → ~£0.10/km
    // Bus: ~£0.20/km
    // Train: ~£0.25/km
    // Cycling / Walking: £0.00/km (ignoring minor costs)
    const COST_FACTORS = {
      car: 0.10,
      bus: 0.20,
      train: 0.25,
      cycling: 0.0,
      walking: 0.0,
    };

    const carEmissionFactor = EMISSION_FACTORS.car;
    const chosenEmissionFactor = EMISSION_FACTORS[mode] ?? carEmissionFactor;

    const carCostPerKm = COST_FACTORS.car;
    const chosenCostPerKm = COST_FACTORS[mode] ?? carCostPerKm;

    // Emissions calculations
    const carEmissions = distance * carEmissionFactor;
    const tripEmissions = distance * chosenEmissionFactor;
    const savedEmissions = Math.max(carEmissions - tripEmissions, 0);

    // Cost calculations
    const carCost = distance * carCostPerKm;
    const tripCost = distance * chosenCostPerKm;
    const moneySaved = Math.max(carCost - tripCost, 0);

    const formatKg = (val) => (Math.round(val * 100) / 100).toFixed(2);
    const formatMoney = (val) =>
      "£" + (Math.round(val * 100) / 100).toFixed(2);

    const emissionsLine = `
      <p style="margin:0 0 0.35rem 0;">
        This ${distance} km trip by <strong>${mode}</strong>
        emits about <strong>${formatKg(tripEmissions)} kg CO₂</strong>.
      </p>
    `;

    const compareEmissionsLine =
      savedEmissions > 0.001
        ? `
        <p style="margin:0 0 0.35rem 0;">
          Driving a typical car instead would emit around
          <strong>${formatKg(carEmissions)} kg CO₂</strong>, so you avoid
          roughly <strong>${formatKg(savedEmissions)} kg CO₂</strong>.
        </p>
      `
        : `
        <p style="margin:0 0 0.35rem 0;">
          This is similar to the emissions of a typical car for the same trip.
        </p>
      `;

    const costLine = `
      <p style="margin:0;">
        Estimated money cost:
        <br />
        • <strong>${formatMoney(tripCost)}</strong> for this trip by <strong>${mode}</strong><br />
        • <strong>${formatMoney(carCost)}</strong> if you drove a typical car
      </p>
    `;

    const savingsPercent =
      carCost > 0 ? Math.min(Math.round((moneySaved / carCost) * 100), 100) : 0;

    const savingsBar =
      moneySaved > 0.001
        ? `
      <div class="savings-bar">
        <div class="savings-bar__label-row">
          <span>Money saved vs car</span>
          <span><strong>${formatMoney(moneySaved)}</strong> (${savingsPercent}% of car cost)</span>
        </div>
        <div class="savings-bar__track">
          <div class="savings-bar__fill" style="width:${savingsPercent}%;"></div>
        </div>
      </div>
    `
        : `
      <div class="savings-bar">
        <div class="savings-bar__label-row">
          <span>Money saved vs car</span>
          <span><strong>${formatMoney(0)}</strong></span>
        </div>
        <div class="savings-bar__track">
          <div class="savings-bar__fill" style="width:0%;"></div>
        </div>
      </div>
    `;

    const session = getSession();
    const canSave = Boolean(session?.userId);

    const saveControls = canSave
      ? `
        <div style="margin-top:0.75rem;">
          <button type="button" class="btn btn--ghost btn--full" id="save-trip-btn">
            Save this trip to my account
          </button>
          <div id="trip-save-msg" class="form-msg" style="display:none;"></div>
        </div>
      `
      : `
        <p style="margin-top:0.75rem; color:#9ca3af;">
          Log in or sign up to save trips to the database.
        </p>
      `;

    co2Result.innerHTML = `
      <div class="calculator__summary">
        ${emissionsLine}
        ${compareEmissionsLine}
        ${costLine}
      </div>
      ${savingsBar}
      ${saveControls}
    `;

    if (canSave) {
      document.getElementById("save-trip-btn")?.addEventListener("click", async () => {
        try {
          const nameLower = modeToTransportTypeNameLower(mode);
          const types = await ensureTransportTypes();
          const transportTypeId = types.get(nameLower);
          if (!transportTypeId) {
            throw new Error(`Transport type not found on backend: ${nameLower}`);
          }

          await apiFetch("/api/trips", {
            method: "POST",
            body: {
              userId: session.userId,
              transportTypeId,
              distanceKm: distance,
              startTime: tripStartTime,
              endTime: new Date().toISOString().slice(0, 19),
            },
          });

          await refreshSummaryUI();
          await loadUserDashboard();
          updateSpeedometer();
          showFormMsg("trip-save-msg", "Trip saved to your account!", false);
        } catch (err) {
          showFormMsg("trip-save-msg", `Could not save trip: ${err.message}`, true);
        }
      });
    }
  });
}

// Speedometer animation
const speedometerEl = document.querySelector(".speedometer__dial");
const speedometerValueEl = document.getElementById("speedometer-value");

const DAILY_GOAL_KG = 1.5; // 1.5 kg CO₂ saved = 100%

const animateSpeedometer = (targetPercent) => {
  if (!speedometerEl || !speedometerValueEl) return;
  const capped = Math.min(targetPercent, 100);
  let current = 0;

  const step = () => {
    current += 3;
    if (current > capped) current = capped;

    const degrees = Math.round((current / 100) * 280); // 280° sweep
    speedometerEl.style.setProperty("--speedometer-progress", String(degrees));
    speedometerValueEl.textContent = `${current}%`;

    if (current < capped) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const updateSpeedometer = async () => {
  const session = getSession();
  const communityEl = document.getElementById("speedometer-community");
  const userEl = document.getElementById("speedometer-user");

  try {
    // Always update community total from summary
    const summary = await apiFetch("/api/stats/summary");
    if (communityEl) {
      communityEl.textContent = `${formatKgOrTons(summary.totalCO2Saved)} CO₂ saved`;
    }
  } catch {
    // ignore if summary fails
  }

  if (!session?.userId) {
    animateSpeedometer(0);
    if (userEl) userEl.textContent = "Log in to see your savings";
    return;
  }

  try {
    const stats = await apiFetch(`/api/users/${session.userId}/stats`);
    const saved = stats.totalCO2Saved ?? 0;
    const percent = Math.round((saved / DAILY_GOAL_KG) * 100);

    if (userEl) userEl.textContent = `${formatKgOrTons(saved)} CO₂ saved`;
    animateSpeedometer(percent);
  } catch {
    animateSpeedometer(0);
  }
};

// Run on page load
updateSpeedometer();

// Google Maps initialisation for EcoMap
function initEcoMap() {
  const mapContainer = document.getElementById("ecoMap");
  if (!mapContainer || !window.google || !google.maps) return;

  const center = { lat: 51.5321, lng: -0.48 }; // Brunel University approx

  const map = new google.maps.Map(mapContainer, {
    center,
    zoom: 13,
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#0b0f1e" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca3af" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#121628" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#1f2937" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b7280" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#020617" }],
      },
    ],
  });

  new google.maps.Marker({
    position: center,
    map,
    title: "Brunel University London",
  });

  // --- Directions service + renderer ---
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: false,
    polylineOptions: { strokeColor: "#4ade80", strokeWeight: 5, strokeOpacity: 0.85 },
  });

  // --- Places Autocomplete on the two address inputs ---
  const originInput = document.getElementById("route-origin");
  const destinationInput = document.getElementById("route-destination");

  if (originInput && destinationInput) {
    new google.maps.places.Autocomplete(originInput, { types: ["geocode"] });
    new google.maps.places.Autocomplete(destinationInput, { types: ["geocode"] });
  }

  // --- Get Route button ---
  const getRouteBtn = document.getElementById("get-route-btn");
  const routeStatus = document.getElementById("route-status");
  const distanceInput = document.getElementById("distance");

  if (getRouteBtn) {
    getRouteBtn.addEventListener("click", () => {
      const origin = originInput?.value?.trim();
      const destination = destinationInput?.value?.trim();

      if (!origin || !destination) {
        showRouteStatus("Please enter both a start and end location.", true);
        return;
      }

      getRouteBtn.textContent = "Getting route…";
      getRouteBtn.disabled = true;

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          getRouteBtn.textContent = "Get Route & Distance";
          getRouteBtn.disabled = false;

          if (status === "OK") {
            directionsRenderer.setDirections(result);

            // Extract distance in km from first leg
            const leg = result.routes[0].legs[0];
            const distanceKm = (leg.distance.value / 1000).toFixed(1);

            if (distanceInput) {
              distanceInput.value = distanceKm;
            }

            showRouteStatus(
              `Route found: ${leg.distance.text} · ${leg.duration.text} · Distance set to ${distanceKm} km`,
              false
            );
          } else {
            showRouteStatus("Could not find a route. Try different locations.", true);
          }
        }
      );
    });
  }

  const showRouteStatus = (message, isError) => {
    if (!routeStatus) return;
    routeStatus.textContent = message;
    routeStatus.style.display = "block";
    routeStatus.classList.toggle("error", isError);
  };
}

// --- Auth state: show/hide navbar buttons vs user greeting ---

const updateNavbarAuth = () => {
  const session = getSession();
  const loggedIn = Boolean(session?.userId);

  const authButtons = document.getElementById("navbar-auth-buttons");
  const userBlock = document.getElementById("navbar-user");
  const greeting = document.getElementById("navbar-greeting");
  const mobileAuth = document.getElementById("mobile-auth-buttons");
  const mobileUser = document.getElementById("mobile-user");
  const mobileGreeting = document.getElementById("mobile-greeting");
  const mobileDashLink = document.getElementById("mobile-dashboard-link");
  const dashboardSection = document.getElementById("my-dashboard");

  if (loggedIn) {
    const name = session.name?.split(" ")[0] || "there";
    if (authButtons) authButtons.style.display = "none";
    if (userBlock) userBlock.style.display = "flex";
    if (greeting) greeting.textContent = `Hi, ${name}`;
    if (mobileAuth) mobileAuth.style.display = "none";
    if (mobileUser) mobileUser.style.display = "block";
    if (mobileGreeting) mobileGreeting.textContent = `Logged in as ${session.name}`;
    if (mobileDashLink) mobileDashLink.style.display = "block";
    if (dashboardSection) dashboardSection.style.display = "block";
  } else {
    if (authButtons) authButtons.style.display = "flex";
    if (userBlock) userBlock.style.display = "none";
    if (mobileAuth) mobileAuth.style.display = "block";
    if (mobileUser) mobileUser.style.display = "none";
    if (mobileDashLink) mobileDashLink.style.display = "none";
    if (dashboardSection) dashboardSection.style.display = "none";
  }
};

// --- Logout handler ---

const handleLogout = () => {
  sendLogout();
  stopHeartbeat();
  clearSession();
  updateNavbarAuth();
  const tripHistoryBody = document.getElementById("trip-history-body");
  if (tripHistoryBody) {
    tripHistoryBody.innerHTML = '<p style="color:#9ca3af;">No trips yet.</p>';
  }
};

document.getElementById("navbar-logout-btn")?.addEventListener("click", handleLogout);
document.getElementById("mobile-logout-btn")?.addEventListener("click", handleLogout);

// --- Per-user dashboard ---

const formatDate = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const loadUserDashboard = async () => {
  const session = getSession();
  if (!session?.userId) return;

  const heading = document.getElementById("dashboard-heading");
  if (heading) heading.textContent = `${session.name}'s Dashboard`;

  try {
    const [stats, trips] = await Promise.all([
      apiFetch(`/api/users/${session.userId}/stats`),
      apiFetch(`/api/trips/user/${session.userId}`),
    ]);

    setText("my-total-trips", stats.totalTrips ?? 0);
    setText("my-total-distance", Number(stats.totalDistanceKm ?? 0).toFixed(1));
    setText("my-co2-saved", formatKgOrTons(stats.totalCO2Saved ?? 0));
    setText("my-co2-emitted", formatKgOrTons(stats.totalCO2Emitted ?? 0));

    const tbody = document.getElementById("trip-history-body");
    if (!tbody) return;

    if (!trips || trips.length === 0) {
      tbody.innerHTML = '<p style="padding:1.5rem; color:#9ca3af;">No trips yet. Use the calculator above to log your first trip.</p>';
      return;
    }

    tbody.innerHTML = `
      <table class="trip-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Mode</th>
            <th>Distance</th>
            <th>Start</th>
            <th>End</th>
            <th>CO₂ Saved</th>
            <th>CO₂ Emitted</th>
          </tr>
        </thead>
        <tbody>
          ${trips.map((t) => `
            <tr>
              <td>${formatDate(t.tripDate)}</td>
              <td><span class="trip-badge">${t.transportTypeName}</span></td>
              <td>${Number(t.distanceKm).toFixed(1)} km</td>
              <td>${formatTime(t.startTime)}</td>
              <td>${formatTime(t.endTime)}</td>
              <td class="trip-co2-saved">${formatKgOrTons(t.co2Saved)}</td>
              <td class="trip-co2-emitted">${formatKgOrTons(t.co2Emitted)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (e) {
    console.warn("Could not load dashboard:", e);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  refreshSummaryUI().catch(() => {});
  updateNavbarAuth();
  if (getSession()?.sessionId) {
    startHeartbeat();
    loadUserDashboard().catch(() => {});
  }
});
