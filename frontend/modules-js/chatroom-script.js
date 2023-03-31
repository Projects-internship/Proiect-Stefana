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

//--send messages w/ socket.io-----

const socket=io();

function chatroom(){
     const content=document.querySelector('.content')
     content.remove();
     const form= document.createElement("form");
     form.setAttribute('id','myform');
     const input=document.createElement("input");
     const button=document.createElement("button");
     button.setAttribute('id','mybtn');
     button.innerHTML="Send!";
     button.type="submit";
     document.querySelector(".chatroom").appendChild(form).appendChild(input);
     document.querySelector(".chatroom").appendChild(form).appendChild(button);

     form.addEventListener('submit',function(e){
        e.preventDefault();
        if(input.value){
            socket.emit('chat message', input.value);
            input.value = '';
        }
    })
//-------username for messages-------
    var user= document.cookie
    .split("; ")
    .find((row) => row.startsWith("userCookie="))
    ?.split("=")[1];

    socket.on('chat message', function(msg){
        console.log(msg);
        const newMsg=document.createElement('li');
        // newMsg.textContent=`${user}: ${msg}`;  ///DE INTREBAT 
        newMsg.textContent=`${msg.owner}: ${msg.message}`; 
        const messages=document.getElementById('messages');
        messages.appendChild(newMsg);
        window.scrollTo(0,document.body.scrollHeight);
    }
    )
}
//-------------------



    



