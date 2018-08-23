var app = angular.module("cardApp",[]);

app.controller("cardCtrl",["$scope", "$http", "$window", function($scope,$http, $window){


  $scope.card = {};
  $scope.card.options = [];
  $scope.addOption = function(option){
    $scope.card.options.push(option);
  }
  $scope.addCard = function(card){
    console.log(card);
    $http({
      url: "/card",
      method: "POST",
      data: card
    }).then(function onSuccess(response){
      console.log(response.data);
    }).catch(function onError(response){});
  };

  $scope.getCards = function(){
    $http({
      url: "/getcards",
      method: "GET",
    }).then(function onSuccess(response){
      console.log(response.data);
      $scope.cards = response.data;
    }).catch(function onError(response){});
  };
  $scope.getCards();

}]);
