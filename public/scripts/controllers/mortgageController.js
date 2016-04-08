myApp.controller('MortgageController', ['$scope', '$location', 'DataFactory', function($scope, $location, DataFactory) {

  // check to see if the user is logged in
  if (!DataFactory.factoryIsUserLoggedIn()) {
    // redirect to login and display message letting user know they have to log in to see the content
    DataFactory.factorySetReminderMessageToTrue();
    $location.path('./views/templates/login.html');
  }
  console.log('MortgageController works');
  $scope.dataFactory = DataFactory;
  $scope.results = false;

  $scope.interestRate = 3.7;
  // use search results price for default mortgage price:
  $scope.price = $scope.dataFactory.factoryExportPrice();

  // I commented these out for now so that it doesn't throw errors
  // I'm using the mortgage calculator to test some of the evaluate equations, since they need to do similar things
  // I also changed the functions in the data factory so that they take in months, instead of years. That way I can
  // use them in the evaluate controller
  // -Alex

  // use search price for default mortgage price:
  //$scope.apiResults = $scope.dataFactory.factoryExportApiSearchResults();
  //    console.log($scope.apiResults.zestimate[0].amount[0]._);

  //$scope.price = Math.round($scope.apiResults.zestimate[0].amount[0]._);
  //$filter('currency')(git .price);
  //$scope.price = 0;
  //
  //console.log($scope.price);
  //
  //
  //$scope.calculateMortgage = function() {
  //  $scope.months = $scope.years * 12;
  //  $scope.dataFactory.factoryCalculateMortgage(parseFloat($scope.price), $scope.months, $scope.interestRate);
  //  $scope.mortgage = $scope.dataFactory.factoryExportMortgage();


   //use search results photo, if not exist use stock photo:
  if ($scope.dataFactory.factoryGetPhotos() == undefined){
    $scope.image = '../../images/mpls-1.jpg';
    $scope.imageDetails = true;
  } else {
    $scope.image = $scope.housePhoto = $scope.dataFactory.factoryGetPhotos()[0];
  }
  console.log($scope.image);
  console.log($scope.dataFactory.factoryGetPhotos());


  $scope.calculateMortgage = function() {
    $scope.dataFactory.factoryCalculateMortgage(parseFloat($scope.price), parseInt($scope.years), parseFloat($scope.interestRate));
    $scope.monthlyPayments = $scope.dataFactory.factoryExportMortgage();
    $scope.totalCost = $scope.monthlyPayments * parseFloat($scope.years) * 12 ;
    $scope.results = true;
  };
}]);