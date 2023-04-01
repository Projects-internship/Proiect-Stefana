async function logout(url = "/logout") {
    const response = await fetch(url,
        { method: "POST" });
    if (response.redirected) {
        window.location.href = response.url;
    }
}

//------------username on user profile----------
    const user = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userCookie="))
        ?.split("=")[1];

    const username = document.querySelector(".username");
    username.innerHTML = user;

//------------data in user profile-----------------

async function getData(){
    let url='/get-user-data';
    const response= await fetch(url,
        {method:"POST",
        headers: 
        {'Accept': '*',
        'Content-Type': 'application/json'},
        body: JSON.stringify( 
            { 
              username: username,
              email: email,
              position: position,
              birthday: birthday
            }
        ) 
    })
    const userJSON = await response.json();

    const birthdayList= document.querySelector("#birthday");
    birthdayList.innerHTML=userJSON.birthday;

    const emailList= document.querySelector("#email");
    emailList.innerHTML=userJSON.email;

    const positionList= document.querySelector("#position");
    positionList.innerHTML=userJSON.position;

    const phoneList= document.querySelector("#phone");
    phoneList.innerHTML=userJSON.phone;

}

