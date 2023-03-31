const http = require('http');
const express = require('express');
var cookie = require('cookie');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
app.use(bodyParser.json());
app.use(CookieParser());

const cors = require('cors');

//--------------------
server.listen(5000, () => {
  console.log('listening on: 5000...')
});

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
io.on('connection', (socket) => {
  var cookies = cookie.parse(socket.handshake.headers.cookie)
      
  socket.on('chat message', (msg) => {
    let aux = {
      message: msg,
      owner: cookies.userCookie,
      timestamp: new Date().toISOString()
    }
    io.emit('chat message', aux);
  });
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

  //handlebars with node and express
});

app.get('/to-do-list', (req, res) => {
  res.status(200).sendFile(__dirname + '/frontend/html/todo.html')
});


app.post('/user-data', async (req,res)=>{
  // var cookies = cookie.parse(socket.handshake.headers.cookie)
  // const user = cookies.userCookie;

  const user= req.cookies.userCookie

  db.query("SELECT user_id, username, email,phone, position,birthday FROM `users` WHERE username = ? LIMIT 1", [user],
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


//-----404 response-----
app.all('*', (req, res) => {
  res.status(404).send('<h1>Resource not found!</h1>')
})


