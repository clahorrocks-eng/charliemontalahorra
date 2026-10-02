const LIMIT = 5; // sites shown before "Show all"

const chips = document.querySelectorAll(".chip");
const items = [...document.querySelectorAll("#sites li")];
const toggle = document.getElementById("toggle");
let filter = "all";
let expanded = false;

function render() {
  const matches = items.filter(
    (li) => filter === "all" || li.dataset.tags.split(" ").includes(filter)
  );
  items.forEach((li) => (li.hidden = true));
  matches.forEach((li, i) => (li.hidden = !expanded && i >= LIMIT));

  // Only show the button when there is something to hide
  toggle.hidden = matches.length <= LIMIT;
  toggle.setAttribute("aria-expanded", expanded);
  toggle.textContent = expanded
    ? "Show fewer sites"
    : `Show all ${matches.length} sites`;
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filter = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle("on", c === chip));
    render();
  });
});

toggle.addEventListener("click", () => {
  expanded = !expanded;
  render();
});

render();

// Keep the footer year current
document.getElementById("yr").textContent = new Date().getFullYear();
