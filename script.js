function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value;

  if (text === "") return;

  let newPost = document.createElement("div");
  newPost.className = "post";
  newPost.innerText = text;

  document.getElementById("posts").prepend(newPost);
  input.value = "";
}
