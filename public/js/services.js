'use strict';

/* Services */
angular.module('myApp.services', []).
  factory('HeroStatsService', function ($http, $q) {
	    return {
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
      createDB: function(sql){ //Fragments of sql containing insert data will be passed here
        return $http({
          method: 'POST',
          url: '/api/createDB',
          data:{sql:sql}
        }).success(function(data){

        });
      }
    }
  });
