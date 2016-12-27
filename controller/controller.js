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

    $scope.btns = {
        addBtn: true,
        updateBtn: true,
        delBtn: true,
        clearBtn: true,
        cancelBtn: true
    };
    
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
                $scope.$applyAsync;
                console.log("editing bread", response.data);
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

        angular.element( document.querySelector( '#inputbar' ) ).addClass('show');
        
        $scope.btns = {
            addBtn: true,
            updateBtn: false,
            delBtn: false,
            clearBtn: true,
            cancelBtn: true
        };
        
    };

    $scope.enterUpdateMode = function(){
        
        angular.element( document.querySelector( '#inputbar' ) ).addClass('show');
        
        $scope.btns = {
            addBtn: false,
            updateBtn: true,
            delBtn: true,
            clearBtn: true,
            cancelBtn: true
        };
        
    };

    $scope.exitAddUpdateMode = function(){

        angular.element( document.querySelector( '#inputbar' ) ).removeClass('show');
        
        setTimeout(function(){
            $scope.btns = {
                addBtn: false,
                updateBtn: false,
                delBtn: false,
                clearBtn: false,
                cancelBtn: true
            };
            $scope.$apply();
        }, 300);

        $scope.clearInputs();
    };

}]);

