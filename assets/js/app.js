/* =========================================================
   MOTORHEAD — front-end behaviour
   No build step, no dependencies. Data persists in localStorage.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- tiny utils ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  let toastTimer;
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------------- procedural scenery ---------------- */
  const PALETTES = {
    sunset: { top: "#2a1030", bottom: "#ff6a3d", sun: "#ffd27a", far: "#331a2c", mid: "#1f0f1c", near: "#140b12", road: "#151016" },
    dusk: { top: "#0f1c33", bottom: "#4a7fb5", sun: "#ffe1b8", far: "#1c2c44", mid: "#122033", near: "#0b1420", road: "#101821" },
    desert: { top: "#2b1712", bottom: "#dd9358", sun: "#ffe6b0", far: "#43261a", mid: "#2b1810", near: "#1b0f0a", road: "#241510" },
    forest: { top: "#0d1a16", bottom: "#4a8a67", sun: "#d9f2c8", far: "#1b3227", mid: "#122219", near: "#0a1510", road: "#101a14" },
    ice: { top: "#0e1a26", bottom: "#83b8ce", sun: "#eaf7ff", far: "#22404f", mid: "#162b37", near: "#0c161d", road: "#111c23" },
    neon: { top: "#14062b", bottom: "#6d3bd6", sun: "#5ce1c0", far: "#241048", mid: "#170a32", near: "#0d0620", road: "#150b28" }
  };

  function makeRng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  function mountainLayer(r, baseY, amp, fill) {
    const step = 46 + Math.round(r() * 34);
    let pts = `0,460 0,${baseY}`;
    for (let x = 0; x <= 800; x += step) {
      const y = baseY - amp * (0.25 + r() * 0.95);
      pts += ` ${x},${y.toFixed(0)}`;
    }
    pts += ` 800,460`;
    return `<polygon points="${pts}" fill="${fill}"/>`;
  }

  function sceneSVG(name, seed) {
    const p = PALETTES[name] || PALETTES.sunset;
    const r = makeRng(seed * 2654435761);
    const uid = `${name}-${seed}`;
    const sunX = 430 + Math.round(r() * 220);
    const sunY = 108 + Math.round(r() * 76);
    const sunR = 26 + Math.round(r() * 12);

    let dashes = "";
    for (let i = 1; i <= 6; i++) {
      const t = i / 7;
      const y = 334 + t * t * 122;
      const hw = 2.5 + t * 15;
      const h = 5 + t * 20;
      dashes += `<rect x="${(400 - hw).toFixed(1)}" y="${y.toFixed(1)}" width="${(hw * 2).toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="#f6e9dc" opacity="${(0.16 + t * 0.42).toFixed(2)}"/>`;
    }

    let posts = "";
    for (let i = 0; i < 4; i++) {
      const t = (i + 1) / 5.4;
      const y = 336 + t * t * 118;
      const off = 26 + t * 190;
      const h = 5 + t * 16;
      const w = 1.6 + t * 3;
      posts += `<rect x="${(400 - off).toFixed(1)}" y="${(y - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${p.sun}" opacity="${(0.14 + t * 0.22).toFixed(2)}"/>`;
      posts += `<rect x="${(400 + off).toFixed(1)}" y="${(y - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${p.sun}" opacity="${(0.14 + t * 0.22).toFixed(2)}"/>`;
    }

    return `<svg viewBox="0 0 800 460" width="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated road at ${name}">
      <defs>
        <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="0.72" stop-color="${p.bottom}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
        <radialGradient id="glow-${uid}">
          <stop offset="0" stop-color="${p.sun}" stop-opacity="0.85"/>
          <stop offset="1" stop-color="${p.sun}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="haze-${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${p.bottom}" stop-opacity="0"/>
          <stop offset="1" stop-color="${p.bottom}" stop-opacity="0.55"/>
        </linearGradient>
        <radialGradient id="vig-${uid}" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.5"/>
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#sky-${uid})"/>
      <circle cx="${sunX}" cy="${sunY}" r="150" fill="url(#glow-${uid})"/>
      <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${p.sun}" opacity="0.96"/>
      <rect y="250" width="800" height="90" fill="url(#haze-${uid})"/>
      ${mountainLayer(r, 336, 118, p.far)}
      ${mountainLayer(r, 352, 74, p.mid)}
      <rect y="330" width="800" height="130" fill="${p.near}"/>
      <polygon points="382,332 418,332 660,460 140,460" fill="${p.road}"/>
      <polygon points="382,332 388,332 214,460 140,460" fill="#ffffff" opacity="0.05"/>
      <polygon points="412,332 418,332 660,460 586,460" fill="#ffffff" opacity="0.05"/>
      ${dashes}
      ${posts}
      <rect width="800" height="460" fill="url(#vig-${uid})"/>
    </svg>`;
  }

  function hydrateScenes(root = document) {
    $$("[data-scene]", root).forEach((el) => {
      if (el.dataset.sceneReady) return;
      const seed = parseInt(el.dataset.seed || "7", 10);
      el.innerHTML = sceneSVG(el.dataset.scene, seed);
      el.dataset.sceneReady = "1";
    });
  }

  /* ---------------- nav ---------------- */
  function initNav() {
    const nav = $(".nav");
    const toggle = $("[data-menu-toggle]");
    const links = $("#navLinks");

    if (nav) {
      const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        links.classList.toggle("is-open", !open);
      });
      links.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          toggle.setAttribute("aria-expanded", "false");
          links.classList.remove("is-open");
        }
      });
    }
  }

  /* ---------------- reveal on scroll ---------------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
      io.observe(el);
    });
  }

  /* ---------------- marquee ---------------- */
  function initMarquee() {
    const track = $("#marqueeTrack");
    if (!track) return;
    const cities = [
      "Nairobi", "Osaka", "Lisbon", "Bogotá", "Reykjavík", "Cape Town", "Mumbai",
      "Berlin", "Ho Chi Minh City", "Anchorage", "Accra", "Auckland", "Mexico City"
    ];
    const item = (c) => `<span class="marquee__item">${c}</span>`;
    const half = cities.map(item).join("");
    track.innerHTML = half + half;
    track.setAttribute("aria-hidden", "true");
  }

  /* ---------------- globe ---------------- */
  function initGlobe() {
    const host = $("#globe");
    if (!host) return;

    const W = 440, H = 440, cx = 220, cy = 220, R = 186;
    let dots = "";
    for (let lat = -78; lat <= 78; lat += 9) {
      const latR = (lat * Math.PI) / 180;
      const ring = Math.cos(latR) * R;
      const count = Math.max(8, Math.round(Math.abs(ring) / 5.4));
      for (let i = 0; i < count; i++) {
        const lon = (i / count) * Math.PI * 2;
        const z = Math.cos(lon) * Math.cos(latR);
        if (z <= 0.02) continue;
        const x = cx + ring * Math.sin(lon);
        const y = cy - R * Math.sin(latR);
        const o = 0.16 + z * 0.6;
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.1 + z * 1.25).toFixed(2)}" fill="#cfd7e2" opacity="${o.toFixed(2)}"/>`;
      }
    }

    const markers = (window.MH_MARKERS || [])
      .map((m) => {
        const latR = (m.lat * Math.PI) / 180;
        const lonR = (m.lon * Math.PI) / 180;
        const z = Math.cos(lonR) * Math.cos(latR);
        if (z <= 0) return "";
        const x = cx + R * Math.cos(latR) * Math.sin(lonR);
        const y = cy - R * Math.sin(latR);
        return `<g class="globe-pin">
          <title>${esc(m.name)}</title>
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#ff5a1f" opacity="0.2"/>
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.1" fill="#ff5a1f" stroke="#0b0c0f" stroke-width="1.2"/>
        </g>`;
      })
      .join("");

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Dotted globe with Motorhead communities highlighted">
      <defs>
        <radialGradient id="globe-disc" cx="0.38" cy="0.32" r="0.72">
          <stop offset="0" stop-color="#2a3244" stop-opacity="0.85"/>
          <stop offset="0.65" stop-color="#161b25" stop-opacity="0.65"/>
          <stop offset="1" stop-color="#0b0c0f" stop-opacity="0.1"/>
        </radialGradient>
        <radialGradient id="globe-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stop-color="#ff5a1f" stop-opacity="0.12"/>
          <stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${R + 60}" fill="url(#globe-halo)"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#globe-disc)"/>
      <circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * 0.32}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${R * 0.32}" ry="${R}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      ${dots}
      ${markers}
    </svg>`;
  }

  function initRegions() {
    const host = $("#regionList");
    if (!host) return;
    host.innerHTML = (window.MH_REGIONS || [])
      .map((r) => `<div class="region"><span>${esc(r.label)}</span><b>${r.riders.toLocaleString()} riders</b></div>`)
      .join("");
  }

  /* ---------------- community feed ---------------- */
  const FEED = {
    posts: null,
    likes: null,
    comments: null,
    filter: "All",
    sort: "new",
    booted: false
  };

  const SCENE_BY_CATEGORY = {
    Bikes: "sunset",
    Cars: "dusk",
    Overland: "desert",
    EV: "ice",
    Builds: "neon",
    Questions: "forest",
    Trips: "forest"
  };

  function allPosts() {
    const user = store.get("mh_posts", []);
    return user.concat(window.MH_POSTS || []);
  }

  function seedComments() {
    return store.get("mh_comments", {});
  }

  function likeCount(post) {
    return post.likes + (FEED.likes[post.id] ? 1 : 0);
  }

  function commentCount(post) {
    const extra = (FEED.comments[post.id] || []).length;
    return post.comments + extra;
  }

  function postHTML(post) {
    const liked = !!FEED.likes[post.id];
    const initials = post.initials || "MH";
    const body = Array.isArray(post.body) ? post.body : String(post.body).split("\n\n");
    return `<article class="post" id="post-${esc(post.id)}">
      <header class="post__head">
        <div class="avatar" aria-hidden="true">${esc(initials)}</div>
        <div class="post__who">
          <strong>${esc(post.name)}</strong>
          <span>${esc(post.location)} · ${esc(post.time)}</span>
        </div>
        <span class="badge${post.category === "EV" ? " badge--mint" : ""}">${esc(post.category)}</span>
      </header>
      <div class="post__body">
        ${body.filter(Boolean).map((par) => `<p>${esc(par)}</p>`).join("")}
      </div>
      ${post.media !== false ? `<div class="post__media">${sceneSVG(post.scene, post.seed)}</div>` : ""}
      <div class="post__stats">
        <span data-like-count="${esc(post.id)}">${likeCount(post).toLocaleString()} likes</span>
        <span data-comment-count="${esc(post.id)}">${commentCount(post)} comments</span>
      </div>
      <div class="post__actions">
        <button class="paction${liked ? " is-liked" : ""}" data-act="like" data-id="${esc(post.id)}" aria-pressed="${liked}">
          ${heartIcon()}<span>Like</span>
        </button>
        <button class="paction" data-act="comments" data-id="${esc(post.id)}" aria-expanded="false">
          ${commentIcon()}<span>Comment</span>
        </button>
        <button class="paction paction--end" data-act="share" data-id="${esc(post.id)}">
          ${shareIcon()}<span>Share</span>
        </button>
      </div>
      <div class="post__comments" data-comments-for="${esc(post.id)}" hidden></div>
    </article>`;
  }

  function heartIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2l1.6 1.6L12 21l7.2-7.2 1.6-1.6a5.1 5.1 0 0 0 0-7.2Z"/></svg>`;
  }
  function commentIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-3.9-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/></svg>`;
  }
  function shareIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>`;
  }

  function renderFeed() {
    const host = $("#feedList");
    if (!host) return;
    FEED.likes = store.get("mh_likes", {});
    FEED.comments = seedComments();

    let posts = allPosts();
    if (FEED.filter !== "All") posts = posts.filter((p) => p.category === FEED.filter);
    if (FEED.sort === "liked") posts = posts.slice().sort((a, b) => likeCount(b) - likeCount(a));
    if (FEED.sort === "discussed") posts = posts.slice().sort((a, b) => commentCount(b) - commentCount(a));
    const limit = parseInt(host.dataset.limit || "0", 10);
    if (limit > 0) posts = posts.slice(0, limit);

    const countEl = $("#feedCount");
    if (countEl) countEl.textContent = `${posts.length} ${posts.length === 1 ? "story" : "stories"}`;

    host.innerHTML = posts.length
      ? posts.map(postHTML).join("")
      : `<div class="empty"><strong>Nothing here yet</strong>Be the first to post in ${esc(FEED.filter)}.</div>`;
  }

  function toggleComments(id, button) {
    const panel = $(`[data-comments-for="${CSS.escape(id)}"]`);
    if (!panel) return;
    const open = !panel.hidden;
    if (open) {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
      return;
    }
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    panel.innerHTML = `
      <div class="comment-list">${(FEED.comments[id] || [])
        .map((c) => `<div class="comment"><b>${esc(c.name)}</b><span>${esc(c.text)}</span><em>${esc(c.when)}</em></div>`)
        .join("") || `<p class="comment-empty">No comments yet. Start the conversation.</p>`}</div>
      <form class="comment-form" data-comment-form="${esc(id)}">
        <input name="text" type="text" placeholder="Add a comment…" maxlength="280" autocomplete="off" required>
        <button class="btn btn--primary btn--sm" type="submit">Post</button>
      </form>`;
    const input = $("input", panel);
    if (input) input.focus();
  }

  function addComment(id, text) {
    const user = store.get("mh_user", null);
    const name = user && user.name ? user.name : "Guest rider";
    FEED.comments = store.get("mh_comments", {});
    FEED.comments[id] = FEED.comments[id] || [];
    FEED.comments[id].push({ name, text, when: "now" });
    store.set("mh_comments", FEED.comments);

    const counter = $(`[data-comment-count="${CSS.escape(id)}"]`);
    const post = allPosts().find((p) => p.id === id);
    if (counter && post) counter.textContent = `${post.comments + FEED.comments[id].length} comments`;
  }

  function initFeed() {
    const host = $("#feedList");
    if (!host) return;

    renderFeed();

    host.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = btn.dataset.id;
      const act = btn.dataset.act;

      if (act === "like") {
        FEED.likes = store.get("mh_likes", {});
        FEED.likes[id] = !FEED.likes[id];
        store.set("mh_likes", FEED.likes);
        const post = allPosts().find((p) => p.id === id);
        const liked = !!FEED.likes[id];
        btn.classList.toggle("is-liked", liked);
        btn.setAttribute("aria-pressed", String(liked));
        const counter = $(`[data-like-count="${CSS.escape(id)}"]`);
        if (counter && post) counter.textContent = `${(post.likes + (liked ? 1 : 0)).toLocaleString()} likes`;
      }

      if (act === "comments") toggleComments(id, btn);

      if (act === "share") {
        const link = `${location.origin}${location.pathname}#post-${id}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(
            () => toast("Link copied to clipboard"),
            () => toast("Copy this link: " + link)
          );
        } else {
          toast("Link: " + link);
        }
      }
    });

    host.addEventListener("submit", (e) => {
      const form = e.target.closest("[data-comment-form]");
      if (!form) return;
      e.preventDefault();
      const input = $("input", form);
      const text = input.value.trim();
      if (!text) return;
      const id = form.dataset.commentForm;
      addComment(id, text);
      input.value = "";
      const panel = $(`[data-comments-for="${CSS.escape(id)}"]`);
      const btn = $(`[data-act="comments"][data-id="${CSS.escape(id)}"]`);
      if (panel) {
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        toggleComments(id, btn);
      }
      toast("Comment posted");
    });

    $$("[data-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        FEED.filter = chip.dataset.filter;
        $$("[data-filter]").forEach((c) => c.classList.toggle("is-active", c === chip));
        renderFeed();
      });
    });

    const sort = $("#feedSort");
    if (sort) {
      sort.addEventListener("change", () => {
        FEED.sort = sort.value;
        renderFeed();
      });
    }
  }

  function initComposer() {
    const form = $("#composer");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = form.elements.body.value.trim();
      if (text.length < 8) {
        toast("Say a little more — at least a sentence.");
        form.elements.body.focus();
        return;
      }
      const category = form.elements.category.value;
      const location = form.elements.location.value.trim() || "Somewhere on the road";
      const user = store.get("mh_user", null);
      const name = user && user.name ? user.name : "Guest rider";
      const initials = name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const post = {
        id: "u" + Date.now().toString(36),
        name,
        location,
        initials: initials || "GR",
        category,
        time: "just now",
        scene: SCENE_BY_CATEGORY[category] || "sunset",
        seed: Math.floor(Math.random() * 9000) + 100,
        media: true,
        body: text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean),
        likes: 0,
        comments: 0
      };

      const saved = store.get("mh_posts", []);
      saved.unshift(post);
      if (!store.set("mh_posts", saved)) {
        toast("Your browser blocked local storage — post not saved.");
        return;
      }
      form.reset();
      FEED.filter = "All";
      $$("[data-filter]").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "All"));
      renderFeed();
      toast("Posted to the community");
      const first = $("#feedList .post");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------------- trips ---------------- */
  function initTrips() {
    const grid = $("#tripGrid");
    if (!grid) return;

    const trips = window.MH_TRIPS || [];
    const dialog = $("#tripDialog");

    function render(region) {
      const list = !region || region === "All" ? trips : trips.filter((t) => t.region === region);
      grid.innerHTML = list
        .map(
          (t) => `<button class="trip-card" type="button" data-trip="${esc(t.id)}">
            <span class="trip-card__media">
              ${sceneSVG(t.scene, t.seed)}
              <span class="trip-card__region">${esc(t.region)}</span>
            </span>
            <span class="trip-card__body">
              <span class="trip-card__route">${esc(t.route)}</span>
              <span class="trip-card__author">${esc(t.author)} · ${esc(t.vehicle)}</span>
              <span class="trip-card__stats">
                <span><b>${t.distance.toLocaleString()} km</b></span>
                <span><b>${t.days} days</b></span>
                <span>${esc(t.country)}</span>
              </span>
            </span>
          </button>`
        )
        .join("");
      const count = $("#tripCount");
      if (count) count.textContent = `${list.length} trip logs`;
    }

    render("All");

    $$("[data-trip-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("[data-trip-filter]").forEach((c) => c.classList.toggle("is-active", c === chip));
        render(chip.dataset.tripFilter);
      });
    });

    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-trip]");
      if (!card || !dialog) return;
      const trip = trips.find((t) => t.id === card.dataset.trip);
      if (!trip) return;
      $("#tripDialogBody").innerHTML = `
        <div class="dialog__media">${sceneSVG(trip.scene, trip.seed)}</div>
        <div class="dialog__body">
          <span class="dialog__kicker">${esc(trip.region)} · ${esc(trip.author)}</span>
          <h2>${esc(trip.route)}</h2>
          <div class="dialog__stats">
            <span><b>${trip.distance.toLocaleString()} km</b> distance</span>
            <span><b>${trip.days} days</b> on the road</span>
            <span><b>${esc(trip.vehicle)}</b></span>
          </div>
          ${trip.story.map((p) => `<p>${esc(p)}</p>`).join("")}
          <div class="tags" style="margin-top:18px">
            ${trip.highlights.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}
          </div>
          <div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap">
            <a class="btn btn--primary" href="feed.html">Ask ${esc(trip.author.split(" ")[0])} a question</a>
            <button class="btn btn--ghost" type="button" data-close-dialog>Close</button>
          </div>
        </div>`;
      dialog.showModal();
    });

    if (dialog) {
      dialog.addEventListener("click", (e) => {
        if (e.target === dialog || e.target.closest("[data-close-dialog]")) dialog.close();
      });
    }
  }

  /* ---------------- garage ---------------- */
  function machineHTML(v) {
    return `<article class="machine">
      <div class="machine__media">
        ${sceneSVG(v.scene, v.seed)}
        <span class="machine__type">${esc(v.type)}</span>
      </div>
      <div class="machine__body">
        <div class="machine__name">${esc(v.name)} <span class="dim">· ${esc(v.year)}</span></div>
        <div class="machine__owner">${esc(v.owner)} · ${esc(v.location)}</div>
        <div class="tags">${(v.mods || []).map((m) => `<span class="tag">${esc(m)}</span>`).join("")}</div>
        <div class="machine__specs">
          <span><b>${Number(v.odometer).toLocaleString()} km</b></span>
          <span>${esc(v.type)}</span>
        </div>
      </div>
    </article>`;
  }

  function initGarage() {
    const grid = $("#garageGrid");
    if (!grid) return;
    const dialog = $("#garageDialog");
    const search = $("#garageSearch");

    function vehicles() {
      return store.get("mh_vehicles", []).concat(window.MH_VEHICLES || []);
    }

    function render() {
      const q = (search && search.value ? search.value : "").trim().toLowerCase();
      const list = vehicles().filter((v) => {
        if (!q) return true;
        return [v.name, v.owner, v.location, v.type].join(" ").toLowerCase().includes(q);
      });
      grid.innerHTML = list.length
        ? list.map(machineHTML).join("")
        : `<div class="empty" style="grid-column:1/-1"><strong>No machine found</strong>Try a different name or add your own.</div>`;
      const count = $("#garageCount");
      if (count) count.textContent = `${list.length} in the garage`;
    }

    render();
    if (search) search.addEventListener("input", render);

    const openBtn = $("#addMachine");
    if (openBtn && dialog) openBtn.addEventListener("click", () => dialog.showModal());

    if (dialog) {
      dialog.addEventListener("click", (e) => {
        if (e.target === dialog || e.target.closest("[data-close-dialog]")) dialog.close();
      });

      const form = $("#machineForm");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const data = new FormData(form);
          const user = store.get("mh_user", null);
          const vehicle = {
            id: "uv" + Date.now().toString(36),
            name: String(data.get("name") || "").trim(),
            year: Number(data.get("year")) || new Date().getFullYear(),
            owner: (user && user.name) || String(data.get("owner") || "").trim() || "Guest rider",
            location: String(data.get("location") || "").trim() || "Somewhere on the road",
            type: String(data.get("type") || "Daily"),
            odometer: Number(data.get("odometer")) || 0,
            scene: SCENE_BY_CATEGORY[String(data.get("type"))] || "dusk",
            seed: Math.floor(Math.random() * 9000) + 100,
            mods: String(data.get("mods") || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 5)
          };
          if (!vehicle.name) return;
          const saved = store.get("mh_vehicles", []);
          saved.unshift(vehicle);
          store.set("mh_vehicles", saved);
          form.reset();
          dialog.close();
          render();
          toast("Added to the garage");
          grid.firstElementChild && grid.firstElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    }
  }

  /* ---------------- join ---------------- */
  function initJoin() {
    const form = $("#joinForm");
    if (!form) return;

    const existing = store.get("mh_user", null);
    if (existing && existing.name) {
      const who = $("#joinWho");
      if (who) {
        who.textContent = existing.name;
        who.closest("[data-existing]").hidden = false;
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const error = $("#joinError");

      if (name.length < 2) {
        error.textContent = "Tell us what to call you.";
        form.elements.name.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        error.textContent = "That email doesn't look right.";
        form.elements.email.focus();
        return;
      }
      error.textContent = "";

      const user = {
        name,
        email,
        country: String(data.get("country") || "").trim(),
        ride: String(data.get("ride") || "").trim(),
        joined: new Date().toISOString()
      };
      store.set("mh_user", user);

      const card = $("#joinCard");
      if (card) {
        card.innerHTML = `
          <div class="success">
            <div class="success__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3>You're in, ${esc(name.split(" ")[0])}.</h3>
            <p style="color:var(--muted)">Your garage is open. No email has been sent — this is a front-end prototype and your details stay in this browser.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:20px">
              <a class="btn btn--primary" href="feed.html">Open the community</a>
              <a class="btn btn--ghost" href="garage.html">Add your machine</a>
            </div>
          </div>`;
      }
      toast("Welcome to Motorhead");
    });
  }

  /* ---------------- sidebar rails ---------------- */
  function initSideRail() {
    const trending = $("#trendingList");
    if (trending) {
      trending.innerHTML = (window.MH_TRENDING || [])
        .map(
          (t, i) => `<div class="rank-item">
            <span class="rank-item__n">${String(i + 1).padStart(2, "0")}</span>
            <span class="rank-item__t"><strong>${esc(t.route)}</strong><span>${esc(t.country)}</span></span>
            <span class="rank-item__v">${esc(t.riders.split(" ")[0])}</span>
          </div>`
        )
        .join("");
    }

    const crews = $("#crewList");
    if (crews) {
      crews.innerHTML = (window.MH_CREWS || [])
        .map(
          (c) => `<div class="rank-item">
            <span class="rank-item__n">◆</span>
            <span class="rank-item__t"><strong>${esc(c.name)}</strong><span>${esc(c.city)} · ${esc(c.focus)}</span></span>
            <span class="rank-item__v">${c.members}</span>
          </div>`
        )
        .join("");
    }
  }

  /* ---------------- newsletter ---------------- */
  function initNewsletter() {
    const form = $("#newsletter");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", form);
      if (!input.value.includes("@")) {
        toast("Enter a valid email");
        return;
      }
      input.value = "";
      toast("You're on the list");
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initNav();
    initMarquee();
    initGlobe();
    initRegions();
    initFeed();
    initComposer();
    initTrips();
    initGarage();
    initJoin();
    initSideRail();
    initNewsletter();
    hydrateScenes();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // expose for diagnostics / future modules
  window.Motorhead = { sceneSVG, toast, store };
})();
