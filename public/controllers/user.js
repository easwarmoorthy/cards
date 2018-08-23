const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require('path');
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

const UserSchema = mongoose.Schema({
  fullName: String,
  displayName: String,
  email: String,
  password: String,
  verified: Boolean,
  cards: {
    type: Array,
    default: [],
  },
});

const userModel = mongoose.model("user",UserSchema);

exports.register = function(req, res){
  res.sendFile(path.join(__dirname,"../views/register.html"));
}

exports.registerUser = function(req, res){
  console.log(req.body);
  let user = req.body;
  console.log("Regiter user", user);
  let newUser = new userModel({
    fullName: user.fullName,
    displayName: user.displayName,
    email: user.email,
    password: user.password,
  });

  newUser.save(function(err,doc){
    if (err) return handleError(err);
    console.log(doc);
    res.send("User Registered");
  });
}

exports.loginUser = function(req, res){
  let user = req.body;
  console.log("Login user", user);

  userModel.find({ $and: [{ email: user.email}, {password: user.password}] }, function(err, doc){
    if (err) return handleError(err);
    console.log(doc);
    res.send("User Logged");
  });
}
