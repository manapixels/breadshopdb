var myApp = angular.module('myApp', ['ngRoute']);

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
        $http.post('/breadlist', $scope.bread)
            .then(function successCallback(response) {
                console.log(response);
            refresh();
            });
    };
    
    $scope.deleteBread = function(id) {
        console.log(id);
        $http.delete('/breadlist/' + id)
            .then(function successCallback(response) {
                console.log(response);
            refresh();
            });
    };
    
    $scope.editBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
            });
    };
    
    $scope.updateBread = function() {
        console.log($scope.bread._id);
        $http.put('/breadlist/' + $scope.bread._id, $scope.bread)
            .then(function successCallback(response) {
                console.log(response);
                refresh();
            });
    };
    
    $scope.clearInputs = function() {
        delete $scope.bread;
    };
    
}]);

