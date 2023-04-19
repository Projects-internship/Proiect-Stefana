async function getToDoList() {
  const url = "/get-user-to-do-list";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const todolistJSON = await response.json();
    console.log(todolistJSON);

    if (todolistJSON) {
      const todoList = document.querySelector("#todo-list");
      todoList.innerHTML = "";
      todolistJSON.forEach((todo) => {
        const listItem = document.createElement("li");
        listItem.value = todo.list_id;

        const input = document.createElement("input");
        input.type = "text";
        input.value = todo.list_item;
        input.id = "inputToDoItem";
        listItem.appendChild(input);

        input.addEventListener("input", (event) => {
          const input = event.target;
          const text = input.value;
          if (text.length > 0) {
            fetch(`/edit-to-do-list-item/${listItem.value}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputVal: text,
              }),
            })
              .then((response) => {
                console.log("Todo EDITED");
              })
              .catch((error) => {
                console.error(error);
              });
          }
        });

        input.addEventListener("blur", (event) => {
          const text = event.target.value;
          if (text.length === 0) {
            fetch(`delete-to-do-list-item/${listItem.value}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputVal: text,
              }),
            })
              .then((response) => {
                console.log("Todo DELETED");
              })
              .catch((error) => {
                console.error(error);
              });
            listItem.remove();
          }
        });

        //create DELETE TO-DO button
        const btn = document.createElement("button");
        btn.className = "closeButton";
        btn.style.background = "transparent";
        btn.style.border = "none";
        btn.style.width = "30px";
        btn.style.height = "30px";
        btn.style.cursor = "pointer";
        listItem.appendChild(btn).innerText = " X ";

        todoList.appendChild(listItem);

        // delete item from list
        const closeButton = document.getElementsByClassName("closeButton");
        for (let i = 0; i < closeButton.length; i++) {
          closeButton[i].onclick = function deleteToDo() {
            const element = this.parentElement;
            element.style.display = "none";
            //---------------------------FETCH DELETE
            fetch(`/delete-to-do-list-item/${element.value}`, {
              method: "DELETE",
            })
              .then((response) => {
                console.log("Todo DELETED");
              })
              .catch((error) => {
                console.error(error);
              });
          };
        }

        const sendBtn = document.querySelector("#btn3");
        sendBtn.onclick = function addnewToDo() {
          const list = document.querySelector(".li");
          const inputVal = document.querySelector("#inputToDo").value;
          const newInput = document.createElement("li");
          if (inputVal === "") {
            console.log("Write a to do, be productive! :)");
          } else {
            if (inputVal) {
              console.log("Todo: " + inputVal);
              const userID = todo.user_id;
              // console.log(userID)
              //---------------------------FETCH ADD
              fetch("/add-to-do-list-item", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  inputVal: inputVal,
                  userID: userID,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Todo ADDED");
                  newInput.value = data.list_id;

                  const input = document.createElement("input");
                  input.type = "text";
                  input.value = inputVal;
                  input.id = "inputToDoItem";
                  newInput.appendChild(input);

                  input.addEventListener("input", (event) => {
                    const input = event.target;
                    const text = input.value;
                    if (text.length > 0) {
                      fetch(`/edit-to-do-list-item/${newInput.value}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          inputVal: text,
                        }),
                      })
                        .then((response) => {
                          console.log("Todo EDITED");
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  });

                  input.addEventListener("blur", (event) => {
                    const text = event.target.value;
                    if (text.length === 0) {
                      fetch(`delete-to-do-list-item/${newInput.value}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          inputVal: text,
                        }),
                      })
                        .then((response) => {
                          console.log("Todo DELETED");
                        })
                        .catch((error) => {
                          console.error(error);
                        });

                      newInput.remove();
                    }
                  });

                  //create DELETE TO-DO button
                  const btn = document.createElement("button");
                  btn.className = "closeButton";
                  btn.style.background = "transparent";
                  btn.style.border = "none";
                  btn.style.width = "30px";
                  btn.style.height = "30px";
                  btn.style.cursor = "pointer";
                  btn.innerText = " X ";
                  newInput.appendChild(btn);

                  // delete item from list
                  btn.onclick = function deleteToDo() {
                    const element = this.parentElement;
                    element.style.display = "none";
                    //---------------------------FETCH DELETE
                    fetch(`/delete-to-do-list-item/${element.value}`, {
                      method: "DELETE",
                    })
                      .then((response) => {
                        console.log("Todo DELETED");
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  };
                })
                .catch((error) => {
                  console.error(error);
                });

              document.querySelector("#todo-list").appendChild(newInput);
            }
          }
        };
      });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
  }
}

const sendBtn = document.querySelector("#btn3");
sendBtn.onclick = function addnewToDo() {
  const inputVal = document.querySelector("#inputToDo").value;
  const newInput = document.createElement("li");
  if (inputVal === "") {
    console.log("Write a to do, be productive! :)");
  } else {
    if (inputVal) {
      console.log("Todo: " + inputVal);
      //---------------------------FETCH ADD
      let userID;
      fetch("/get-user-ID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          userID = data[0].user_id;
          console.log("User ID is: " + userID);

          fetch("/add-to-do-list-item", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputVal: inputVal,
              userID: userID,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Todo ADDED");
              newInput.value = data.list_id;

              const input = document.createElement("input");
              input.type = "text";
              input.value = inputVal;
              input.id = "inputToDoItem";
              newInput.appendChild(input);

              input.addEventListener("input", (event) => {
                const input = event.target;
                const text = input.value;
                if (text.length > 0) {
                  fetch(`/edit-to-do-list-item/${newInput.value}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      inputVal: text,
                    }),
                  })
                    .then((response) => {
                      console.log("Todo EDITED");
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                } else if (text.length === 0) {
                  fetch(`/delete-to-do-list-item/${newInput.value}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      inputVal: text,
                    }),
                  })
                    .then((response) => {
                      console.log("Todo DELETED");
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              });

              input.addEventListener("blur", (event) => {
                const text = event.target.value;
                if (text.length === 0) {
                  fetch(`delete-to-do-list-item/${newInput.value}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      inputVal: text,
                    }),
                  })
                    .then((response) => {
                      console.log("Todo DELETED");
                    })
                    .catch((error) => {
                      console.error(error);
                    });

                  newInput.remove();
                }
              });

              //create DELETE TO-DO button
              const btn = document.createElement("button");
              btn.className = "closeButton";
              btn.style.background = "transparent";
              btn.style.border = "none";
              btn.style.width = "30px";
              btn.style.height = "30px";
              btn.style.cursor = "pointer";
              btn.innerText = " X ";
              newInput.appendChild(btn);

              // delete item from list
              btn.onclick = function deleteToDo() {
                const element = this.parentElement;
                element.style.display = "none";
                //---------------------------FETCH DELETE
                fetch(`/delete-to-do-list-item/${element.value}`, {
                  method: "DELETE",
                })
                  .then((response) => {
                    console.log("Todo DELETED");
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              };

              document.querySelector("#todo-list").appendChild(newInput);
            })

            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};
