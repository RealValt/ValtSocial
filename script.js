let currentUser = "";
let currentPic = "";

// Set username and profile pic
function setUser() {
  let name = document.getElementById("username").value.trim();
  let pic = document.getElementById("profilePic").value.trim();
  if(name === "") return alert("Enter a username!");
  currentUser = name;
  currentPic = pic || "https://via.placeholder.com/40"; // default pic
  document.getElementById("userSection").style.display = "none";
}

// Add a new post
function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value.trim();
  if(text === "") return alert("Write something!");

  // Create post element
  let post = document.createElement("div");
  post.className = "post";
  post.innerHTML = `
    <div class="postHeader">
      <img src="${currentPic}" class="avatar">
      <strong>${currentUser}</strong>
    </div>
    <p>${text}</p>
    <button onclick="likePost(this)">❤️ Like</button>
  `;

  // Add to top of feed
  document.getElementById("posts").prepend(post);
  input.value = "";
}

// Like button functionality
function likePost(button) {
  button.innerText = "❤️ Liked";
}
