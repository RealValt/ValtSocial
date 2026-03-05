let currentUser = "";
let currentPic = "";

function setUser() {
  let name = document.getElementById("username").value.trim();
  let pic = document.getElementById("profilePic").value.trim();
  if(name === "") return alert("Enter a username!");
  currentUser = name;
  currentPic = pic || "https://via.placeholder.com/40"; // default pic
  document.getElementById("userSection").style.display = "none";
}
