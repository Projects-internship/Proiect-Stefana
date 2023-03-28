//// cross out to-do
const crossOutBtn= document.querySelector("ul");
crossOutBtn.addEventListener('click',(e)=>{
  if(e.target.tagName ==='LI') {
    e.target.classList.toggle('checked');}
})

//create close button
const list = document.getElementsByTagName("li");
for (let i = 0; i < list.length; i++) {
  const btn = document.createElement("button");
  btn.className = "closeButton";
  btn.style.background="transparent";
  btn.style.border="none";
  btn.style.width="30px";
  btn.style.height="30px";
  btn.style.cursor="pointer";
  list[i].appendChild(btn).innerText=" X ";
}

//add new to-do
function addNewToDo(){
  const list= document.querySelector(".li");
  const inputVal= document.querySelector("#inputToDo").value;
  const newInput= document.createElement("li");
  if (inputVal === '') {
      alert("Write a to do, be productive! :)");
    } else {
      const btn = document.createElement("button");
      btn.className = "closeButton";
      btn.style.background="transparent";
      btn.style.border="none";
      btn.style.width="30px";
      btn.style.height="30px";
      btn.style.cursor="pointer";
      document.querySelector("#todo-list").appendChild(newInput).innerText=inputVal;
      newInput.appendChild(btn).innerText=" X ";
      btn.onclick = function() {
        const element = this.parentElement;
        element.style.display = "none";
      }
    }
  }

document.querySelector("#inputToDo").value = "";    

// delete item from list
const closeButton = document.getElementsByClassName("closeButton");
for (let i = 0; i < closeButton.length; i++) {
  closeButton[i].onclick = function() {
    const element = this.parentElement;
    element.style.display = "none";
  }
}
