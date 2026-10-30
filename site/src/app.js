// Gallery: search, filter and sort over the catalog embedded in index.html.
// State lives in the URL (?q=&category=&subcategory=&platform=&author=&sort=) so views are shareable.
// Detail pages: tab switching, with the active tab kept in the hash.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (iso) => (iso ? new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "");
  const slug = (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // ---------- gallery ----------

  const catalogEl = $("catalog");
  if (catalogEl) {
    const data = JSON.parse(catalogEl.textContent);
    const els = { q: $("q"), category: $("category"), subcategory: $("subcategory"), platform: $("platform"), author: $("author"), sort: $("sort") };
    const grid = $("grid");
    const empty = $("empty");
    const count = $("count");
    const clearBtn = $("clear");
    const word = (n) => `skill${n === 1 ? "" : "s"}`;

    function readState() {
      const p = new URLSearchParams(location.search);
      for (const k of Object.keys(els)) {
        const v = p.get(k);
        if (v !== null) els[k].value = v;
      }
      if (!els.sort.value) els.sort.value = "updated";
    }

    function writeState() {
      const p = new URLSearchParams();
      for (const k of Object.keys(els)) {
        const v = els[k].value.trim();
        if (v && !(k === "sort" && v === "updated")) p.set(k, v);
      }
      const qs = p.toString();
      history.replaceState(null, "", qs ? `?${qs}#gallery` : location.pathname + (location.hash || ""));
    }

    function matches(s) {
      if (els.category.value && s.category !== els.category.value) return false;
      if (els.subcategory.value && s.subcategory !== els.subcategory.value) return false;
      if (els.platform.value && !s.platforms.includes(els.platform.value)) return false;
      if (els.author.value && s.author !== els.author.value) return false;
      const terms = els.q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return true;
      const hay = [s.name, s.slug, s.description, s.agentDescription, s.author, s.category, s.subcategory, ...s.tags, ...s.platforms].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    }

    function sorted(list) {
      const by = els.sort.value;
      const copy = list.slice();
      if (by === "title") copy.sort((a, b) => a.name.localeCompare(b.name));
      else if (by === "newest") copy.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "") || a.name.localeCompare(b.name));
      else copy.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "") || a.name.localeCompare(b.name));
      return copy;
    }

    function avatar(s) {
      return s.avatar
        ? `<img class="avatar" src="${esc(s.avatar)}" alt="" width="24" height="24" loading="lazy">`
        : `<span class="avatar avatar-text" aria-hidden="true">${esc((s.author || "?")[0])}</span>`;
    }

    function card(s) {
      return `<article class="card" style="--h:${Number(s.hue) || 220}">
  <a class="card-art" href="${esc(s.url)}" tabindex="-1" aria-hidden="true"><img src="${s.image}" alt="" loading="lazy" width="640" height="360"></a>
  <div class="card-body">
    <p class="card-kicker kicker"><span class="kicker-cat">${esc(s.category)}</span>${s.subcategory ? `<span class="kicker-sub">${esc(s.subcategory)}</span>` : ""}</p>
    <h3><a href="${esc(s.url)}">${esc(s.name)}</a></h3>
    <p class="card-desc">${esc(s.description)}</p>
    <ul class="chips">${s.platforms.map((p) => `<li class="chip chip-platform" data-value="${slug(p)}">${esc(p)}</li>`).join("")}</ul>
    <footer class="card-foot">
      <span class="author">${avatar(s)}<span>${esc(s.author)}</span></span>
      <time datetime="${esc(s.updatedAt)}" title="Last updated">${esc(fmt(s.updatedAt))}</time>
    </footer>
  </div>
</article>`;
    }

    function isFiltered() {
      return Object.keys(els).some((k) => (k === "sort" ? els.sort.value !== "updated" : els[k].value.trim() !== ""));
    }

    function render() {
      const list = sorted(data.filter(matches));
      grid.innerHTML = list.map(card).join("");
      empty.hidden = list.length > 0;
      count.textContent = list.length === data.length ? `Showing ${data.length} ${word(data.length)}` : `Showing ${list.length} of ${data.length} ${word(data.length)}`;
      clearBtn.hidden = !isFiltered();
      writeState();
    }

    function clear() {
      for (const k of Object.keys(els)) els[k].value = k === "sort" ? "updated" : "";
      render();
      els.q.focus();
    }

    let t;
    els.q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(render, 120); });
    for (const k of ["category", "subcategory", "platform", "author", "sort"]) els[k].addEventListener("change", render);
    clearBtn.addEventListener("click", clear);
    document.querySelectorAll("[data-clear]").forEach((b) => b.addEventListener("click", clear));

    readState();
    render();
  }

  // ---------- detail tabs ----------

  const tablist = document.querySelector(".tabs[role=tablist]");
  if (tablist) {
    const tabs = [...tablist.querySelectorAll("[role=tab]")];
    const panels = tabs.map((t) => $(t.getAttribute("aria-controls")));

    function show(id, push) {
      tabs.forEach((t, i) => {
        const on = t.getAttribute("aria-controls") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (push) history.replaceState(null, "", `#${id}`);
    }

    tabs.forEach((t) => t.addEventListener("click", () => show(t.getAttribute("aria-controls"), true)));
    tablist.addEventListener("keydown", (e) => {
      const i = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
      let n = i;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabs.length - 1;
      else return;
      e.preventDefault();
      tabs[n].focus();
      show(tabs[n].getAttribute("aria-controls"), true);
    });

    const initial = tabs.find((t) => `#${t.getAttribute("aria-controls")}` === location.hash);
    show(initial ? initial.getAttribute("aria-controls") : tabs[0].getAttribute("aria-controls"), false);
  }
})();
