//jshint esversion:6
require('dotenv').config()
const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require("express");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
//const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;


mongoose.connect('mongodb://localhost:27017/userDB' , {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const userSchema = new mongoose.Schema({
  email : String,
  password : String
});


//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const User = mongoose.model('User' , userSchema);


app.get('/' , function(req , res)
{
  res.render('home');
});


app.get('/register' , function(req , res)
{
  res.render('register');
});

app.get('/login' , function(req , res)
{
  res.render('login');
});


app.post('/register' , function(req , res)
{


  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const userEmail = req.body.username;
    const userPassword = hash;

    const newUser = new User({
      email : userEmail,
      password : userPassword
    });

    newUser.save(function(err)
  {
    if(!err) res.render('secrets');
    else console.log(err);
  });
});

});


app.post('/login' , function(req , res)
{
  const userEmail = req.body.username;
  const userPassword = req.body.password;


  User.findOne({email : userEmail} , function(err , foundUser)
{
  if(!err)
  {
    if(foundUser)
    {
      bcrypt.compare(userPassword, foundUser.password, function(err, result) {
        if(result == true) res.render('secrets');
              else console.log("Wrong Password!!");
       });
    }
    else console.log("User not found! First register yourself");
  }
  else console.log(err);
});
});


app.listen(3000 , function()
{
  console.log("Server started at port 3000");
});
