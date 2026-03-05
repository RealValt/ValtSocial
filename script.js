let currentUser = "";
let currentPic = "";

function setUser() {
  let name = document.getElementById("username").value.trim();
  let pic = document.getElementById("profilePic").value.trim();
  if(name === "") return alert("Enter a username!");
  currentUser = name;
  currentPic = pic || "https://via.placeholder.com/40";
  document.getElementById("userSection").style.display = "none";
}

function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value.trim();
  if(text === "") return alert("Write something!");
  let post = document.createElement("div");
  post.className = "post";
  post.innerHTML = `<strong>${currentUser}</strong>: ${text}`;
  document.getElementById("posts").prepend(post);
  input.value = "";
}
