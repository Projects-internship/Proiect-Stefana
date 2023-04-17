const socket=io();
//-------------get user Chatrooms---------
async function getChatrooms(){
    const url = '/get-user-chatrooms';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const chatroomsJSON = await response.json();
    console.log(chatroomsJSON);

    const chatroomsList = document.querySelector("#chats");
    chatroomsList.innerHTML = '';

    let selectedItem = null;

    chatroomsJSON.forEach(chatroom => {
        const listItem = document.createElement('li');
        listItem.textContent = chatroom.groupname;
        listItem.value = chatroom.group_id;
        listItem.onclick = function Chatroom() {
            
          if (selectedItem) {
            selectedItem.style.color = '';
            selectedItem.style.fontWeight = '';
          }
            listItem.style.color='#330033';
            listItem.style.fontWeight='bold';
            
            selectedItem = listItem;

            document.querySelector('#messages').innerHTML = '';
            const roomName = chatroom.groupname; 
  
            const content = document.querySelector('.content');
            //check if the content(=placeholder) has been removed, if not remove it
            if (content) {
              content.remove();
            }
            const formCheck = document.querySelector("#myform");
            const buttonCheck = document.querySelector("#mybtn");

            //check if the form and button are there, if they are, remove them
            if (formCheck) {
              formCheck.remove();
              buttonCheck.remove();
            }

            //css+html elements in js
            const form = document.createElement("form");
            form.setAttribute('id', 'myform');
            const input = document.createElement("input");
            const button = document.createElement("button");
            button.setAttribute('id', 'mybtn');
            button.innerHTML = "Send!";
            button.type = "submit";
            document.querySelector(".chatroom").appendChild(form).appendChild(input);
            document.querySelector(".chatroom").appendChild(form).appendChild(button);
          
            //event listener for when senging a message + what room you are sending it to
            form.addEventListener('submit', function (e) {
              e.preventDefault();
              if (input.value) {
                console.log('Sending message:', input.value);
                console.log('Room name:', roomName);
                let timestamp= new Date();
                const message = input.value; 
                socket.emit('chat server', { message: message, roomName, roomId: chatroom.group_id, userID: chatroom.user_id, timestamp: timestamp });
                fetch('/add-message', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    message: message, 
                    userID: chatroom.user_id,
                    timestamp: timestamp,
                    groupID: chatroom.group_id
                  })
                })
                .then(response => {
                  console.log("Message ADDED");
                })
                .catch(error => {
                  console.error(error);
                });
              }
            });
    
            // join a room
            socket.emit('join chat', {roomName, roomId: chatroom.group_id});
            
            fetch('/display-group-messages', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  groupID: chatroom.group_id
                  })
                })
                .then(response => {
                  return response.json();
                }
                )
                .then(data => {
                  console.log(data);
                  data.forEach(message => {
                    
              //-----------DELETE BUTTON----------------
                const deleteButton = document.createElement('button');
                deleteButton.className = "deleteButton";
                deleteButton.style.background="transparent";
                deleteButton.style.border="none";
                deleteButton.style.width="30px";
                deleteButton.style.height="30px";
                deleteButton.style.cursor="pointer";
                deleteButton.innerHTML = " X ";

              //-----------ADD MSG TO TO-DO LIST----------------
                const todoButton = document.createElement('button');
                todoButton.className = "addButton";
                todoButton.style.background="transparent";
                todoButton.style.border="none";
                todoButton.style.width="30px";
                todoButton.style.height="30px";
                todoButton.style.cursor="pointer";
                todoButton.innerHTML = " ➤ ";
                  
                const newMsg = document.createElement('li');
                const ownerSpan = document.createElement('span');
                ownerSpan.textContent = `${message.username}: `;
                ownerSpan.style.fontSize = '1.6rem'; 
                newMsg.appendChild(ownerSpan);
                newMsg.innerHTML += message.content; 
                const messages = document.getElementById('messages');
                newMsg.id = message.message_id;
                messages.appendChild(newMsg);

                //---------appending the delete button to the message

                const user = document.cookie
                .split("; ")
                .find((row) => row.startsWith("userCookie="))
                ?.split("=")[1];
      
                if(message.username===user) {newMsg.appendChild(deleteButton); }
                //-------------------------------------------------
                newMsg.appendChild(todoButton);
                window.scrollTo(0,document.body.scrollHeight);


                deleteButton.onclick = function DeleteMessage() {
                  const url='/delete-message';
                  fetch(url, {
                    method: 'DELETE',
                    headers: {
                      'Accept': '*',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      messageID: message.message_id
                    })
                  })
                  .then(response => {
                    console.log("Message DELETED");
                    socket.emit('messageDeleted', { messageID: message.message_id });
                  })
                  .catch(error => {
                    console.error(error);
                  });
                  const newMsg=document.getElementById(message.message_id);
                  newMsg.remove();
                }

                  todoButton.onclick = function AddToTodo() { 
                    const url='/add-message-to-do-list-item';
                    fetch(url, {
                      method: 'PUT',
                      headers: {
                        'Accept': '*',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        inputVal: message.content
                      })
                    })
                    .then(response => {
                      console.log("Message ADDED TO TODO");
                    })
                    .catch(error => {
                      console.error(error);
                    });
                  }

                  });
                })
                .catch(error => {
                  console.error(error);
                });           
          }
        chatroomsList.appendChild(listItem);
    });
}

//------CHATROOM LISTS------
const list = document.getElementsByTagName("li");
for (let i = 0; i < list.length; i++) {
 //delete button
  const btn = document.createElement("button");
  btn.className = "closeButton";
  btn.style.background="transparent";
  btn.style.border="none";
  btn.style.width="30px";
  btn.style.height="30px";
  btn.style.cursor="pointer";
  btn.style.color="white";
  list[i].appendChild(btn).innerText=" X ";

  //edit button / options
  const btn2 = document.createElement("button");
  btn2.className = "closeButton";
  btn2.style.background="transparent";
  btn2.style.border="none";
  btn2.style.width="30px";
  btn2.style.height="30px";
  btn2.style.cursor="pointer";
  btn2.style.color="white";
  list[i].appendChild(btn2).innerText=" ⋮ ";
}

//---------chat---------
socket.on('chat client', function(msg){
  //-----------DELETE BUTTON----------------
  const deleteButton = document.createElement('button');
  deleteButton.className = "deleteButton";
  deleteButton.style.background="transparent";
  deleteButton.style.border="none";
  deleteButton.style.width="30px";
  deleteButton.style.height="30px";
  deleteButton.style.cursor="pointer";
  deleteButton.innerHTML = " X ";

  //-----------ADD MSG TO TO-DO LIST----------------
  const todoButton = document.createElement('button');
  todoButton.className = "deleteButton";
  todoButton.style.background="transparent";
  todoButton.style.border="none";
  todoButton.style.width="30px";
  todoButton.style.height="30px";
  todoButton.style.cursor="pointer";
  todoButton.innerHTML = " ➤ ";

  console.log('Mesaj primit')
    const newMsg = document.createElement('li');
    const ownerSpan = document.createElement('span');
    ownerSpan.textContent = `${msg.owner}: `;
    ownerSpan.style.fontSize = '1.6rem'; 
    newMsg.appendChild(ownerSpan);
    newMsg.innerHTML += msg.message; 
    const messages = document.getElementById('messages');
    newMsg.id = msg.message_id;
    messages.appendChild(newMsg);
    //---------appending the delete button to the message
    const user = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userCookie="))
    ?.split("=")[1];

    if(msg.owner===user) {newMsg.appendChild(deleteButton); }
    //-------------------------------------------------
    newMsg.appendChild(todoButton);
    window.scrollTo(0,document.body.scrollHeight);

    deleteButton.onclick = function DeleteMessage() {
      const url='/delete-message';
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageID: msg.message_id
        })
      })
      .then(response => {
        console.log("Message DELETED");
        socket.emit('messageDeleted', { messageID: msg.message_id });
      })
      .catch(error => {
        console.error(error);
      });
      const newMsg=document.getElementById(msg.message_id);
      newMsg.remove();
    }
  
      todoButton.onclick = function AddToTodo() { 
        const url='/add-message-to-do-list-item';
        fetch(url, {
          method: 'PUT',
          headers: {
            'Accept': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userID: msg.user_id,
            inputVal: msg.message
          })
        })
        .then(response => {
          console.log("Message ADDED TO TODO");
        })
        .catch(error => {
          console.error(error);
        });
      } 
     
}) 

socket.on('messageDeleted', function(data) {
  const newMsg=document.getElementById(data.messageID);
  newMsg.remove();
});