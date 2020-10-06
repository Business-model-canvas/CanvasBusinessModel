var express = require('express');
var app = express();
const http = require("http");
const socketIo = require("socket.io");
var bodyParser = require('body-parser');
var mysql = require('mysql');
var port = 8080;
const cors = require('cors');
app.use(cors());
// models
var models = require("./models");

//  Import routes
const google = require("./routes/google")
const apis = require('./routes/apis')
// Database Connection
models.sequelize.authenticate().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const passport = require('./passport');
// Passport Definition
app.use(passport.initialize());
app.use(passport.session());
// register routes

app.use('/apis', apis);
app.use('/', google)


// index path
app.get('/', function(req, res){
    console.log('app listening on port: '+port);
    res.send('tes express nodejs mysql')
});

// socket.io
const server = http.createServer(app);
const io = socketIo(server);

io.on('connect', (socket) => {
    console.log('socket connected');
    socket.on('join', ({ name, room }, callback) => {
        console.log('New user joined.');
  
    });
  
    socket.on('sendMessage', (message, callback) => {
        console.log('New message arrived. ', message);
        socket.broadcast.emit('refresh');
        socket.emit('refresh');
    });

    socket.on('reload_placeholders', ()=>{
        socket.broadcast.emit('reload');
        // socket.emit('reload');
    })
  
    socket.on('disconnect', () => {
        console.log('Socket has been disconnected.');
    })
  });


server.listen(port, function(){
    console.log('app listening on port: '+port);
});

