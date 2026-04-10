(function () {
  const storageKey = "jakobtfaber-theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const yearEl = document.querySelector("[data-year]");

  function getPreferredTheme() {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);
  }

  applyTheme(getPreferredTheme());

  toggle?.addEventListener("click", () => {
    const next =
      root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
