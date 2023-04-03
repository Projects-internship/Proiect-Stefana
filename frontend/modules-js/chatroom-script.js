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
    chatroomsJSON.forEach(chatroom => {
        const listItem = document.createElement('li');
        listItem.textContent = chatroom.groupname;
        listItem.value = chatroom.group_id;
        listItem.onclick = function Chatroom() {
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
                  socket.emit('chat server', { message: input.value, roomName, roomId: chatroom.group_id });
                  input.value = '';
                }
              });
    
            // join a room
            socket.emit('join chat', {roomName, roomId: chatroom.group_id});  
                   
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

//chat---------
socket.on('chat client', function(msg){
  console.log('Mesaj primit')
  console.log(msg)
    const newMsg=document.createElement('li');
    newMsg.textContent=`${msg.owner}: ${msg.message}`; 
    const messages=document.getElementById('messages');
    messages.appendChild(newMsg);
    window.scrollTo(0,document.body.scrollHeight);
   
}) 