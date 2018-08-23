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
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  requests:{
    type: Array,
    default: [],
  },
});

const userModel = mongoose.model("user",UserSchema);

exports.register = function(req, res){
  res.sendFile(path.join(__dirname,"../views/register.html"));
};

exports.registerUser = function(req, res){
  console.log(req.body);
  let user = req.body;
  let newUser = new userModel(user);
  console.log("User obj befoer saving", user);
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
    console.log(doc.length);
    if(doc.length == 0){
      res.send(false);
      return false;
    }else{
        req.session.userId = doc[0]._id;
        req.session.key = "cardkey";
        res.send(true);
      }
  });
};

exports.logoutUser = (req,res) => {
  req.session.destroy();
  res.send("Logged Out");
};

exports.searchUserPage = function(req, res){
  res.sendFile(path.join(__dirname,"../views/search-users.html"));
};

exports.searchUser = function(req, res){
  let searchName = req.query.searchName;
  console.log(searchName);
  userModel.find(
    { displayName: { "$regex": searchName, "$options": "i" } },
    {fullName:1, displayName:1},
    function(err, users){
      if (err) return handleError(err);
      console.log(users);
      res.send(users);
  });
};

exports.requestUser = function(req, res){
  console.log("requestUser",req.body);
  let reqId = req.body._id, userId = req.session.userId;
  userModel.findByIdAndUpdate({_id: reqId},{ $push: { requests: userId } },function(err,doc){
    if (err) return handleError(err);
    console.log(doc);
    res.send("Requested");
  });
};

exports.getRequests = function(req, res){
  console.log("requests",req.body);
  let userId = req.session.userId;
  let requests = [];
  userModel.findOne({_id: userId},{ requests:1 },function(err,userRequests){
    if (err) return handleError(err);
    console.log("Requests Ids",userRequests);
    requests = userRequests.requests;
    console.log(requests);
    let allRequests = [];
    console.log("Next");
    let arr = requests.map(function(o){ return mongoose.Types.ObjectId(o); });
    console.log(arr);
    userModel.find({ _id: {
      $in: requests.map(function(o){ return mongoose.Types.ObjectId(o); })
    } }, function(err,user){
      if (err) return handleError(err);
      console.log(user);
      res.send(user);
    });
  });
};

exports.getRequestPage = function(req, res){
  console.log("Request Page");
  res.sendFile(path.join(__dirname,"../views/request-page.html"));
};

/**
 *Accept User accepting user adds following and follwers in respective user ids.
 */
exports.acceptUser = function(req, res){
  console.log(req.body);
  let followingUser = req.body.id;
  let userId = req.session.userId;
  userModel.update({_id: userId},{ $push: { followers:  followingUser} }, {new: true},function(err,doc){
    if (err) return handleError(err);
    console.log("followers",doc);
      userModel.update({_id: userId}, {$pull: { requests: followingUser }}, {new: true},function(err,doc){
        console.log("requests",doc);
      });

    userModel.update({_id: followingUser},{ $push: { following:  userId} }, {new: true},function(err,user){
      if (err) return handleError(err);
      console.log("following",user);
      res.send("Updated");
    });
  });
};

exports.getFollowers = function(req, res){
  let userId = req.session.userId;
  userModel.findOne({_id:userId},{followers:1},function(err, user){
    if (err) return handleError(err);
    console.log("followers ID", user);
    console.log(user.followers);
    userModel.find({ _id: {
      $in: user.followers.map(function(o){ return mongoose.Types.ObjectId(o); })
    } },{ fullName:1, displayName:1 }, function(err,follwers){
      if (err) return handleError(err);
      console.log("Followers Data",follwers);
      res.send(follwers);
    });
  });
};

exports.getFollowingUsers = function(req, res){
  let userId = req.session.userId;
  userModel.findOne({_id:userId},{following:1}, function(err, user){
    if (err) return handleError(err);
    console.log("following ID", user);
    console.log(user.following);
    userModel.find({ _id: {
      $in: user.following.map(function(o){ return mongoose.Types.ObjectId(o); })
    } },{ fullName:1, displayName:1 }, function(err,followingUsers){
      if (err) return handleError(err);
      console.log("Following Users",followingUsers);
      res.send(followingUsers);
    });
  });
};

const CardSchema = mongoose.Schema({
  title: String,
  description: String,
  tag: String,
  options:{
    type: Array,
    default: [],
  },
});

const cardModel = mongoose.model("cards",CardSchema);

exports.getCardPage = function(req, res){
  res.sendFile(path.join(__dirname,"../views/card.html"));
};

exports.addCard = function(req, res){

  console.log(req.body);
  let card = req.body;
  let newCard = new cardModel(card);
  console.log("Card obj befoer saving", card);
  newCard.save(function(err, addedCard){
    if (err) return handleError(err);
    console.log("Card ", addedCard);
    userModel.findByIdAndUpdate({_id: req.session.userId},{ $push: { cards: addedCard._id } },function(err,doc){
      if (err) return handleError(err);
      res.send("Card Added");
    });
  });

};

exports.getCards = function(req,res){
  console.log("Get Cards");
  userModel.find({_id: req.session.userId}).populate('cards').exec(function(err, cards){
    if (err) return handleError(err);
    console.log(cards);
    res.send(cards[0].cards);
  });
};

let handleError = function(err){
  console.log("Got an error", err);
}
