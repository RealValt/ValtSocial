function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value;
  if (text === "") return;

  let post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <p>${text}</p>
    <button onclick="likePost(this)">❤️ Like</button>
  `;

  document.getElementById("posts").prepend(post);
  input.value = "";
}

function likePost(button) {
  button.innerText = "❤️ Liked";
}
