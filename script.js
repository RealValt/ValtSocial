function loadPosts() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach(text => createPost(text));
}

function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value;
  if (text === "") return;

  createPost(text);

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift(text);
  localStorage.setItem("posts", JSON.stringify(posts));

  input.value = "";
}

function createPost(text) {
  let post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <p>${text}</p>
    <button onclick="likePost(this)">❤️ Like</button>
  `;

  document.getElementById("posts").appendChild(post);
}

function likePost(button) {
  button.innerText = "❤️ Liked";
}

window.onload = loadPosts;
