fetch("/get-admin-users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({}),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.length > 0) {
      const admin = document.getElementById("admin");
      admin.innerHTML = "Admin";
      admin.onclick = function () {
        window.location.href = "/admin";
      };
    }
  })
  .catch((error) => {
    console.log(error);
  });
