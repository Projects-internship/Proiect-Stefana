function createChat() {
    const chatName = document.getElementById('chat-name').value;
    //validation
    fetch(`/check-groupchat/${chatName}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          // creation
          fetch(`/create-groupchat/${chatName}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatName })
          })
            .then(response => response.json())
            .then(data => {
              if (data.affectedRows > 0) {
                const placeholder = document.querySelector(".placeholder-chat");
                placeholder.innerHTML = "Group chat created!";
                setTimeout(hideElement, 2000);
                
                function hideElement() {
                  placeholder.innerHTML = "";
                }
                
                const chatroomsList = document.querySelector("#chats");
                const listItem = document.createElement("li");
                listItem.textContent = chatName;
                listItem.id = chatName;
                chatroomsList.appendChild(listItem);
              } else {
                const placeholder = document.querySelector(".placeholder-chat");
                placeholder.innerHTML = "Group chat could not be created!";

                setTimeout(hideElement, 2000); 
                function hideElement() {
                placeholder.innerHTML = "";
                }
              }
            });
        } else {
          const placeholder = document.querySelector(".placeholder-chat");
          placeholder.innerHTML = "Group chat already exists!";
          setTimeout(hideElement, 2000); 
            function hideElement() {
                placeholder.innerHTML = "";
                }
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

            setTimeout(hideElement, 2000); 
            function hideElement() {
                placeholder.innerHTML = "";
                }
        }
        else{
            const placeholder=document.querySelector(".placeholder-user");
            placeholder.innerHTML = "User could not be added!";
            setTimeout(hideElement, 2000); 
            function hideElement() {
                placeholder.innerHTML = "";
                }
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
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if(data.affectedRows>0){
            const placeholder=document.querySelector(".placeholder-delete-chat");
            placeholder.innerHTML = "Groupchat deleted!";

            setTimeout(hideElement, 2000);
            function hideElement() {
                placeholder.innerHTML = "";
                }

            document.getElementById(chatName).remove();

        }
        else{
            const placeholder=document.querySelector(".placeholder-delete-chat");
            placeholder.innerHTML = "Groupchat could not be deleted!";
            setTimeout(hideElement, 2000); 
            function hideElement() {
                placeholder.innerHTML = "";
                }
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

            setTimeout(hideElement, 2000);
            function hideElement() {
                placeholder.innerHTML = "";
                }
        }
        else{
            const placeholder=document.querySelector(".placeholder-delete-user");
            placeholder.innerHTML = "User could not be deleted!";
            setTimeout(hideElement, 2000);
            function hideElement() {
                placeholder.innerHTML = "";
                }
        }
    });
}

async function getChatrooms() {
    const url = "/get-all-groupchats";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const chatroomsJSON = await response.json();
    console.log(chatroomsJSON);
  
    const chatroomsList = document.querySelector("#chats");
    chatroomsList.innerHTML = "";
  
    chatroomsJSON.forEach((chatroom) => {
      const listItem = document.createElement("li");
      listItem.textContent = chatroom.groupname;
      listItem.value = chatroom.group_id;
      listItem.id=chatroom.groupname;
      chatroomsList.appendChild(listItem);
})
}

async function getUsers() {
    const url = "/get-all-users";
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
  
    const usersList = document.querySelector("#users");
    usersList.innerHTML = "";
  
    usersJSON.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.textContent = user.username;
      listItem.value = user.user_id;
      usersList.appendChild(listItem);
})
}

