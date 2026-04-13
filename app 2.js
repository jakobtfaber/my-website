(function () {
  /* ── Theme ────────────────────────────────────────────────────── */

  const STORAGE_KEY = "jakobtfaber-theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const yearEl = document.querySelector("[data-year]");

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  toggle?.addEventListener("click", function () {
    var next =
      root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ── ADS Publications ─────────────────────────────────────────── */

  var ORCID = "0000-0001-9855-5781";
  var ADS_TOKEN = "1TufMhXLubtAXvfyJel3x5AU7uFNgxWx3OkOhxuE"; // paste your ADS API token here (read-only, free)
  var AUTHOR_SURNAME = "Faber";
  var PUB_CONTAINER = document.getElementById("pub-list");

  function fetchPublications() {
    if (!PUB_CONTAINER) return;

    if (!ADS_TOKEN) {
      PUB_CONTAINER.innerHTML =
        '<p class="pub-list__error">Publications will appear here once an ' +
        '<a class="inline-link" href="https://ui.adsabs.harvard.edu/user/settings/token">ADS API token</a> ' +
        "is configured in <code>app.js</code>. " +
        'Browse publications on <a class="inline-link" href="https://ui.adsabs.harvard.edu/search/q=orcid%3A' +
        ORCID +
        '&sort=date+desc">ADS</a> in the meantime.</p>';
      return;
    }

    var fields = "title,author,year,pub,bibcode,doi,citation_count";
    var query = 'orcid:"' + ORCID + '"';
    var url =
      "https://api.adsabs.harvard.edu/v1/search/query?" +
      "q=" +
      encodeURIComponent(query) +
      "&sort=" +
      encodeURIComponent("date desc") +
      "&fl=" +
      encodeURIComponent(fields) +
      "&rows=100";

    fetch(url, {
      headers: { Authorization: "Bearer " + ADS_TOKEN },
    })
      .then(function (res) {
        if (!res.ok) throw new Error("ADS " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderPublications(data.response.docs);
      })
      .catch(function (err) {
        PUB_CONTAINER.innerHTML =
          '<p class="pub-list__error">Could not load publications (' +
          err.message +
          '). <a class="inline-link" href="https://ui.adsabs.harvard.edu/search/q=orcid%3A' +
          ORCID +
          '&sort=date+desc">View on ADS</a>.</p>';
      });
  }

  function renderPublications(docs) {
    if (!docs || docs.length === 0) {
      PUB_CONTAINER.innerHTML =
        '<p class="pub-list__error">No publications found.</p>';
      return;
    }

    var grouped = {};
    docs.forEach(function (d) {
      var yr = d.year || "Unknown";
      if (!grouped[yr]) grouped[yr] = [];
      grouped[yr].push(d);
    });

    var years = Object.keys(grouped).sort(function (a, b) {
      return b - a;
    });

    var html = "";
    years.forEach(function (yr) {
      html += '<div class="pub-year-group">';
      html += '<h3 class="pub-year-group__heading">' + yr + "</h3>";
      grouped[yr].forEach(function (d) {
        var title = (d.title && d.title[0]) || "Untitled";
        var adsUrl =
          "https://ui.adsabs.harvard.edu/abs/" +
          encodeURIComponent(d.bibcode);
        var authors = formatAuthors(d.author || []);
        var journal = d.pub || "";
        var cites = d.citation_count || 0;
        var doi = d.doi && d.doi[0] ? d.doi[0] : null;

        html += '<div class="pub-item">';
        html +=
          '<a class="pub-item__title" href="' +
          adsUrl +
          '" target="_blank" rel="noopener">' +
          escapeHtml(title) +
          "</a>";
        html += '<div class="pub-item__authors">' + authors + "</div>";
        html += '<div class="pub-item__meta">';
        if (journal) html += "<span>" + escapeHtml(journal) + "</span>";
        if (doi)
          html +=
            '<a class="inline-link" href="https://doi.org/' +
            encodeURIComponent(doi) +
            '" target="_blank" rel="noopener">DOI</a>';
        html +=
          '<a class="inline-link" href="' +
          adsUrl +
          '" target="_blank" rel="noopener">ADS</a>';
        if (cites > 0)
          html +=
            '<span class="pub-item__badge">' + cites + " cit.</span>";
        html += "</div></div>";
      });
      html += "</div>";
    });

    PUB_CONTAINER.innerHTML = html;
  }

  function formatAuthors(authors) {
    var MAX = 8;
    var visible = authors.length > MAX ? authors.slice(0, MAX) : authors;
    var parts = visible.map(function (a) {
      if (a.toLowerCase().indexOf(AUTHOR_SURNAME.toLowerCase()) !== -1) {
        return "<strong>" + escapeHtml(a) + "</strong>";
      }
      return escapeHtml(a);
    });
    var result = parts.join("; ");
    if (authors.length > MAX)
      result += " <em>et al.</em> (" + authors.length + " authors)";
    return result;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  fetchPublications();
})();
