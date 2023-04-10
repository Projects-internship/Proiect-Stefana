async function getUsers(){
    const url='/get-users';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    const usersJSON = await response.json();
    console.log(usersJSON);

    const userList=document.getElementById('users');
    usersJSON.forEach(user => {
        const userItem=document.createElement('li');
        userItem.innerHTML=user.username;
        userList.appendChild(userItem);
    }
    );

}

