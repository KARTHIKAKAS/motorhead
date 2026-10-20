/* =========================================================
   MOTORHEAD — Node.js + Express + SQLite backend
   Serves the static site and a JSON API for accounts, posts,
   comments, likes and garage vehicles.
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const express = require("express");
const cookieParser = require("cookie-parser");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DATABASE_PATH || path.join(ROOT, "motorhead.db");
const SESSION_DAYS = 30;

if (DB_PATH !== ":memory:") {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    country       TEXT NOT NULL DEFAULT '',
    ride          TEXT NOT NULL DEFAULT '',
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id         TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    initials   TEXT NOT NULL,
    location   TEXT NOT NULL,
    category   TEXT NOT NULL,
    scene      TEXT NOT NULL,
    seed       INTEGER NOT NULL,
    body       TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id    TEXT NOT NULL,
    name       TEXT NOT NULL,
    text       TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

  CREATE TABLE IF NOT EXISTS likes (
    post_id    TEXT NOT NULL,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    PRIMARY KEY (post_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id         TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    year       INTEGER NOT NULL,
    owner      TEXT NOT NULL,
    location   TEXT NOT NULL,
    type       TEXT NOT NULL,
    odometer   INTEGER NOT NULL,
    scene      TEXT NOT NULL,
    seed       INTEGER NOT NULL,
    mods       TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

/* ---------------- helpers ---------------- */

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const parts = String(stored || "").split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  try {
    const check = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), check);
  } catch (e) {
    return false;
  }
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)").run(
    token,
    userId,
    new Date().toISOString()
  );
  return token;
}

function timeAgo(iso) {
  const secs = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(days / 365)}y`;
}

function initialsOf(name) {
  return (name || "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function rowToPost(r) {
  let body;
  try {
    body = JSON.parse(r.body);
  } catch (e) {
    body = [String(r.body)];
  }
  return {
    id: r.id,
    name: r.name,
    initials: r.initials,
    location: r.location,
    category: r.category,
    time: timeAgo(r.created_at),
    scene: r.scene,
    seed: r.seed,
    media: true,
    body,
    likes: 0,
    comments: 0
  };
}

function rowToVehicle(r) {
  let mods;
  try {
    mods = JSON.parse(r.mods);
  } catch (e) {
    mods = [];
  }
  return {
    id: r.id,
    name: r.name,
    year: r.year,
    owner: r.owner,
    location: r.location,
    type: r.type,
    odometer: r.odometer,
    scene: r.scene,
    seed: r.seed,
    mods
  };
}

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/"
};

function setSessionCookie(res, token) {
  res.cookie("mh_session", token, { ...COOKIE_OPTS, maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000 });
}

function currentUser(req) {
  const token = (req.cookies && req.cookies.mh_session) || "";
  if (!token) return null;
  const session = db.prepare("SELECT user_id FROM sessions WHERE token = ?").get(token);
  if (!session) return null;
  const user = db
    .prepare("SELECT id, name, email, country, ride FROM users WHERE id = ?")
    .get(session.user_id);
  return user || null;
}

function requireAuth(req, res, next) {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: "Log in to do that." });
  req.user = user;
  next();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------------- app ---------------- */

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

/* ---------------- auth ---------------- */

app.post("/api/auth/signup", (req, res) => {
  const b = req.body || {};
  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const country = String(b.country || "").trim();
  const ride = String(b.ride || "").trim();

  if (name.length < 2) return res.status(400).json({ error: "Tell us what to call you." });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "That email doesn't look right." });
  if (password.length < 8) return res.status(400).json({ error: "Password needs at least 8 characters." });

  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) return res.status(409).json({ error: "An account with that email already exists. Log in instead." });

  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, country, ride, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(name, email, hashPassword(password), country, ride, new Date().toISOString());

  const user = { id: info.lastInsertRowid, name, email, country, ride };
  setSessionCookie(res, createSession(user.id));
  res.status(201).json({ user });
});

app.post("/api/auth/login", (req, res) => {
  const b = req.body || {};
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const row = db
    .prepare("SELECT id, name, email, password_hash, country, ride FROM users WHERE email = ?")
    .get(email);

  if (!row || !verifyPassword(password, row.password_hash)) {
    return res.status(401).json({ error: "Email or password is incorrect." });
  }

  const user = { id: row.id, name: row.name, email: row.email, country: row.country, ride: row.ride };
  setSessionCookie(res, createSession(user.id));
  res.json({ user });
});

app.post("/api/auth/logout", (req, res) => {
  const token = (req.cookies && req.cookies.mh_session) || "";
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  res.clearCookie("mh_session", COOKIE_OPTS);
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: currentUser(req) });
});

/* ---------------- posts ---------------- */

app.get("/api/posts", (req, res) => {
  const rows = db.prepare("SELECT * FROM posts ORDER BY created_at DESC, rowid DESC").all();
  res.json({ posts: rows.map(rowToPost) });
});

app.post("/api/posts", requireAuth, (req, res) => {
  const b = req.body || {};
  const category = String(b.category || "Bikes");
  const location = String(b.location || "").trim() || "Somewhere on the road";

  let body = Array.isArray(b.body)
    ? b.body.map((s) => String(s).trim()).filter(Boolean)
    : String(b.body || "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  if (body.join("").length < 8) {
    return res.status(400).json({ error: "Say a little more — at least a sentence." });
  }

  const now = new Date().toISOString();
  const id = "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = req.user.name;
  const initials = initialsOf(name) || "MH";
  const scene = String(b.scene || "sunset");
  const seed = Number(b.seed) || Math.floor(Math.random() * 9000) + 100;

  db.prepare(
    "INSERT INTO posts (id, user_id, name, initials, location, category, scene, seed, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, req.user.id, name, initials, location, category, scene, seed, JSON.stringify(body), now);

  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  res.status(201).json({ post: rowToPost(row) });
});

/* ---------------- comments ---------------- */

app.get("/api/comments", (req, res) => {
  const rows = db
    .prepare("SELECT post_id, name, text, created_at FROM comments ORDER BY created_at ASC, id ASC")
    .all();
  const comments = {};
  for (const r of rows) {
    (comments[r.post_id] = comments[r.post_id] || []).push({
      name: r.name,
      text: r.text,
      when: timeAgo(r.created_at)
    });
  }
  res.json({ comments });
});

app.post("/api/comments", requireAuth, (req, res) => {
  const b = req.body || {};
  const postId = String(b.postId || "");
  const text = String(b.text || "").trim();
  if (!postId) return res.status(400).json({ error: "Missing post." });
  if (!text) return res.status(400).json({ error: "Write a comment first." });
  if (text.length > 280) return res.status(400).json({ error: "Keep it under 280 characters." });

  const now = new Date().toISOString();
  db.prepare("INSERT INTO comments (post_id, name, text, created_at) VALUES (?, ?, ?, ?)").run(
    postId,
    req.user.name,
    text,
    now
  );
  res.status(201).json({ comment: { name: req.user.name, text, when: timeAgo(now) } });
});

/* ---------------- likes ---------------- */

app.get("/api/likes", (req, res) => {
  const user = currentUser(req);
  if (!user) return res.json({ likes: [] });
  const rows = db.prepare("SELECT post_id FROM likes WHERE user_id = ?").all(user.id);
  res.json({ likes: rows.map((r) => r.post_id) });
});

app.post("/api/likes", requireAuth, (req, res) => {
  const b = req.body || {};
  const postId = String(b.postId || "");
  if (!postId) return res.status(400).json({ error: "Missing post." });

  const existing = db
    .prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?")
    .get(postId, req.user.id);

  if (existing) {
    db.prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?").run(postId, req.user.id);
    res.json({ liked: false });
  } else {
    db.prepare("INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)").run(
      postId,
      req.user.id,
      new Date().toISOString()
    );
    res.json({ liked: true });
  }
});

/* ---------------- vehicles ---------------- */

app.get("/api/vehicles", (req, res) => {
  const rows = db.prepare("SELECT * FROM vehicles ORDER BY created_at DESC, rowid DESC").all();
  res.json({ vehicles: rows.map(rowToVehicle) });
});

app.post("/api/vehicles", requireAuth, (req, res) => {
  const b = req.body || {};
  const name = String(b.name || "").trim();
  if (!name) return res.status(400).json({ error: "Give the machine a name." });

  const now = new Date().toISOString();
  const id = "uv" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const type = String(b.type || "Daily");
  const mods = (Array.isArray(b.mods) ? b.mods : String(b.mods || "").split(","))
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 5);

  db.prepare(
    "INSERT INTO vehicles (id, user_id, name, year, owner, location, type, odometer, scene, seed, mods, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    id,
    req.user.id,
    name,
    Number(b.year) || new Date().getFullYear(),
    req.user.name,
    String(b.location || "").trim() || "Somewhere on the road",
    type,
    Number(b.odometer) || 0,
    String(b.scene || "dusk"),
    Number(b.seed) || Math.floor(Math.random() * 9000) + 100,
    JSON.stringify(mods),
    now
  );

  const row = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(id);
  res.status(201).json({ vehicle: rowToVehicle(row) });
});

/* ---------------- static site ---------------- */

const PAGES = ["index.html", "feed.html", "garage.html", "join.html", "trips.html"];

app.get("/", (req, res) => res.sendFile(path.join(ROOT, "index.html")));
for (const page of PAGES) {
  app.get("/" + page, (req, res) => res.sendFile(path.join(ROOT, page)));
}
app.use("/assets", express.static(path.join(ROOT, "assets")));

app.get("/health", (req, res) => {
  db.prepare("SELECT 1").get();
  res.json({ ok: true });
});

/* ---------------- 404 + error handling ---------------- */

app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed" || err.status === 400) {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }
  return next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Motorhead is running at http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});
