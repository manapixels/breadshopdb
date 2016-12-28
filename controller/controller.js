var myApp = angular.module('myApp', ['ngRoute', 'ngFileUpload']);

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

myApp.controller('AppController', ['$scope', '$http', 'Upload', function($scope, $http, Upload) {

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
                $scope.breadlist = response.data;
                delete $scope.bread;
                console.log("RETRIEVE DB: success", response.data);
            });
    };

    refresh();

    $scope.addBread = function() {
        console.log($scope.bread);
        $scope.bread.stock = parseInt($scope.bread.stock);
        $http.post('/breadlist', $scope.bread)
            .then(function successCallback(response) {
                $scope.exitAddUpdateMode();
                refresh();
                console.log("ADD RECORD: success", response);
            });
    };

    $scope.deleteBread = function(id) {
        console.log(id);
        $http.delete('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.exitAddUpdateMode();
                refresh();
                console.log("DELETE RECORD: success", response);
            });
    };

    $scope.editBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
                $scope.$applyAsync;
                $scope.enterUpdateMode();
                console.log("RETRIEVE FOR EDITING: success", response.data);
            });
    };

    $scope.updateBread = function() {
        console.log($scope.bread._id);
        $http.put('/breadlist/' + $scope.bread._id, $scope.bread)
            .then(function successCallback(response) {
                $scope.exitAddUpdateMode();
                refresh();
                console.log("UPDATE RECORD: success", response);
            });
    };

    $scope.plusBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
                $scope.bread.stock  = parseInt($scope.bread.stock) + 1;
                $scope.updateBread(id);
                console.log("ADD BREAD: success");
            });

    };

    $scope.minusBread = function(id) {
        console.log(id);
        $http.get('/breadlist/' + id)
            .then(function successCallback(response) {
                $scope.bread = response.data;
                $scope.bread.stock  = parseInt($scope.bread.stock) - 1;
                $scope.updateBread(id);
                console.log("MINUS BREAD: success");
            });

    };

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
        console.log("SORTED", propertyName);
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

        delete $scope.bread;
    };
    
    
    $scope.upload = function (file, bread_id) {
        Upload.upload({
            url: '/uploads/' + bread_id,
            data: {file: file},
            method: 'POST'
        }).then(function (resp) {
            console.log('UPLOADED: ' + resp.data[0] + ' to ' + resp.data[1]);
            $scope.reinitBreadlist();   
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    
    $scope.reinitBreadlist = function() {
        var orig = $scope.breadlist;
        $scope.breadlist = []; // triggers a $digest
        $scope.breadlist = orig;
    };

    
    
}]);