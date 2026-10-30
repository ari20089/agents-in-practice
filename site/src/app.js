// Gallery: search, facet filters and sort over the catalog embedded in index.html.
// State lives in the URL (?q=&category=&subcategory=&platform=&author=&sort=) so views are shareable.
// Detail pages: tab switching, with the active tab kept in the hash.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (iso) => (iso ? new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "");

  // ---------- gallery ----------

  const catalogEl = $("catalog");
  if (catalogEl) {
    const data = JSON.parse(catalogEl.textContent);
    const FACETS = ["category", "subcategory", "platform", "author"];
    const LABELS = { category: "Category", subcategory: "Sub-category", platform: "Platform", author: "Author" };
    const form = $("filters");
    const q = $("q");
    const sort = $("sort");
    const grid = $("grid");
    const empty = $("empty");
    const count = $("count");
    const active = $("active");

    const boxes = (name) => [...form.querySelectorAll(`input[name="${name}"]`)];
    const selected = (name) => boxes(name).filter((b) => b.checked).map((b) => b.value);

    function readState() {
      const p = new URLSearchParams(location.search);
      q.value = p.get("q") ?? "";
      sort.value = p.get("sort") ?? "updated";
      if (!sort.value) sort.value = "updated";
      for (const f of FACETS) {
        const want = new Set((p.get(f) ?? "").split(",").filter(Boolean));
        for (const b of boxes(f)) b.checked = want.has(b.value);
      }
    }

    function writeState() {
      const p = new URLSearchParams();
      if (q.value.trim()) p.set("q", q.value.trim());
      for (const f of FACETS) {
        const v = selected(f);
        if (v.length) p.set(f, v.join(","));
      }
      if (sort.value && sort.value !== "updated") p.set("sort", sort.value);
      const qs = p.toString();
      history.replaceState(null, "", qs ? `?${qs}#gallery` : location.pathname + (location.hash || ""));
    }

    function matches(s) {
      const sel = {
        category: selected("category"),
        subcategory: selected("subcategory"),
        platform: selected("platform"),
        author: selected("author"),
      };
      if (sel.category.length && !sel.category.includes(s.category)) return false;
      if (sel.subcategory.length && !sel.subcategory.includes(s.subcategory)) return false;
      if (sel.platform.length && !s.platforms.some((p) => sel.platform.includes(p))) return false;
      if (sel.author.length && !sel.author.includes(s.author)) return false;
      const terms = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return true;
      const hay = [s.name, s.slug, s.description, s.agentDescription, s.author, s.category, s.subcategory, ...s.tags, ...s.platforms].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    }

    function sorted(list) {
      const by = sort.value;
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
      const slug = (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

    function renderActive() {
      const pills = [];
      if (q.value.trim()) pills.push({ f: "q", v: q.value.trim(), label: `“${q.value.trim()}”` });
      for (const f of FACETS) for (const v of selected(f)) pills.push({ f, v, label: `${LABELS[f]}: ${v}` });
      active.innerHTML = pills
        .map((p) => `<li><button type="button" class="pill" data-f="${esc(p.f)}" data-v="${esc(p.v)}">${esc(p.label)} <span aria-hidden="true">×</span><span class="visually-hidden">remove</span></button></li>`)
        .join("");
      active.hidden = pills.length === 0;
    }

    function render() {
      const list = sorted(data.filter(matches));
      grid.innerHTML = list.map(card).join("");
      empty.hidden = list.length > 0;
      count.textContent = list.length === data.length ? `${data.length} result${data.length === 1 ? "" : "s"}` : `${list.length} of ${data.length} result${data.length === 1 ? "" : "s"}`;
      renderActive();
      writeState();
    }

    function clear() {
      q.value = "";
      sort.value = "updated";
      for (const f of FACETS) for (const b of boxes(f)) b.checked = false;
      render();
      q.focus();
    }

    let t;
    q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(render, 120); });
    form.addEventListener("change", (e) => { if (e.target.type === "checkbox") render(); });
    sort.addEventListener("change", render);
    $("clear").addEventListener("click", clear);
    document.querySelectorAll("[data-clear]").forEach((b) => b.addEventListener("click", clear));
    active.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill");
      if (!btn) return;
      if (btn.dataset.f === "q") q.value = "";
      else for (const b of boxes(btn.dataset.f)) if (b.value === btn.dataset.v) b.checked = false;
      render();
    });

    // Collapse the facets on narrow screens so the grid is reachable without scrolling past them.
    if (matchMedia("(max-width: 900px)").matches) form.querySelectorAll(".facet").forEach((d) => d.removeAttribute("open"));

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
