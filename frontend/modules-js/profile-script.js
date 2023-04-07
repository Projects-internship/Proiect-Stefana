

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
              birthday: birthday,
              hobby: hobby
            }
        ) 
    })
    const userJSON = await response.json();

    const BirthDay= document.querySelector("#birthday");
    BirthDay.innerHTML=userJSON.birthday;

    const Email= document.querySelector("#email");
    Email.innerHTML=userJSON.email;

    const Position= document.querySelector("#position");
    Position.innerHTML=userJSON.position;

    const Phone= document.querySelector("#phone");
    Phone.innerHTML=userJSON.phone;

    const Hobby= document.querySelector("#hobby");
    Hobby.innerHTML=userJSON.hobby;

}

