# Deployment guide — Sharon Physiotherapy

This app is a **Next.js 16 application with server-side rendering, server actions, NextAuth, Prisma, and a local SQLite database.** It is **not** a static site.

## Critical — read this first

Apache cannot run this app by itself. Apache will sit **in front** of a Node.js process and forward requests to it. You need both:

1. **Node.js 18+** installed on the server (Node 20 LTS recommended).
2. **Apache HTTPD** with these modules enabled: `mod_rewrite`, `mod_proxy`, `mod_proxy_http`, optionally `mod_headers`.

If your hosting is a **plain shared host with no Node.js support** (some basic Hostinger, GoDaddy shared plans, etc.), **this app cannot be deployed there**. Use one of:
- A **VPS** (DigitalOcean, Linode, Hetzner, Contabo) — full control, recommended.
- A **Node-capable cPanel host** (A2 Hosting, Namecheap Stellar Plus, etc. — look for "Node.js Selector" / "Phusion Passenger").
- A managed platform with no Apache needed: **Railway, Render, Fly.io** (simpler, but learn their CLI).

The rest of this doc assumes **VPS with Apache + Node + PM2** (the most common setup for what you've asked for).

---

## 1. What to upload

From your local project folder, upload **these** to the server (e.g. via SFTP, FileZilla, or `rsync`):

```
.next/              ← the production build
public/
prisma/             ← schema + migrations
scripts/            ← backup scripts (optional, see §6)
node_modules/       ← OR reinstall on server, see §3
package.json
package-lock.json   ← if present
next.config.ts
prisma.config.ts
tsconfig.json
.htaccess           ← place at Apache docroot, see §5
dev.db              ← ONLY if you want to keep existing data
```

**Do NOT** upload `.env` via Git. Create it manually on the server (see §4).

**Do NOT** upload `.git/`, source files you no longer need on prod (everything in `src/` IS needed because Next still needs the server source for some runtime cases — safest: upload the whole project minus `.git`, `.next/cache`, and `node_modules` if you reinstall on server).

Simplest reliable approach:
```
rsync -av --exclude=.git --exclude=node_modules --exclude=.next/cache ./ user@server:/var/www/sharon/
```

---

## 2. Server folder layout

Pick a stable location, e.g. `/var/www/sharon/`. After upload, the tree should look like:

```
/var/www/sharon/
├── .next/
├── prisma/
├── public/
├── scripts/
├── src/
├── node_modules/        (after npm install)
├── dev.db               (the SQLite database)
├── package.json
├── package-lock.json
├── next.config.ts
├── prisma.config.ts
├── .htaccess
└── .env                 (you'll create this — see §4)
```

The `.htaccess` file should also be **copied** to Apache's docroot for the domain (e.g. `/var/www/html/` or wherever the vhost points). It does not need to be inside `/var/www/sharon/`. Same `.htaccess` content; just an extra copy at the docroot.

---

## 3. Install dependencies on the server

```bash
cd /var/www/sharon
npm ci --omit=dev    # installs from package-lock.json, production deps only
```

If `package-lock.json` is missing: `npm install --omit=dev`.

Then regenerate the Prisma client for the server's OS/arch:
```bash
npx prisma generate
npx prisma migrate deploy   # applies migrations (safe if already applied)
```

---

## 4. Create `.env` on the server

Create `/var/www/sharon/.env` with:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="REPLACE_WITH_NEW_RANDOM_SECRET"
ADMIN_EMAIL="admin@sharonphysio.com"
ADMIN_PASSWORD_HASH="\$2b\$10\$wRNAZaUY8uLBG0eYlO.AIu3j87PvWwuETSizgdZMwUrGNMC6eKtBu"
```

**Generate a new AUTH_SECRET on the server** (do not reuse the one from local dev):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Notes:
- The `\$` escapes on `ADMIN_PASSWORD_HASH` are **required** so Next.js's env loader doesn't treat `$2b`, `$10`, etc. as variables.
- Set permissions: `chmod 600 .env` so other users on the server can't read it.

---

## 5. Apache configuration

### Option A — VirtualHost config (preferred, faster than .htaccess)

In your site's vhost file (e.g. `/etc/apache2/sites-available/sharon.conf`):

```apache
<VirtualHost *:80>
    ServerName sharonphysio.example.com

    ProxyPreserveHost On
    ProxyRequests Off

    ProxyPass /_next/ http://127.0.0.1:3000/_next/
    ProxyPassReverse /_next/ http://127.0.0.1:3000/_next/

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    ErrorLog ${APACHE_LOG_DIR}/sharon-error.log
    CustomLog ${APACHE_LOG_DIR}/sharon-access.log combined
</VirtualHost>
```

Enable modules, enable site, reload:
```bash
sudo a2enmod proxy proxy_http rewrite headers
sudo a2ensite sharon.conf
sudo systemctl reload apache2
```

Then add SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d sharonphysio.example.com
```

### Option B — `.htaccess` only (use if you don't have vhost access, e.g. cPanel)

Upload the included [.htaccess](.htaccess) to your domain's document root. Your host's docroot must have **`AllowOverride All`** set (most cPanel/managed Apache hosts do). The included file:

- Uses `mod_rewrite` with the `[P]` (proxy) flag to forward all requests to `http://127.0.0.1:3000`.
- Adds security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Caches static `_next` assets for 1 year.
- Denies direct download of `.env`, `package.json`, configs, and markdown docs.

After upload, enable HTTPS by uncommenting the redirect block at the top.

---

## 6. Run Next.js as a persistent process (PM2)

Apache will proxy to port 3000, but **something must keep Node running**. Use PM2:

```bash
sudo npm install -g pm2

cd /var/www/sharon
pm2 start npm --name "sharon" -- start
pm2 save
pm2 startup           # follow the printed command to auto-start at reboot
```

Useful PM2 commands:
| Action | Command |
|---|---|
| Status | `pm2 status` |
| Live logs | `pm2 logs sharon` |
| Restart | `pm2 restart sharon` |
| Stop | `pm2 stop sharon` |
| After code change | `pm2 restart sharon` |

To change the port (default 3000):
```bash
pm2 delete sharon
PORT=3000 pm2 start npm --name "sharon" -- start
pm2 save
```

---

## 7. Database & backups on the server

`dev.db` lives at `/var/www/sharon/dev.db` (same as on your laptop). For backups on the server:

- Adapt [scripts/backup-db.mjs](scripts/backup-db.mjs) — change `BACKUP_DIR` to a Linux path like `/var/backups/sharon`.
- Use **cron** instead of Windows Task Scheduler:
  ```
  # Sunday at 14:00
  0 14 * * 0 cd /var/www/sharon && /usr/bin/node scripts/backup-db.mjs >> /var/log/sharon-backup.log 2>&1
  ```
- For off-server backups, rsync the backup folder to S3, Backblaze B2, or another machine.

---

## 8. Deployment checklist (run through this every release)

- [ ] `npm run build` on local — passes.
- [ ] Commit + push (or upload) the changes.
- [ ] On server: `git pull` (or rsync), then `npm ci --omit=dev`, then `npx prisma migrate deploy`, then `pm2 restart sharon`.
- [ ] Visit the site, log in, create a test patient, verify it persists.
- [ ] Check `pm2 logs sharon` for errors.
- [ ] Check `D:\SharonBackups` (or server backup dir) has a recent file.

---

## 9. Quick local test of the production build

Before uploading, you can run the prod build locally to catch issues:

```bash
npm run build
npm start
```

Open http://localhost:3000, log in with `admin@sharonphysio.com` / `Stella@8526`. If it works locally with the prod build, it'll work on the server (assuming Apache proxy + Node + .env are set up correctly).

---

## 10. Common pitfalls

| Symptom | Likely cause |
|---|---|
| 502 Bad Gateway | Node app not running. `pm2 status` → `pm2 start ...`. |
| Login fails after deploy | `.env` not uploaded / `$` not escaped with `\$` in `ADMIN_PASSWORD_HASH`. |
| Static assets 404 | Apache modules `proxy`, `proxy_http` not enabled. Or `_next/` proxy rule missing. |
| `prisma` errors | Forgot `npx prisma generate` on the server (binary engines are OS-specific). |
| Data missing | You didn't upload `dev.db`, or it got overwritten by deploy. Always exclude `dev.db` from rsync after the first upload. |
| Sessions invalid on every request | `AUTH_SECRET` not set, or different value on each restart. |
