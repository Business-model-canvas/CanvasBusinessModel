var express = require('express');
var app = express();
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

app.listen(port, function(){
    console.log('app listening on port: '+port);
});