const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require('path');
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

const CardSchema = mongoose.Schema({
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
const cardSchema = mongoose.model("card", CardSchema);
