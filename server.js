const http = require('http');
const express = require('express');
const cookie = require('cookie');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const bycrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.use(CookieParser());

//--------------------

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend/style')));
app.use(express.static(path.join(__dirname, 'frontend/html')));
app.use(express.static(path.join(__dirname, 'frontend/modules-js')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());;
app.use(cors());

//---socket.io
let chatRooms = {};

io.on('connection', (socket) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie);

  // joining
  socket.on('join chat', (roomObject)=>{
    console.log('Join')
    if(chatRooms.roomId){
      // socket.removeAllListeners()
      socket.leave(chatRooms.roomId);
    }
    chatRooms = {
      ...roomObject
    }
    socket.join(roomObject.roomId);
    console.log(chatRooms);
  });
  
  // sending the message
  socket.on('chat server', (request) => {
    console.log(request)
    const owner = cookies.userCookie;
    let timestamp = new Date().toISOString();
    generateUniqueMessageId((err, message_id) => {
      if (err) {
        res.status(500).send(err);
      } else {
        const messageObj = { message_id, message: request.message, owner, timestamp, group_id: request.roomId, user_id: request.userID };
        if (chatRooms.roomId) {
          // socket.emit('chat message',messageObj);
          io.to(chatRooms.roomId).emit('chat client', messageObj);
        }
      }
    });
  });

  socket.on('disconnect', (request) => {
    // console.log('User disconnected');
  })

});

//-------DATABASE-------
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  database: 'dawnair',
  user: 'root',
  password: ''
});

db.connect(function (error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("Connection to DB: Sucess!")
  }
});


// db.query("SELECT user_id, password FROM users", function (error, results, fields) {
//   results.forEach(function (result) {
//     const id = result.id;
//     const password = result.password;
//     const mySalt=bycrypt.genSaltSync(10);
//     const myHash=bycrypt.hashSync(password, mySalt);
//     // console.log(myHash);
//     db.query("UPDATE users SET password = ? WHERE user_id = ?", [myHash, id], function (error, results, fields) {
//       if (error) {
//         console.log(error);
//       }
//     });
//   });
// });


//-------ROUTES-------
app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/index.html')
});

const session = {};

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  db.query("SELECT user_id, username, email FROM users WHERE username = ? AND password = ? AND email = ?",
    [username, password, email],
    (err, result) => {
      if (result.length > 0) {
        //-----------cookies-------------
        res.cookie('userCookie', username);
        const sessionId=uuidv4();
        session[sessionId] = {
          userId: result[0].id,
          username: result[0].username
        };
        res.cookie('sessionId', sessionId);       
        //-------------------------------
        res.redirect('/chatrooms');
        console.log(`User logged in!`);
      }
      else {
        res.redirect('/wrongUser');
      }
    })
});

app.post('/logout', (req, res) => {
  res.clearCookie('userCookie');
  res.clearCookie('sessionId');
  console.log('User logged out!');
  res.redirect('/loggedout');
});

app.get('/loggedout',(req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/loggedout.html')
});

app.get('/wrongUser', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/wrongUser.html')
});

app.get('/chatrooms', (req, res) => {
  const sessionId= req.cookies.sessionId;
  const userSession = session[sessionId];
  if(userSession){
    res.status(200).sendFile(__dirname + '/frontend/html/chat.html')
  }
  else {
    res.status(401).sendFile(__dirname + '/frontend/html/unauthorized.html');
    }
});

app.get('/profile', (req, res) => {
  const sessionId= req.cookies.sessionId;
  const userSession = session[sessionId];
  if(userSession){
    res.status(200).sendFile(__dirname + '/frontend/html/profile.html')
  }
  else {
    res.status(401).sendFile(__dirname + '/frontend/html/unauthorized.html');  
  }
});

app.get('/to-do-list', (req, res) => {
  const sessionId= req.cookies.sessionId;
  const userSession = session[sessionId];
  if(userSession){
    res.status(200).sendFile(__dirname + '/frontend/html/todo.html')
  }
  else {
    res.status(401).sendFile(__dirname + '/frontend/html/unauthorized.html');
  }
});

app.post('/get-user-data', async (req,res)=>{
  const user= req.cookies.userCookie

  db.query("SELECT user_id, username, email, phone, position, birthday, hobby FROM `users` WHERE username = ? LIMIT 1", [user],
        (err,result)=>{
          if(result.length>0){
            res.json({
              userId: result[0].user_id,
              username: result[0].username,
              email: result[0].email,
              phone: result[0].phone,
              position: result[0].position,
              birthday: result[0].birthday,
              hobby: result[0].hobby
            })
          }
          else {
            res.json({error: err})
          }
        })
});

//----------GET USER CHATROOMS------------
app.post('/get-user-chatrooms', async(req, res) => {  
  const user = req.cookies.userCookie;

  db.query( "SELECT DISTINCT u.user_id, g.group_id, g.groupname FROM `groupchat` g, `users` u, `user_in_group` ug WHERE u.user_id=ug.user_id AND  g.group_id=ug.group_id AND u.username= ?",
    [user],
    (err, result) => {
      if (err) {
        res.json({ error: err });
      } else if (result.length > 0) {
        res.json(result);
      } else {
        res.json({ error: 'User not found in any groups' });
      }
    }
  );
});

//----------GET USER TO-DO LISTS-------------
app.post('/get-user-to-do-list', async(req, res) => {  
  const user = req.cookies.userCookie;

  db.query( "SELECT DISTINCT l.user_id, l.list_id, l.list_item FROM `to_do_list` l, `users` u WHERE u.user_id=l.user_id AND u.username= ? ",
    [user],
    (err, result) => {
      if (err) {
        res.json({ error: err });
      } else if (result.length > 0) {
        res.json(result);
      } else {
        res.json({ error: 'No to do list item found!' });
      }
    }
  );
});

//---------DELETE TO-DO LIST ITEM-----------
app.delete('/delete-to-do-list-item/:listID', (req, res) => {
  const list_id = req.params.listID;
  console.log("TODO DELETED");
  db.query("DELETE FROM `to_do_list` WHERE list_id = ?", [list_id],
    (err,result)=>{
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
});

//---------ADD TO-DO LIST ITEM-----------
app.put('/add-to-do-list-item', (req, res) => {
  console.log("ADDED TODO");
  const userID = req.body.userID;
  const list_item = req.body.inputVal;
  generateUniqueListId((err, list_id) => {
    if (err) {
      res.status(500).send(err);
    } else {
      db.query("INSERT INTO `to_do_list` (`list_id`,`list_item`,`user_id`) VALUES (?,?,?)", [list_id,list_item, userID], (err,result)=>{
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.send({list_id: list_id});
        }
      });
    }
  });
});

app.put('/add-message-to-do-list-item', (req, res) => {
  console.log("ADDED TODO");
  const userID = req.body.userID;
  const list_item = req.body.inputVal;
  generateUniqueListId((err, list_id) => {
    if (err) {
      res.status(500).send(err);
    } else {
      db.query("INSERT INTO `to_do_list` (`list_id`,`list_item`,`user_id`) VALUES (?,?,?)", [list_id,list_item, userID], (err,result)=>{
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      });
    }
  });
});

// function generateUniqueListId(callback) {
//   const list_id = uuidv4();
//   db.query("SELECT COUNT(*) AS count FROM `to_do_list` WHERE `list_id` = ?", [list_id], (err, result) => {
//     if (err) {
//       console.error(err);
//       callback(err, null);
//     } else {
//       if (result[0].count > 0) {
//         // generate recursevely a new id if it's in the list
//         generateUniqueListId(callback);
//       } else {
//         //if unique, pass it back to the callback function
//         callback(null, list_id);
//       }
//     }
//   });
// }

function generateUniqueListId(callback) {
  db.query("SELECT MAX(`list_id`) AS max_id FROM `to_do_list`", (err, result) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      let list_id;
      if (result[0].max_id) {
        list_id = parseInt(result[0].max_id) + 1;
      } else {
        list_id = 1;
      }
      callback(null, list_id.toString());
    }
  });
}

//---------GET USER_ID-----------
app.post('/get-user-ID', async(req, res) => {  
  const user = req.cookies.userCookie;
  db.query( "SELECT user_id FROM `users` WHERE username= ?",
    [user],
    (err, result) => {
      if (err) {
        res.json({ error: err });
      } else if (result.length > 0) {
        res.json(result);
      } else {
        res.json({ error: 'User ID not found!' });
      }
    }
  );
});

//---------ADD MESSAGES--------------> WIP
app.put('/add-message', (req, res) => {
  const groupID=req.body.groupID;
  const userID = req.body.userID;
  const content = req.body.message;
  const timestamp=req.body.timestamp;
  generateUniqueMessageId((err, message_id) => {
    if (err) {
      res.status(500).send(err);
    } else {
      db.query("INSERT INTO `messages`(`message_id`,`content`,`user_id`,`timestamp`, `group_id`) VALUES (?,?,?,?,?)", [message_id,content, userID, timestamp, groupID], (err,result)=>{
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.send(result);
          console.log("Msg added to DB");
        }
      });
    }
  });
});

function generateUniqueMessageId(callback) {
  db.query("SELECT MAX(`message_id`) AS max_id FROM `messages`", (err, result) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      let message_id;
      if (result[0].max_id) {
        message_id = parseInt(result[0].max_id) + 1;
      } else {
        message_id = 1;
      }
      callback(null, message_id.toString());
    }
  });
}

//----------display MESSAGES-------------

app.put('/display-group-messages', async(req, res) => {  
  const groupID=req.body.groupID;
  db.query( "SELECT m.*, u.username FROM `messages` m, `users` u WHERE m.user_id=u.user_id AND m.group_id= ? ", [groupID], (err, result) => {
    if (err) {
      res.json({ error: err });
    } else if (result.length > 0) {
      res.json(result);
    } else {
      res.json({ error: 'No messages found!' });
    }
  });
});

//-----------delete message------------
app.delete('/delete-message', (req, res) => {
  const message_id = req.body.messageID;
  db.query("DELETE FROM `messages` WHERE message_id = ?", [message_id],
    (err,result)=>{
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(result);
        console.log("Message DELETED");
      }
    });
});

//-----404 response-----
app.all('*', (req, res) => {
  res.status(404).send('<h1>Resource not found!</h1>')
});

//--------------------
server.listen(5000, () => {
  console.log('listening on: 5000...')
});
