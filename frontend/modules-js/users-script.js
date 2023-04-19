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
