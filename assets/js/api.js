/* =========================================================
   MOTORHEAD — API client
   Talks to the Node.js backend and mirrors the server state
   into localStorage so the existing UI keeps working.
   ========================================================= */
(function () {
  "use strict";

  async function request(path, options) {
    const opts = Object.assign(
      { headers: { "Content-Type": "application/json" }, credentials: "same-origin" },
      options || {}
    );
    if (opts.body && typeof opts.body !== "string") {
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(path, opts);
    let data = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.indexOf("application/json") !== -1) {
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }
    }
    if (!res.ok) {
      const err = new Error((data && data.error) || "Something went wrong (" + res.status + ").");
      err.status = res.status;
      throw err;
    }
    return data;
  }

  const get = (p) => request(p);
  const post = (p, body) => request(p, { method: "POST", body });

  function cache(key, value) {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage blocked — ignore */
    }
  }

  // Pull server state into localStorage before the page renders.
  async function hydrate() {
    try {
      const [me, posts, vehicles, likes, comments] = await Promise.all([
        request("/api/auth/me").catch(() => null),
        request("/api/posts").catch(() => null),
        request("/api/vehicles").catch(() => null),
        request("/api/likes").catch(() => null),
        request("/api/comments").catch(() => null)
      ]);

      if (me) {
        if (me.user) cache("mh_user", me.user);
        else localStorage.removeItem("mh_user");
      }
      if (posts && Array.isArray(posts.posts)) cache("mh_posts", posts.posts);
      if (vehicles && Array.isArray(vehicles.vehicles)) cache("mh_vehicles", vehicles.vehicles);
      if (likes && Array.isArray(likes.likes)) {
        const map = {};
        likes.likes.forEach((id) => (map[id] = true));
        cache("mh_likes", map);
      }
      if (comments && comments.comments && typeof comments.comments === "object") {
        cache("mh_comments", comments.comments);
      }
    } catch (e) {
      // Offline: keep whatever is already cached in this browser.
    }
  }

  function currentUser() {
    try {
      return JSON.parse(localStorage.getItem("mh_user") || "null");
    } catch (e) {
      return null;
    }
  }

  function clearLocal() {
    ["mh_user", "mh_posts", "mh_vehicles", "mh_likes", "mh_comments"].forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (e) {
        /* ignore */
      }
    });
  }

  window.MotorheadAPI = { request, get, post, hydrate, currentUser, clearLocal };
})();
