# ValtSocial
Social media 
 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index ecebfa2ff91a3f31f95abc2f52206fcbb28c5ebe..cc389191c089d0f8d6493e55a0a9a952c078f2b7 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,49 @@
 # ValtSocial
-Social media 
+
+A starter **social media web app** inspired by Discord + Instagram + Snapchat patterns.
+
+## ✅ What this version now supports
+- Basic sign up / profile load (stored in browser localStorage)
+- Profile card with avatar, email, and bio
+- Add friends by username
+- Feed posting
+- Like / unlike posts
+- Delete your own post
+- Simple group-like chat broadcast to your friend list
+
+> This is still front-end only. No backend/database/auth server yet.
+
+## Project structure
+- `index.html` — UI layout (auth, profile, friends, feed, chat)
+- `style.css` — responsive app styling
+- `script.js` — all app logic + localStorage state handling
+
+## Run locally
+1. Clone repo
+2. Open `index.html` in browser
+
+## Next upgrades you should build
+1. **Real authentication**
+   - Firebase Auth / Supabase Auth / custom Node auth with JWT
+2. **Database**
+   - Store users, posts, comments, likes, friends, chat messages in PostgreSQL / Firestore
+3. **Real-time chat**
+   - WebSocket (Socket.io) or Firebase real-time listeners
+4. **Media uploads**
+   - Cloudinary / S3 for profile images and post media
+5. **Comments + notifications**
+   - Add comment threads and push/in-app notifications
+6. **Privacy and safety**
+   - Report/block users, private account mode, moderation tools
+
+## Suggested tech stack for scaling
+- Frontend: React + TypeScript + Vite
+- Backend: Node.js + Express / NestJS
+- DB: PostgreSQL + Prisma ORM
+- Real-time: Socket.io
+- Storage: Cloudinary / AWS S3
+- Deployment: Vercel (frontend) + Render/Railway/Fly.io (backend)
+
+## Notes
+- Data currently persists only in browser localStorage for demo purposes.
+- Clearing browser storage resets the app.
 
EOF
)
