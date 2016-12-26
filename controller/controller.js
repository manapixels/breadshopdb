var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/adminView', {
            templateUrl: 'views/admin.html',
            controller: 'AppController'
        })
        .when('/customerView', {
            templateUrl: 'views/customer.html',
            controller: 'AppController'
        })
        .otherwise ({
            redirectTo: '/adminView'
        });
});

myApp.controller('AppController', ['$scope', '$http', function($scope, $http) {

    console.log("This is the controller");

    var refresh = function() {
        $http.get('/breadlist')
            .then(function successCallback(response) {
                console.log("Received GET response");
                $scope.breadlist = response.data;
                delete $scope.bread;
            });
    };

    refresh();

    $scope.addBread = function() {
        console.log($scope.bread);
        $scope.bread.stock = parseInt($scope.bread.stock);
        $http.post('/breadlist', $scope.bread)
            .then(function successCallback(response) {
                console.log(response);
                $scope.exitAddUpdateMode();
            refresh();
            });
    };

    $scope.deleteBread = function(id) {
        console.log(id);
        $http.delete('/breadlist/' + id)
            .then(function successCallback(response) {
                console.log(response);
                $scope.exitAddUpdateMode();
            refresh();
            });
    };

    $scope.editBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
                $scope.enterUpdateMode();
            });
    };

    $scope.updateBread = function() {
        console.log($scope.bread._id);
        $http.put('/breadlist/' + $scope.bread._id, $scope.bread)
            .then(function successCallback(response) {
                console.log(response);
                $scope.exitAddUpdateMode();
                refresh();
            });
    };

    $scope.plusBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
                $scope.bread.stock  = parseInt($scope.bread.stock) + 1;
                $scope.updateBread(id);
            });

    };

    $scope.minusBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
                $scope.bread.stock  = parseInt($scope.bread.stock) - 1;
                $scope.updateBread(id);
            });

    };
    
    $scope.clearInputs = function() {
        delete $scope.bread;
    };

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.enterAddMode = function(){
        var bar = document.getElementById("inputBar");
        var addButton = document.getElementById("addButton");
        var updateButton = document.getElementById("updateButton");
        var deleteButton = document.getElementById("deleteButton");
        var clearButton = document.getElementById("clearButton");
        bar.style.display = 'block';
        addButton.style.display = 'block';
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        clearButton.style.display = 'none';
    };

    $scope.enterUpdateMode = function(){
        var bar = document.getElementById("inputBar");
        var addButton = document.getElementById("addButton");
        var updateButton = document.getElementById("updateButton");
        var deleteButton = document.getElementById("deleteButton");
        var clearButton = document.getElementById("clearButton");
        bar.style.display = 'block';
        addButton.style.display = 'none';
        updateButton.style.display = 'block';
        deleteButton.style.display = 'block';
        clearButton.style.display = 'block';
    };

    $scope.exitAddUpdateMode = function(){
        var bar = document.getElementById("inputBar");
        var addButton = document.getElementById("addButton");
        var updateButton = document.getElementById("updateButton");
        var deleteButton = document.getElementById("deleteButton");
        var clearButton = document.getElementById("clearButton");
        bar.style.display = 'none';
        addButton.style.display = 'none';
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        clearButton.style.display = 'none';

        $scope.clearInputs();
    };

    
}]);

