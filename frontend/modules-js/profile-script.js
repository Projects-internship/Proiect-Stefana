//------------data in user profile-----------------

async function getData() {
  let url = "/get-user-data";
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

  Phone.addEventListener("click", () => {
    Phone.contentEditable = "true";
    Phone.focus();
  });

  Phone.addEventListener("blur", () => {
    Phone.contentEditable = "false";
    fetch(`/edit-user-phone/${Phone.innerHTML}`,
    {method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: Phone.innerHTML }),
  })
    .then((response) => response.json())
    .then((data) => {
    })
    .catch((error) => {
      console.log(error);
    });
  });

  const Hobby = document.querySelector("#hobby");
  Hobby.innerHTML = userJSON.hobby;

  Hobby.addEventListener("click", () => {
    Hobby.contentEditable = "true";
    Hobby.focus();
  });

  Hobby.addEventListener("blur", () => {
    Hobby.contentEditable = "false";
    fetch(`/edit-user-hobby/${Hobby.innerHTML}`,
    {method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hobby: Hobby.innerHTML }),
    })
    .then((response) => response.json())
    .then((data) => {
    })
    .catch((error) => {
      console.log(error);
    });
  });
}
