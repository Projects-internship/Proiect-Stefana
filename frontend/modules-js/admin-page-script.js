function createChat(){
    const chatName = document.getElementById('chat-name').value;
    fetch(`/create-groupchat/${chatName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({chatName})
            })
            .then(response => response.json())
            .then(data => {
                if(data.affectedRows>0){
                const placeholder=document.querySelector(".placeholder-chat");
                placeholder.innerHTML = "Chat created!";
                }
                else{
                const placeholder=document.querySelector(".placeholder-chat");
                placeholder.innerHTML = "Chat could not be created!";
                }
            });
}

function addUserToGroup(){
    const chatName = document.getElementById('user-chat-name').value;
    const userName = document.getElementById('user-name').value;
    fetch(`/add-user-to-group/${chatName}/${userName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({chatName, userName})
    })
    .then(response => response.json())
    .then(data => {
        if(data.affectedRows>0){
            const placeholder=document.querySelector(".placeholder-user");
            placeholder.innerHTML = "User added!";
        }
        else{
            const placeholder=document.querySelector(".placeholder-user");
            placeholder.innerHTML = "User could not be added!";
        }
    });
}

function deleteGroupChat(){
    const chatName = document.getElementById('delete-chat').value;
    console.log(chatName);
    fetch(`/delete-groupchat/${chatName}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({chatName})
    })
    .then(response => response.json())
    .then(data => {
        if(data.affectedRows>0){
            const placeholder=document.querySelector(".placeholder-delete-chat");
            placeholder.innerHTML = "Chat deleted!";
        }
        else{
            const placeholder=document.querySelector(".placeholder-delete-chat");
            placeholder.innerHTML = "Chat could not be deleted!";
        }
    });
}

function deleteUser(){
    const userName = document.getElementById('delete-user-in-group').value;
    const groupName=document.getElementById('group-of-user').value;
    fetch(`/delete-user/${userName}/${groupName}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userName})
    })
    .then(response => response.json())
    .then(data => {
        if(data.affectedRows>0){
            const placeholder=document.querySelector(".placeholder-delete-user");
            placeholder.innerHTML = "User deleted!";
        }
        else{
            const placeholder=document.querySelector(".placeholder-delete-user");
            placeholder.innerHTML = "User could not be deleted!";
        }
    });
}
