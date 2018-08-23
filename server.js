const express =  require("express");
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
var session = require('express-session');
// const userController = require("./controllers/user");

app.use(bodyParser.json());
app.use(express.static( __dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

dotenv.load({ path: '.env.Config' });
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

function IsAuthenticated(req, res, next) {
  console.log(req.session);
    if (req.session.userId) {
      console.log("Session ",req.session.userId);
        next();
    } else {
      console.log("Auth Checker",req.path);
      res.redirect("/register");
    }
}

const controller = require("./public/controllers/schema");

app.get("/register", controller.register);
app.post("/register",controller.registerUser);
app.post("/login",controller.loginUser);
app.get("/logout", controller.logoutUser);

app.get("/search-users", IsAuthenticated, controller.searchUserPage);
app.get("/search-user", IsAuthenticated, controller.searchUser);

app.post("/request-user", IsAuthenticated, controller.requestUser);
app.get("/requestpage", IsAuthenticated, controller.getRequestPage);
app.get("/requests", IsAuthenticated, controller.getRequests);

app.get("/followers", IsAuthenticated, controller.getFollowers);
app.get("/following", IsAuthenticated, controller.getFollowingUsers);
app.post("/accept-user", IsAuthenticated, controller.acceptUser);

app.get("/cards", IsAuthenticated, controller.getCardPage);
app.get("/getcards", IsAuthenticated, controller.getCards);
app.post("/card", IsAuthenticated, controller.addCard);




app.listen(3000);
