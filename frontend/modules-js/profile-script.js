async function logout(url = "http://localhost:5000/logout") {
     const response = await fetch(url, 
        { method: "POST" })
    };

//------------username on user profile----------
var user= document.cookie
    .split("; ")
    .find((row) => row.startsWith("userCookie="))
    ?.split("=")[1];

const username = document.querySelector(".username");
username.innerHTML=user;



