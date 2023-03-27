
const socket=io();

function chatroom(){
    const placeholder= document.querySelector('.placeholder-msg')
     placeholder.remove();
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

    socket.on('chat message', function(msg){
        const newMsg=document.createElement('li');
        newMsg.textContent=`: ${msg}`;
        const messages=document.getElementById('messages');
        messages.appendChild(newMsg);
        window.scrollTo(0,document.body.scrollHeight);
    }
    )

}




    



