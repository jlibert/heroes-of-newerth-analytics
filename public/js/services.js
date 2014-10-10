/* jslint node: true */
'use strict';

/* Services */
angular.module('myApp.services', []).
  factory('HeroService', function ($http, $q) {
	    return {
          createHeroes: function($scope, HeroService, HonDBService){
            $http({
              method: 'GET',
              url: '/api/heroes'
            }).
            success(function (data) {
              var completed_requests = 0;
              var progress_bar = 0;
              var hero_count = data.heroes.length;
              var sql = {};
              sql.insertHeroes = '';
              
              for(var i=0;i<data.heroes.length;i++){ // Loop through hero data and create sql statement fragments
               HeroService.getHeroStats(data.heroes[i]).
               then(function(data) {
             
                 sql.insertHeroes += '("'+data.hero.id+'","'+addslashes(data.hero.name)+'","'+addslashes(data.hero.type)+
                                     '", "'+addslashes(data.hero.icon)+'", '+data.hero.stats[0]+', "'+data.hero.stats[1]+
                                         '", '+data.hero.stats[2]+', '+data.hero.stats[3]+', "'+data.hero.stats[5]+
                                         '", "'+data.hero.stats[6]+'", "'+data.hero.stats[7]+'", '+data.hero.stats[9]+
                                         ', '+data.hero.stats[8]+', '+data.hero.stats[10]+'), ';

                 completed_requests++;
                 progress_bar=Math.ceil((completed_requests/hero_count)*90); // Calculate the progress % of requests needed to generate sql, reserve 10% for executing SQL
                 $scope.progress = progress_bar;
                 $scope.progress_message = 'Generating '+addslashes(data.hero.name)+'...'; // Update progress message for each hero generated

                 if(completed_requests == hero_count){
                   $scope.progress_message = 'Creating and Populating Database...'; // Update progress message for database activity

                   // Remove trailing ',' from SQL fragment
                   sql.insertHeroes = sql.insertHeroes.substring(0, sql.insertHeroes.length - 2);

                   // Call database service
                   HonDBService.createHeroes(sql).then(function(data){
                     if(data.success === false){ /* TODO: handle progress and progress_message differently */ }
                     $scope.progress=100; // Assign 100% when DB update complete (remaining 10%)
                     $scope.progress_message = 'Completed!';
                   });
                 }
               });
              }
            }).
            error(function (data) {
              $scope.heroes = 'Error!'; // TODO
            });
          },
	        getHeroStats: function(hero) {
	            // the $http API is based on the deferred/promise APIs exposed by the $q service
	            // so it returns a promise for us by default
	            return $http({
                method: 'GET',
                url: '/api/hero-data',
                params: {id:hero.id, name: hero.name, icon:hero.icon, type:hero.type, url:hero.url}
              })
	                .then(function(response) {
	                    if (typeof response.data === 'object') {
	                        return response.data;
	                    } else {
	                        // invalid response
	                        return $q.reject(response.data);
	                    }

	                }, function(response) {
	                    // something went wrong
	                    return $q.reject(response.data);
	            	});
	        }
	    };
	}).
  factory('HonDBService', function($http){ //Check if database exists
    return{
      getDBStatus: function(){
          return $http({
            method: 'GET',
            url: '/api/getDBStatus'
          }).
        success(function(data){
          return data.connection;
        });
      },
      createDB: function(){
        return $http({
          method: 'POST',
          url: '/api/createDB'
        }).success(function(data){
          return data;
        });
      },
      createHeroes: function(sql){ //Fragments of sql containing insert data will be passed here
        return $http({
          method: 'POST',
          url: '/api/createHeroes',
          data:{sql:sql}
        }).success(function(data){
          return data;
        });
      }
    }
  });

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