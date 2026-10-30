// Client-side search, filter and sort over the catalog embedded in index.html.
// State lives in the URL (?q=&category=&platform=&author=&sort=) so views are shareable.
(function () {
  const data = JSON.parse(document.getElementById("catalog").textContent);
  const $ = (id) => document.getElementById(id);
  const els = { q: $("q"), category: $("category"), platform: $("platform"), author: $("author"), sort: $("sort") };
  const grid = $("grid");
  const empty = $("empty");
  const count = $("count");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (iso) => (iso ? new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "");

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
      const v = els[k].value;
      if (v && !(k === "sort" && v === "updated")) p.set(k, v);
    }
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}#gallery` : location.pathname + (location.hash || ""));
  }

  function matches(s) {
    const q = els.q.value.trim().toLowerCase();
    if (els.category.value && s.category !== els.category.value) return false;
    if (els.platform.value && !s.platforms.includes(els.platform.value)) return false;
    if (els.author.value && s.author !== els.author.value) return false;
    if (!q) return true;
    const hay = [s.name, s.description, s.agentDescription, s.author, s.category, ...s.tags, ...s.platforms].join(" ").toLowerCase();
    return q.split(/\s+/).every((term) => hay.includes(term));
  }

  function sorted(list) {
    const by = els.sort.value;
    const copy = list.slice();
    if (by === "title") copy.sort((a, b) => a.name.localeCompare(b.name));
    else if (by === "newest") copy.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "") || a.name.localeCompare(b.name));
    else copy.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "") || a.name.localeCompare(b.name));
    return copy;
  }

  function card(s) {
    return `<article class="card">
  <a class="card-art" href="${s.url}" tabindex="-1" aria-hidden="true"><img src="${s.image}" alt="" loading="lazy" width="640" height="360"></a>
  <div class="card-body">
    <div class="card-top"><span class="badge">${esc(s.category)}</span><span>Updated ${esc(fmt(s.updatedAt))}</span></div>
    <h3><a href="${s.url}">${esc(s.name)}</a></h3>
    <p>${esc(s.description)}</p>
    <div class="chips">${s.platforms.map((p) => `<span class="chip chip-platform">${esc(p)}</span>`).join("")}</div>
    <div class="card-foot"><span class="muted">${esc(s.author)}</span><a href="${s.url}">Details →</a></div>
  </div>
</article>`;
  }

  function render() {
    const list = sorted(data.filter(matches));
    grid.innerHTML = list.map(card).join("");
    empty.hidden = list.length > 0;
    count.textContent = `Showing ${list.length} of ${data.length} skill${data.length === 1 ? "" : "s"}`;
    writeState();
  }

  function clear() {
    for (const k of Object.keys(els)) els[k].value = k === "sort" ? "updated" : "";
    render();
    els.q.focus();
  }

  let t;
  els.q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(render, 120); });
  for (const k of ["category", "platform", "author", "sort"]) els[k].addEventListener("change", render);
  $("clear").addEventListener("click", clear);
  document.querySelectorAll("[data-clear]").forEach((b) => b.addEventListener("click", clear));

  readState();
  render();
})();
