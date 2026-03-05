 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index 75a9940a03d388ab3dbc83e7675c89fde9aba536..f08d7edf794d3565f272614e041e2516d7a74059 100644
--- a/script.js
+++ b/script.js
@@ -1,11 +1,408 @@
-let currentUser = "";
-let currentPic = "";
+const STORAGE_KEY = "valtsocial_data_v2";
+const DEFAULT_AVATAR = "https://api.dicebear.com/8.x/initials/svg?seed=Valt";
 
-function setUser() {
-  let name = document.getElementById("username").value.trim();
-  let pic = document.getElementById("profilePic").value.trim();
-  if(name === "") return alert("Enter a username!");
-  currentUser = name;
-  currentPic = pic || "https://via.placeholder.com/40"; // default pic
-  document.getElementById("userSection").style.display = "none";
+const state = {
+  currentUser: null,
+  users: {},
+  posts: [],
+  chats: []
+};
+
+const el = {
+  username: document.getElementById("username"),
+  email: document.getElementById("email"),
+  profilePic: document.getElementById("profilePic"),
+  bio: document.getElementById("bio"),
+  signupBtn: document.getElementById("signupBtn"),
+  loginBtn: document.getElementById("loginBtn"),
+  logoutBtn: document.getElementById("logoutBtn"),
+  statusText: document.getElementById("statusText"),
+  profileCard: document.getElementById("profileCard"),
+  friendInput: document.getElementById("friendInput"),
+  addFriendBtn: document.getElementById("addFriendBtn"),
+  friendList: document.getElementById("friendList"),
+  postInput: document.getElementById("postInput"),
+  postBtn: document.getElementById("postBtn"),
+  posts: document.getElementById("posts"),
+  chatInput: document.getElementById("chatInput"),
+  sendChatBtn: document.getElementById("sendChatBtn"),
+  chatWindow: document.getElementById("chatWindow")
+};
+
+function now() {
+  return new Date().toLocaleString();
+}
+
+function uid() {
+  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
+}
+
+function getSafeAvatar(url) {
+  if (!url) return DEFAULT_AVATAR;
+  try {
+    const parsed = new URL(url);
+    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : DEFAULT_AVATAR;
+  } catch {
+    return DEFAULT_AVATAR;
+  }
+}
+
+function saveState() {
+  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
+}
+
+function loadState() {
+  try {
+    const raw = localStorage.getItem(STORAGE_KEY);
+    if (!raw) return;
+    const parsed = JSON.parse(raw);
+    state.currentUser = parsed.currentUser || null;
+    state.users = parsed.users || {};
+    state.posts = parsed.posts || [];
+    state.chats = parsed.chats || [];
+  } catch {
+    localStorage.removeItem(STORAGE_KEY);
+  }
+}
+
+function setStatus(text) {
+  el.statusText.textContent = text;
+}
+
+function requireAuth() {
+  if (state.currentUser) return true;
+  setStatus("Please create/load a profile first.");
+  return false;
+}
+
+function getCurrentUserData() {
+  return state.users[state.currentUser];
+}
+
+function createOrUpdateUser() {
+  const username = el.username.value.trim();
+  const email = el.email.value.trim();
+  const bio = el.bio.value.trim();
+  const avatar = getSafeAvatar(el.profilePic.value.trim());
+
+  if (!username || !email) {
+    setStatus("Username and email are required.");
+    return;
+  }
+
+  const existing = state.users[username] || { friends: [], createdAt: now() };
+  state.users[username] = {
+    ...existing,
+    username,
+    email,
+    bio,
+    avatar,
+    updatedAt: now()
+  };
+
+  state.currentUser = username;
+  saveState();
+  setStatus(`Logged in as @${username}`);
+  renderAll();
+}
+
+function loadProfile() {
+  const username = el.username.value.trim();
+  const user = state.users[username];
+
+  if (!username || !user) {
+    setStatus("Profile not found. Create it first.");
+    return;
+  }
+
+  state.currentUser = username;
+  el.email.value = user.email || "";
+  el.bio.value = user.bio || "";
+  el.profilePic.value = user.avatar || "";
+
+  saveState();
+  setStatus(`Loaded profile @${username}`);
+  renderAll();
+}
+
+function logout() {
+  state.currentUser = null;
+  saveState();
+  setStatus("Logged out.");
+  renderAll();
+}
+
+function addFriend() {
+  if (!requireAuth()) return;
+  const friendName = el.friendInput.value.trim();
+  const me = getCurrentUserData();
+
+  if (!friendName) return;
+  if (friendName === state.currentUser) {
+    setStatus("You can't add yourself.");
+    return;
+  }
+  if (!state.users[friendName]) {
+    setStatus(`User @${friendName} does not exist yet.`);
+    return;
+  }
+
+  if (!me.friends.includes(friendName)) {
+    me.friends.push(friendName);
+    saveState();
+    renderFriends();
+    setStatus(`Added @${friendName} as a friend.`);
+  }
+
+  el.friendInput.value = "";
+}
+
+function addPost() {
+  if (!requireAuth()) return;
+  const text = el.postInput.value.trim();
+  if (!text) return;
+
+  state.posts.unshift({
+    id: uid(),
+    author: state.currentUser,
+    text,
+    likes: [],
+    comments: [],
+    createdAt: now()
+  });
+
+  el.postInput.value = "";
+  saveState();
+  renderPosts();
+  setStatus("Post published.");
+}
+
+function addComment(postId, inputEl) {
+  if (!requireAuth()) return;
+  const comment = inputEl.value.trim();
+  if (!comment) return;
+
+  const post = state.posts.find((p) => p.id === postId);
+  if (!post) return;
+
+  post.comments.push({
+    id: uid(),
+    author: state.currentUser,
+    text: comment,
+    createdAt: now()
+  });
+
+  inputEl.value = "";
+  saveState();
+  renderPosts();
+}
+
+function toggleLike(postId) {
+  if (!requireAuth()) return;
+  const post = state.posts.find((p) => p.id === postId);
+  if (!post) return;
+
+  const i = post.likes.indexOf(state.currentUser);
+  if (i >= 0) post.likes.splice(i, 1);
+  else post.likes.push(state.currentUser);
+
+  saveState();
+  renderPosts();
+}
+
+function deletePost(postId) {
+  if (!requireAuth()) return;
+  const post = state.posts.find((p) => p.id === postId);
+
+  if (!post || post.author !== state.currentUser) {
+    setStatus("You can delete only your own posts.");
+    return;
+  }
+
+  state.posts = state.posts.filter((p) => p.id !== postId);
+  saveState();
+  renderPosts();
+}
+
+function sendChat() {
+  if (!requireAuth()) return;
+  const message = el.chatInput.value.trim();
+  if (!message) return;
+
+  const me = getCurrentUserData();
+  if (!me.friends.length) {
+    setStatus("Add at least one friend before chatting.");
+    return;
+  }
+
+  state.chats.push({
+    id: uid(),
+    sender: state.currentUser,
+    to: [...me.friends],
+    message,
+    createdAt: now()
+  });
+
+  el.chatInput.value = "";
+  saveState();
+  renderChat();
+}
+
+function makeAvatar(name, url) {
+  const img = document.createElement("img");
+  img.className = "avatar";
+  img.alt = name;
+  img.src = getSafeAvatar(url);
+  return img;
+}
+
+function renderProfile() {
+  el.profileCard.innerHTML = "";
+
+  if (!state.currentUser) {
+    el.profileCard.className = "profile-card empty-state";
+    el.profileCard.textContent = "Create or load an account";
+    return;
+  }
+
+  const user = getCurrentUserData();
+  el.profileCard.className = "profile-card";
+
+  const info = document.createElement("div");
+  const handle = document.createElement("strong");
+  handle.textContent = `@${user.username}`;
+  const email = document.createElement("small");
+  email.textContent = user.email;
+  const bio = document.createElement("small");
+  bio.textContent = user.bio || "No bio yet";
+
+  info.append(handle, document.createElement("br"), email, document.createElement("br"), bio);
+  el.profileCard.append(makeAvatar(user.username, user.avatar), info);
+}
+
+function renderFriends() {
+  el.friendList.innerHTML = "";
+  if (!state.currentUser) return;
+
+  const me = getCurrentUserData();
+  me.friends.forEach((friendName) => {
+    const friend = state.users[friendName];
+    const li = document.createElement("li");
+    li.className = "profile-card friend-item";
+
+    const name = document.createElement("span");
+    name.textContent = `@${friendName}`;
+    li.append(makeAvatar(friendName, friend?.avatar), name);
+    el.friendList.appendChild(li);
+  });
+}
+
+function renderPosts() {
+  el.posts.innerHTML = "";
+
+  state.posts.forEach((post) => {
+    const author = state.users[post.author] || {};
+    const card = document.createElement("article");
+    card.className = "post";
+
+    const header = document.createElement("div");
+    header.className = "post-header";
+    const authorCol = document.createElement("div");
+    const username = document.createElement("strong");
+    username.textContent = `@${post.author}`;
+    const meta = document.createElement("div");
+    meta.className = "meta";
+    meta.textContent = post.createdAt;
+    authorCol.append(username, meta);
+    header.append(makeAvatar(post.author, author.avatar), authorCol);
+
+    const text = document.createElement("p");
+    text.textContent = post.text;
+
+    const footer = document.createElement("div");
+    footer.className = "post-footer";
+    const likeBtn = document.createElement("button");
+    likeBtn.className = "like-btn";
+    likeBtn.dataset.like = post.id;
+    const liked = post.likes.includes(state.currentUser);
+    likeBtn.textContent = `${liked ? "Unlike" : "Like"} (${post.likes.length})`;
+    footer.appendChild(likeBtn);
+
+    if (post.author === state.currentUser) {
+      const deleteBtn = document.createElement("button");
+      deleteBtn.className = "delete-btn";
+      deleteBtn.dataset.delete = post.id;
+      deleteBtn.textContent = "Delete";
+      footer.appendChild(deleteBtn);
+    }
+
+    const comments = document.createElement("div");
+    comments.className = "comments";
+    (post.comments || []).forEach((comment) => {
+      const c = document.createElement("div");
+      c.className = "comment";
+      c.textContent = `@${comment.author}: ${comment.text}`;
+      comments.appendChild(c);
+    });
+
+    const commentRow = document.createElement("div");
+    commentRow.className = "comment-row";
+    const commentInput = document.createElement("input");
+    commentInput.placeholder = "Write a comment...";
+    const commentBtn = document.createElement("button");
+    commentBtn.textContent = "Comment";
+    commentBtn.className = "secondary";
+    commentBtn.addEventListener("click", () => addComment(post.id, commentInput));
+    commentRow.append(commentInput, commentBtn);
+
+    card.append(header, text, footer, comments, commentRow);
+    el.posts.appendChild(card);
+  });
 }
+
+function renderChat() {
+  el.chatWindow.innerHTML = "";
+  if (!state.currentUser) return;
+
+  const visible = state.chats.filter((msg) => msg.sender === state.currentUser || msg.to.includes(state.currentUser));
+  visible.forEach((msg) => {
+    const item = document.createElement("div");
+    item.className = "chat-message";
+
+    const message = document.createElement("div");
+    message.textContent = `${msg.sender}: ${msg.message}`;
+    const meta = document.createElement("div");
+    meta.className = "meta";
+    meta.textContent = msg.createdAt;
+
+    item.append(message, meta);
+    el.chatWindow.appendChild(item);
+  });
+
+  el.chatWindow.scrollTop = el.chatWindow.scrollHeight;
+}
+
+function renderAll() {
+  renderProfile();
+  renderFriends();
+  renderPosts();
+  renderChat();
+}
+
+el.signupBtn.addEventListener("click", createOrUpdateUser);
+el.loginBtn.addEventListener("click", loadProfile);
+el.logoutBtn.addEventListener("click", logout);
+el.addFriendBtn.addEventListener("click", addFriend);
+el.postBtn.addEventListener("click", addPost);
+el.sendChatBtn.addEventListener("click", sendChat);
+
+el.posts.addEventListener("click", (event) => {
+  const target = event.target;
+  if (!(target instanceof HTMLElement)) return;
+  if (target.dataset.like) toggleLike(target.dataset.like);
+  if (target.dataset.delete) deletePost(target.dataset.delete);
+});
+
+loadState();
+setStatus(state.currentUser ? `Welcome back @${state.currentUser}` : "No user logged in.");
+renderAll();
 
EOF
)
