async function getUserData() {
  const userId = localStorage.getItem("profileID");
  let url = `/get-user-profile-data/${userId}}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "*", "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const userJSON = await response.json();

  const Username = document.querySelector(".username");
  Username.innerHTML = userJSON.username;

  const BirthDay = document.querySelector("#birthday");
  BirthDay.innerHTML = userJSON.birthday;

  const Email = document.querySelector("#email");
  Email.innerHTML = userJSON.email;

  const Position = document.querySelector("#position");
  Position.innerHTML = userJSON.position;

  const Phone = document.querySelector("#phone");
  Phone.innerHTML = userJSON.phone;

  const Hobby = document.querySelector("#hobby");
  Hobby.innerHTML = userJSON.hobby;
}
window.onbeforeunload = function () {
  localStorage.removeItem("profileID");
};
