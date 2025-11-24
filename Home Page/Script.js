// Simple utility: smooth scroll for same-page anchors
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

  // Close mobile menu on click of a link
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

// Fake prevent submit for login/signup (no backend)
["login-form", "signup-form"].forEach((id) => {
  const form = document.getElementById(id);
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

// CO₂ calculator logic
const co2Form = document.getElementById("co2-form");
const co2Result = document.getElementById("co2-result");

if (co2Form && co2Result) {
  co2Form.addEventListener("submit", (e) => {
    e.preventDefault();

    const distance = parseFloat(
      /** @type {HTMLInputElement} */ (document.getElementById("distance"))
        .value
    );
    const mode = /** @type {HTMLSelectElement} */ (
      document.getElementById("mode")
    ).value;

    if (Number.isNaN(distance) || distance <= 0) {
      co2Result.innerHTML =
        '<p style="color:#fca5a5;margin:0;">Please enter a valid distance greater than zero.</p>';
      return;
    }

    // Very simple emission factors in kg CO₂ per km (approximate)
    const factors = {
      car: 0.171, // small petrol car
      bus: 0.104,
      train: 0.041,
      cycling: 0.0,
      walking: 0.0
    };

    const carBaseline = distance * factors.car;
    const chosenFactor = factors[mode] ?? factors.car;
    const tripEmissions = distance * chosenFactor;
    const saved = Math.max(carBaseline - tripEmissions, 0);

    const formatKg = (val) => (Math.round(val * 100) / 100).toFixed(2);

    const mainLine = `<strong>${formatKg(
      tripEmissions
    )} kg CO₂</strong> for this ${distance} km trip by <strong>${mode}</strong>.`;

    const compareLine =
      saved > 0.001
        ? `<br /><span style="color:#bbf7d0;">You avoid about <strong>${formatKg(
            saved
          )} kg CO₂</strong> compared to driving a car.</span>`
        : "<br /><span style='color:#e5e7eb;'>This is similar to driving by car in terms of emissions.</span>";

    co2Result.innerHTML = `<p style="margin:0;">${mainLine}${compareLine}</p>`;
  });
}

// Speedometer placeholder animation
const speedometerEl = document.querySelector(".speedometer__dial");
const speedometerValueEl = document.getElementById("speedometer-value");

if (speedometerEl && speedometerValueEl) {
  const targetPercent = 72; // demo value
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

  // Animate on load
  requestAnimationFrame(step);
}
