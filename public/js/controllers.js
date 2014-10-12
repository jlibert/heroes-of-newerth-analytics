/* jslint node: true */
'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, HonDBService) {
    HonDBService.getDBStatus().success(function(data){
      $scope.DBStatus = data.connection;
    });
  }).
  controller('dashboardCtrl', function($scope, HeroService, ItemService, HonDBService){
    
    $scope.generateDB = function(){ //Fetch data, generate SQL, create DB
      
      HonDBService.createDB().then(function(data){
        if(data.data.success === false){
          $scope.progress_message = 'Failed to update database!';
          return;
        }
        
        $scope.start = 1; //Display progress bar
        $scope.progress_message = 'Generating SQL from heroesofnewerth.com ...';
        
        HeroService.createHeroes($scope, HeroService, HonDBService);
        ItemService.createItems($scope, ItemService, HonDBService);
      });
    }
  });
