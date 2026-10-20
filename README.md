# Motorhead

**Every road is better with a garage behind it.**

Motorhead is a community site for motorcycle and car enthusiasts — ride reports, builds, trip logs, road conditions, and the machines people actually own. It started as a static prototype that stored everything in the browser's `localStorage`; it is now a full-stack app with real accounts and a server-side database.

- **Live site:** <https://motorhead-production-fe95.up.railway.app/>
- **Repository:** <https://github.com/KARTHIKAKAS/motorhead>

---

## Features

- **Email + password accounts** — sign up and log in, with scrypt-hashed passwords and `httpOnly` cookie sessions.
- **Community feed** — post stories, like posts, and comment.
- **Trip logs** — browse curated overland trips by region.
- **The garage** — add your own machine and search the community's machines.
- **Server-persisted data** — users, posts, comments, likes, and garage vehicles are stored in a SQLite database.
- **No build step** — plain HTML, CSS, and JavaScript on the frontend.

---

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | Node.js (≥ 22.5) + Express 4 |
| Database | SQLite via Node's built-in `node:sqlite` |
| Auth     | `crypto.scrypt` password hashing + cookie sessions |
| Frontend | Vanilla HTML / CSS / JavaScript |
| Deploy   | Dockerfile, any Node container host (Railway, Fly.io, Render) |

---

## Project structure

```
.
├── server.js               # Express server, API routes, SQLite schema
├── package.json            # Dependencies and npm scripts
├── package-lock.json
├── Dockerfile              # Container build for deployment
├── .gitignore              # Excludes node_modules and *.db files
├── .dockerignore
├── index.html              # Home page
├── feed.html               # Community feed + composer
├── trips.html              # Trip logs
├── garage.html             # Garage (add/search machines)
├── join.html               # Sign up / log in
└── assets/
    ├── css/
    │   └── style.css       # All styling
    └── js/
        ├── api.js          # Frontend API client (fetches from the backend)
        ├── data.js         # Bundled seed content (posts, trips, vehicles, crews…)
        └── app.js          # UI behaviour and rendering
```

---

## Getting started (run locally)

Prerequisites: **Node.js 22.5 or newer** (for the built-in `node:sqlite`).

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Then open <http://localhost:3000>.

Development mode with auto-restart:

```bash
npm run dev
```

The database file `motorhead.db` is created automatically on first run and is git-ignored.

---

## How it works

### Backend

[`server.js`](./server.js) does two jobs:

1. Serves the static site (HTML pages and `/assets`), while keeping `server.js`, `package.json`, and the database file out of public reach.
2. Exposes a JSON API under `/api` for all data operations.

### Authentication

- Passwords are hashed with `crypto.scrypt` using a per-user random salt (format `salt:hash`), and verified with a constant-time comparison.
- On sign-up or log-in, a random 32-byte session token is stored in the `sessions` table and sent to the browser as an `httpOnly`, `SameSite=Lax` cookie (`mh_session`). The cookie is `Secure` in production.
- Protected routes check the cookie via the `requireAuth` middleware and return `401` when missing or invalid.

### Frontend data flow

[`assets/js/api.js`](./assets/js/api.js) mirrors the server state into `localStorage` under the same keys the UI always used (`mh_user`, `mh_posts`, `mh_vehicles`, `mh_likes`, `mh_comments`):

1. On page load it fetches `/api/auth/me`, `/api/posts`, `/api/vehicles`, `/api/likes`, and `/api/comments`, then caches the results locally.
2. [`assets/js/app.js`](./assets/js/app.js) renders from that cache, and every write (post, like, comment, vehicle) goes through the API and updates the cache on success.
3. If the API is unreachable, the app falls back to whatever is already cached in the browser.

Seed content (sample posts, trips, vehicles, crews) stays bundled in [`assets/js/data.js`](./assets/js/data.js) and is merged with user-generated content at render time.

---

## API reference

### Auth

| Method | Path                 | Auth | Description |
|--------|----------------------|------|-------------|
| POST   | `/api/auth/signup`   | —    | Create an account `{ name, email, password, country, ride }` |
| POST   | `/api/auth/login`    | —    | Log in `{ email, password }` |
| POST   | `/api/auth/logout`   | —    | End the session |
| GET    | `/api/auth/me`       | —    | Return the current user (or `null`) |

### Posts

| Method | Path         | Auth | Description |
|--------|--------------|------|-------------|
| GET    | `/api/posts` | —    | All user posts, newest first |
| POST   | `/api/posts` | ✅   | Create a post `{ location, category, body, scene, seed }` |

### Comments

| Method | Path             | Auth | Description |
|--------|------------------|------|-------------|
| GET    | `/api/comments`  | —    | All comments grouped by post id |
| POST   | `/api/comments`  | ✅   | Add a comment `{ postId, text }` |

### Likes

| Method | Path         | Auth | Description |
|--------|--------------|------|-------------|
| GET    | `/api/likes` | —    | Post ids liked by the current user |
| POST   | `/api/likes` | ✅   | Toggle a like `{ postId }` → `{ liked }` |

### Vehicles

| Method | Path             | Auth | Description |
|--------|------------------|------|-------------|
| GET    | `/api/vehicles`  | —    | All garage vehicles |
| POST   | `/api/vehicles`  | ✅   | Add a vehicle `{ name, year, type, location, odometer, scene, seed, mods }` |

### Health

| Method | Path      | Description |
|--------|-----------|-------------|
| GET    | `/health` | Liveness probe, returns `{ ok: true }` |

Errors are returned as JSON: `{ "error": "message" }`.

---

## Database schema

SQLite tables created automatically by `server.js`:

| Table      | Purpose |
|------------|---------|
| `users`    | Accounts (`id`, `name`, `email` unique, `password_hash`, `country`, `ride`, `created_at`) |
| `sessions` | Login sessions (`token`, `user_id`, `created_at`) |
| `posts`    | Community posts (`id`, `user_id`, `name`, `initials`, `location`, `category`, `scene`, `seed`, `body` JSON, `created_at`) |
| `comments` | Post comments (`post_id`, `name`, `text`, `created_at`) |
| `likes`    | Per-user post likes (`post_id` + `user_id` composite key) |
| `vehicles` | Garage entries (`id`, `user_id`, `name`, `year`, `owner`, `location`, `type`, `odometer`, `scene`, `seed`, `mods` JSON) |

---

## Configuration

Environment variables:

| Variable        | Default             | Description |
|-----------------|---------------------|-------------|
| `PORT`          | `3000`              | HTTP port (Railway and similar hosts set this automatically) |
| `DATABASE_PATH` | `./motorhead.db`    | SQLite file location — point this at a mounted volume in production |
| `NODE_ENV`      | —                   | Set to `production` to make session cookies `Secure` |

---

## Deployment

The included [Dockerfile](./Dockerfile) builds a Node 22 container that runs `npm start`.

### Railway (recommended)

1. In Railway, choose **Deploy from GitHub repo** and select the repository.
2. Railway detects the Dockerfile and deploys. In the service **Settings → Networking**, click **Generate Domain** to get a public URL.
3. Attach a persistent volume so the database survives redeploys:
   - **Settings → Volumes → Attach a persistent volume**, mount path `/app/data`.
   - **Variables** → add `DATABASE_PATH = /app/data/motorhead.db`.

Pushing to the `main` branch on GitHub triggers a redeploy automatically.

### Other hosts

- **Fly.io:** `fly launch`, then attach a volume at `/app/data` and set `DATABASE_PATH=/app/data/motorhead.db`.
- **Render:** works out of the box, but the free tier's disk is ephemeral — the database resets on redeploy.

---

## License

No license specified yet — all rights reserved.
