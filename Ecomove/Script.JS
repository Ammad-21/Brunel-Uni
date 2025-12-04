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

// Fake prevent submit for login/signup (prototype only)
["login-form", "signup-form"].forEach((formId) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "This is a front-end prototype. In the full EcoMove app, this form would send data to the backend."
    );
  });
});

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

    co2Result.innerHTML = `
      <div class="calculator__summary">
        ${emissionsLine}
        ${compareEmissionsLine}
        ${costLine}
      </div>
      ${savingsBar}
    `;
  });
}

// Speedometer animation
const speedometerEl = document.querySelector(".speedometer__dial");
const speedometerValueEl = document.getElementById("speedometer-value");

if (speedometerEl && speedometerValueEl) {
  const targetPercent = 72; // demo
  let current = 0;

  const step = () => {
    current += 3;
    if (current > targetPercent) current = targetPercent;

    const degrees = Math.round((current / 100) * 280); // 280° sweep
    speedometerEl.style.setProperty("--speedometer-progress", String(degrees));
    speedometerValueEl.textContent = `${current}%`;

    if (current < targetPercent) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

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
}
