var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

var inputbar, addButton, updateButton, deleteButton, clearButton;

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/adminView', {
            templateUrl: 'views/admin.html',
            controller: 'AppController'
        })
        .when('/gridView', {
            templateUrl: 'views/grid.html',
            controller: 'AppController'
        })
        .otherwise ({
            redirectTo: '/adminView'
        });
});

myApp.controller('AppController', ['$scope', '$http', function($scope, $http) {

    console.log("This is the controller");
    
    $scope.$on('$routeChangeSuccess', function() {
        inputbar        = document.getElementById("inputBar")
        addButton       = document.getElementById("addButton").parentNode;
        updateButton    = document.getElementById("updateButton").parentNode;
        deleteButton    = document.getElementById("deleteButton").parentNode;
        clearButton     = document.getElementById("clearButton").parentNode;
        
    });

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
        
        inputbar.classList.add('show');
        
        addButton.removeAttribute("style");
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        clearButton.style.display = 'none';
        
    };

    $scope.enterUpdateMode = function(){
        
        inputbar.classList.add('show');
        
        addButton.style.display = 'none';
        updateButton.removeAttribute("style");
        deleteButton.removeAttribute("style");
        clearButton.style.display = 'block';
        
    };

    $scope.exitAddUpdateMode = function(){

        inputbar.classList.remove('show');
        
        setTimeout(function(){
            addButton.style.display = 'none';
            updateButton.style.display = 'none';
            deleteButton.style.display = 'none';
            clearButton.style.display = 'none';
        }, 300);

        $scope.clearInputs();
    };

}]);

