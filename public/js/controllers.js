/* jslint node: true */
'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngTable', 'ngDragDrop']).
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
            var data = {};
            HonDBService.getHeroes(data).then(function(data){

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

  controller('heroCtrl', function($scope, $location, $filter, HonDBService, DisplayService, ngTableParams){
    if($scope.$parent.DBStatus > 0){
      
      // Items slot is empty by default
      $scope.itemSlot = [];
      
      // Limit number of items in Item slot to 6
      $scope.limitList = {
        accept: function(dragEl) {
          if ($scope.itemSlot.length >= 6) {
            return false;
          } else {
            return true;
          }
        }
      };
      
      // Remove Item from Items slot
      $scope.RemoveItem = function(index){ $scope.itemSlot.splice(index, 1); }
      
      // Add Item to Items slot (on click)
      $scope.AddItem = function(item){ $scope.itemSlot.push(item); }
      
      // Display Item effects
      $scope.ItemEffects = function(item){ return DisplayService.ItemEffects(item); }
      
      
      /* Hero Data */
      var data = {"id": $location.search().id}; // Get the hero's id from query string
      HonDBService.getHeroes(data).then(function(data){
         $scope.hero = data.data.rows[0];
      });
      
      /* Item Table */
      $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 5,           // count per page
            sorting: {
              name: 'asc' // initial sorting
            },
            filter: {
              name: ''
            }
        }, {
          total: 1,
          getData: function($defer, params) {
            HonDBService.getItems().then(function(data){
              
              var filteredData = params.filter() ?
                      $filter('filter')(data.data.rows, params.filter()) :
                      data.data.rows;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      data.data.rows;

              params.total(orderedData.length);
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
        });
      
    }else{
      // should redirect to dashboard
    }
    
  });