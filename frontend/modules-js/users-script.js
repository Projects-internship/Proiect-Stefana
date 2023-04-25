async function getUsers() {
  const url = "/get-users";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const usersJSON = await response.json();
  console.log(usersJSON);

  const userList = document.getElementById("users");
  usersJSON.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.innerHTML = user.username;
    userItem.value = user.user_id;
    userList.appendChild(userItem);
    userItem.onclick = function userProfile() {
      console.log(userItem.value);
      localStorage.setItem("profileID", userItem.value);
      window.location.href = `/userProfile`;
    };
  });
}

const searchBar=document.getElementById('userSearch');
searchBar.addEventListener("input", (e)=>{
  const searchString=e.target.value.toLowerCase();
    const user=document.querySelectorAll('li');
    const userArray=Array.from(user);
    userArray.forEach(function(user){
        const userName=user.textContent;
        if(userName.toLowerCase().includes(searchString)){
          user.style.display="block";
        }else{
          user.style.display="none";
        }
    })
});
