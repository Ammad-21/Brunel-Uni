// Simple data structures to describe the layout
const sections = [
  {
    id: "section-dashboard",
    title: "Overview",
    tag: "Today",
    description:
      "Quick glance at your current academic status and upcoming university activity.",
    items: [
      { label: "Programme", meta: "BSc Computer Science" },
      { label: "Year", meta: "Year 1" },
      { label: "Credits in progress", meta: "60 / 120" },
    ],
  },
  {
    id: "section-modules",
    title: "Modules",
    tag: "Current term",
    description:
      "Modules you are currently enrolled in. Later we can fetch this from an API instead of hard-coding it.",
    items: [
      { label: "NC1605 – Software Design", meta: "Mon 10:00–12:00" },
      { label: "Networking Fundamentals", meta: "Tue 14:00–16:00" },
      { label: "Programming Fundamentals", meta: "Thu 09:00–11:00" },
    ],
  },
  {
    id: "section-timetable",
    title: "Timetable",
    tag: "This week",
    description:
      "High-level timetable view. We can later change this into a calendar-style React component with animations.",
    items: [
      { label: "Monday", meta: "Software Design – 10:00" },
      { label: "Tuesday", meta: "Networking – 14:00" },
      { label: "Thursday", meta: "Programming – 09:00" },
    ],
  },
];

function createSectionCard(section) {
  const card = document.createElement("section");
  card.className = "section-card";
  card.id = section.id;

  const header = document.createElement("div");
  header.className = "section-card-header";

  const title = document.createElement("div");
  title.className = "section-card-title";
  title.textContent = section.title;

  const tag = document.createElement("span");
  tag.className = "section-card-tag";
  tag.textContent = section.tag;

  header.appendChild(title);
  header.appendChild(tag);

  const description = document.createElement("p");
  description.className = "section-card-description";
  description.textContent = section.description;

  const list = document.createElement("ul");
  list.className = "item-list";

  section.items.forEach((item) => {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.className = "item-label";
    label.textContent = item.label;

    const meta = document.createElement("span");
    meta.className = "item-meta";
    meta.textContent = item.meta;

    li.appendChild(label);
    li.appendChild(meta);
    list.appendChild(li);
  });

  card.appendChild(header);
  card.appendChild(description);
  card.appendChild(list);

  return card;
}

function renderDashboardLayout() {
  const root = document.getElementById("app-root");
  if (!root) {
    console.error("No #app-root element found in HTML");
    return;
  }

  // Clear previous layout if any
  root.innerHTML = "";

  sections.forEach((section) => {
    const card = createSectionCard(section);
    root.appendChild(card);
  });
}

// Initial render
renderDashboardLayout();
