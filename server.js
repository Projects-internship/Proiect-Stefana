const http= require('http');
const express= require('express');
const app= express(); 
const server= http.createServer(app);
const dotenv = require('dotenv');
 

const path = require('path');
const mysql= require('mysql')

const { Server }= require('socket.io');
const io = new Server(server);

const bodyParser= require('body-parser');
app.use(bodyParser.json());

const cors=require('cors');

//--------socket.io--------


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});



//--------------------
server.listen(5000,() => {
  console.log('listening on: 5000...')
});

//--------------------

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend/style')));
app.use(express.static(path.join(__dirname, 'frontend/html')));
app.use(express.static(path.join(__dirname, 'frontend/modules-js')));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());;
app.use(cors());

//-------DATABASE-------

  const  db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'dawnair',
    user:'root',
    password:''
  });

db.connect(function(error){
  if(error)
  {
    console.log(error);
  }
  else{
    console.log("Connection to DB: Sucess!")
  }
})

//---------GET AND POST-----------



app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/frontend/html/index.html')
  });
 
app.post('/login', (req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const email= req.body.email;


  db.query("SELECT * FROM `users` WHERE username = ? AND password = ? AND email = ?",
  [username, password,email],
  (err,result)=>{
    if(result.length > 0){
      res.setHeader('Set-Cookie', 'isLoggedin=true');
      //res.cookie("cookie name", cookievalue, ) // !!!!!
      res.redirect('/chatrooms');
      console.log('User logged in!');
      } 
      else {
        res.redirect('/wrongUser');
      }
  })
})

app.post('/logout', (req, res) => {
  res.clearCookie('isLoggedin');
  res.redirect('/loggedout');
  console.log('User logged out');
});

app.get('/loggedout',(req,res)=>{
  res.status(200).sendFile(__dirname + '/frontend/html/loggedout.html')
});

app.get('/wrongUser',(req,res)=>{
    res.status(200).sendFile(__dirname + '/frontend/html/wrongUser.html')
});

app.get('/chatrooms', (req, res) => {
    res.status(200).sendFile(__dirname + '/frontend/html/chat.html')
});

app.get('/profile', (req, res) => {
    res.status(200).sendFile(__dirname + '/frontend/html/profile.html')
});

app.get('/to-do-list', (req, res) => {
    res.status(200).sendFile(__dirname + '/frontend/html/todo.html')
});

  //-----404 response-----

app.all('*',(req,res)=> {
    res.status(404).send('<h1>Resource not found!</h1>')
})
  




