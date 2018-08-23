var app = angular.module("userApp",[]);

app.controller("userCtrl",["$scope", "$http", "$window", function($scope,$http, $window){
  $scope.registerUser = function(regUser){
    console.log(regUser);
    $http({
      url: "/register",
      method: "POST",
      data: regUser
    }).then(function onSuccess(response){
      console.log(response.data);
    }).catch(function onError(response){});
  };

  $scope.loginUser = function(logUser){
    console.log(logUser);
    $http({
      url: "/login",
      method: "POST",
      data: logUser
    }).then(function onSuccess(response){
      console.log(response.data);
      if(response.data){
        alert("User Logged In");
        $window.location.href = "/cards";
      }
      else{
        alert("Invalid Credentials");
      }
    }).catch(function onError(response){});
  };
}]);

app.controller("followCtrl",["$scope", "$http", "$window", function($scope,$http, $window){
  $scope.searchedUsers = [];
  $scope.searchUsers = function(searchName){
    console.log(searchName);
    $http({
      url: "/search-user",
      method: "GET",
      params: {searchName:searchName},
    }).then(function onSuccess(response){
      console.log(response.data);
      $scope.searchedUsers = response.data;
    }).catch(function onError(response){});
  };

  $scope.sendRequest = function(user){
    console.log(user._id);
    $http({
      url: "/request-user",
      method: "POST",
      data: user
    }).then(function onSuccess(response){
      console.log(response.data);
    }).catch(function onError(response){});
  };

  $scope.requestedUsers = [];
  $scope.getRequestedUsers = function(){
    $http({
      url: "/requests",
      method: "GET",
    }).then(function onSuccess(response){
      console.log(response.data);
      $scope.requestedUsers = response.data;
    }).catch(function onError(response){});
  };
  $scope.getRequestedUsers();

  $scope.acceptUser = function(user){
    console.log(user);
    let id = user._id;
    $http({
      url: "/accept-user",
      method: "POST",
      data: {id: id}
    }).then(function onSuccess(response){
      console.log(response.data);
    }).catch(function onError(response){});
  };

  $scope.followers = [];
  $scope.getFollowers = function(){
    $http({
      url: "/followers",
      method: "GET",
    }).then(function onSuccess(response){
      console.log("Followers",response.data);
      $scope.followers = response.data;
    }).catch(function onError(response){});
  };
  $scope.getFollowers();

  $scope.followingUsers = [];
  $scope.getFollowingUsers = function(){
    $http({
      url: "/following",
      method: "GET",
    }).then(function onSuccess(response){
      console.log("Following", response.data);
      $scope.followingUsers = response.data;
    }).catch(function onError(response){});
  };
  $scope.getFollowingUsers();
}]);
