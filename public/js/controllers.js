'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http, HonDBService) {
    HonDBService.getDBStatus().success(function(data){
      $scope.DBStatus = data.connection;
    });
  }).
  controller('dashboardCtrl', function($scope, $http, HeroStatsService, HonDBService){
    
    $scope.generateDB = function(){ //Fetch data, generate SQL, create DB
      
      $scope.start = 1; //Display progress bar
      $scope.progress_message = 'Generating SQL from heroesofnewerth.com ...';
      
      $http({
        method: 'GET',
        url: '/api/heroes'
      }).
      success(function (data, status, headers, config) {

        var completed_requests = 0;
        var progress_bar = 0;
        var hero_count = data.heroes.length;
        var sql = new Object();
        sql.autoIncr = data.heroes.length+1;
        sql.insertHeroes = [];
        sql.insertHeroStats = [];

        for(var i=0;i<data.heroes.length;i++){ // Loop through hero data and create sql statement fragments
           HeroStatsService.getHeroStats(data.heroes[i]).
           then(function(data) {
             
             // Append to array insert statement fragments
             sql.insertHeroes.push('("'+data.hero.id+'","'+addslashes(data.hero.name)+'","'+addslashes(data.hero.type)+'", "'+addslashes(data.hero.icon)+'",'+(completed_requests+1)+')');
             sql.insertHeroStats.push('('+(completed_requests+1)+', '+data.hero.stats[0]+', "'+data.hero.stats[1]+'", '+data.hero.stats[2]+', '+data.hero.stats[3]+', "'+data.hero.stats[5]+'", "'+data.hero.stats[6]+'", "'+data.hero.stats[7]+'", '+data.hero.stats[9]+', '+data.hero.stats[8]+', '+data.hero.stats[10]+')');
             
             completed_requests++;
             progress_bar=Math.ceil((completed_requests/hero_count)*90); // Calculate the progress % of requests needed to generate sql, reserve 10% for executing SQL
             $scope.progress = progress_bar;
             $scope.progress_message = 'Generating '+addslashes(data.hero.name)+'...'; // Update progress message for each hero generated

             if(completed_requests == hero_count){
               /* Run Generated SQL */
               $scope.progress_message = 'Creating and Populating Database...';
               HonDBService.createDB(sql).then(function(data){
                 $scope.progress=100; // Assign 100% when DB update complete (remaining 10%)
                 $scope.progress_message = 'Completed!';
               });
             }
           });
        }
      }).
      error(function (data, status, headers, config) {
        $scope.heroes = 'Error!'; // TODO
      });
    }
    
    function addslashes(string) { // Bootleg character escaping :S
        return string.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    }
  });
