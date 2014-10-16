/* jslint node: true */
'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngTable']).
  controller('AppCtrl', function ($scope, HonDBService) {
    HonDBService.getDBStatus().success(function(data){
      $scope.DBStatus = data.connection;
    });
  }).
  controller('dashboardCtrl', function($scope, $filter, HeroService, ItemService, HonDBService, ngTableParams){
    
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

    if($scope.$parent.DBStatus > 0){
      
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            sorting: {
              name: 'asc' // initial sorting
            },
            filter: {
              name: ''
            }
        }, {
          total: 1,
          getData: function($defer, params) {
            HonDBService.getHeroes().then(function(data){

              var filteredData = params.filter() ?
                      $filter('filter')(data.data.rows, params.filter()) :
                      data.data.rows;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      data.data.rows;

              params.total(orderedData.length); // set total for recalc pagination
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
        });
    }
    
  }).

  controller('heroCtrl', function($scope, $location){
    if($scope.$parent.DBStatus > 0){

      $scope.hero = $location.search().name;
      // TODO      
    }else{
      // should redirect to dashboard
    }
  });
