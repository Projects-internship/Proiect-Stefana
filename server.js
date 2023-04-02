const http = require('http');
const express = require('express');
var cookie = require('cookie');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const { Server } = require('socket.io');

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
const chatRooms = {};

io.on('connection', (socket) => {
  let currentRoom = null;
  const cookies = cookie.parse(socket.handshake.headers.cookie);

  // joining
  socket.on('join room', (roomName) => {

    if (!chatRooms[roomName]) {
      chatRooms[roomName] = [];
    }

    if (currentRoom !== null) {
      const index = chatRooms[currentRoom].indexOf(socket);
      if (index !== -1) {
        chatRooms[currentRoom].splice(index, 1);
      }
      socket.leave(currentRoom);
    }

    chatRooms[roomName].push(socket);
    socket.join(roomName);
    currentRoom = roomName;
  });
  
  

  // sending the message
  socket.on('chat message', ({ message, timestamp }) => {
    const owner = cookies.userCookie;
    timestamp = new Date().toISOString();
    const messageObj = { message, owner, timestamp };
    if (chatRooms[currentRoom]) {
      chatRooms[currentRoom].forEach((socket) => {
        socket.emit('chat message', messageObj);
      });
    }
  });

  //leaving the room
  socket.on('leave chat', () => {
    if (currentRoom !== null && chatRooms[currentRoom]) {
      const index = chatRooms[currentRoom].indexOf(socket);
      if (index !== -1) {
        chatRooms[currentRoom].splice(index, 1);
      }
      currentRoom = null;
    }
  });

});


//-------DATABASE-------

//Initial aveam o conexiune creata, apoi am facut switch la pool

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
})

//---------GET AND POST-----------
app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/index.html')
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  db.query("SELECT * FROM `users` WHERE username = ? AND password = ? AND email = ?",
    [username, password, email],
    (err, result) => {
      if (result.length > 0) {
        //-----------cookie-------------
        res.cookie('userCookie', username);
        //-------------------------------
        res.redirect('/chatrooms');
        console.log(`User logged in!`);
      }
      else {
        res.redirect('/wrongUser');
      }
    })
})

app.post('/logout', (req, res) => {
  res.clearCookie('userCookie');
  res.clearCookie('emailCookie');
  console.log('User logged out!');
  res.redirect('/loggedout');
});

app.get('/loggedout', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/loggedout.html')
});

app.get('/wrongUser', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/wrongUser.html')
});

app.get('/chatrooms', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/chat.html')
});

app.get('/profile', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/profile.html')

  //handlebars with node and express???
});

app.get('/to-do-list', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/todo.html')
});

app.post('/get-user-data', async (req,res)=>{
  const user= req.cookies.userCookie

  db.query("SELECT user_id, username, email, phone, position, birthday FROM `users` WHERE username = ? LIMIT 1", [user],
        (err,result)=>{
          if(result.length>0){
            res.json({
              userId: result[0].user_id,
              username: result[0].username,
              email: result[0].email,
              phone: result[0].phone,
              position: result[0].position,
              birthday: result[0].birthday
            })
          }
          else {
            res.json({error: err})
          }
        })
})

app.post('/get-user-chatrooms', async(req, res) => {  
  const user = req.cookies.userCookie;

  db.query( "SELECT DISTINCT g.group_id, g.groupname FROM `groupchat` g, `users` u, `user_in_group` ug WHERE u.user_id=ug.user_id AND  g.group_id=ug.group_id AND u.username= ?",
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

//-----404 response-----
app.all('*', (req, res) => {
  res.status(404).send('<h1>Resource not found!</h1>')
})

//--------------------

server.listen(5000, () => {
  console.log('listening on: 5000...')
});

