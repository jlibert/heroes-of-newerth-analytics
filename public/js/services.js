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
                 $scope.progress_message = 'Generating '+data.hero.name+'...'; // Update progress message for each hero generated

                 if(completed_requests == hero_count){
                   $scope.progress_message = 'Populating Heroes...'; // Update progress message for database activity

                   // Remove trailing ',' from SQL fragment
                   sql.insertHeroes = sql.insertHeroes.substring(0, sql.insertHeroes.length - 2);

                   // Call database service
                   HonDBService.createHeroes(sql).then(function(data){
                     if(data.success === false){ /* TODO: handle progress and progress_message differently */ }
                     $scope.progress=100; // Assign 100% when DB update complete (remaining 10%)
                     $scope.progress_message = 'Heroes Completed!';
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
  factory('ItemService', function($http, $q){
    return {
      createItems: function($scope, ItemService, HonDBService){
        $http({
          method: 'GET',
          url: '/api/items'
        }).success(function(data){
          var completed_requests = 0;
          var progress_bar = 0;
          var item_count = data.items.length;
          var sql = {};
          sql.insertItems = '';
          
          for(var i=0; i<data.items.length; i++){ // Loop through hero data and create sql statement fragments
            ItemService.getItemEffects(data.items[i]).
            then(function(data) {
              
              sql.insertItems += '("'+data.item.id+'", "'+addslashes(data.item.name)+'", '+addslashes(data.item.cost)+
                                 ', "'+addslashes(data.item.icon)+'", ';
              
              // Max Health
              if(typeof data.item.passives['Max Health']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Max Health'])+'", ';
              }
              
              // Damage
              if(typeof data.item.passives['Damage']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Damage'])+'", ';
              }
              
              // Max Mana
              if(typeof data.item.passives['Max Mana']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Max Mana'])+'", ';
              }
              
              // Armor
              if(typeof data.item.passives['Armor']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Armor'])+'", ';
              }
              
              // Strength
              if(typeof data.item.passives['Strength']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Strength'])+'", ';
              }
              
              // Intelligence
              if(typeof data.item.passives['Intelligence']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Intelligence'])+'", ';
              }
              
              // Agility
              if(typeof data.item.passives['Agility']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Agility'])+'", ';
              }
              
              // Attack Speed
              if(typeof data.item.passives['Attack Speed']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Attack Speed'])+'", ';
              }
              
              // Health Regeneration
              if(typeof data.item.passives['Health Regeneration']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Health Regeneration'])+'", ';
              }
              
              // Mana Regeneration
              if(typeof data.item.passives['Mana Regeneration']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Mana Regeneration'])+'", ';
              }
              
              // Magic Armor
              if(typeof data.item.passives['Magic Armor']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Magic Armor'])+'", ';
              }
              
              // Lifesteal
              if(typeof data.item.passives['Lifesteal']=='undefined'){
                sql.insertItems += 'null, ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Lifesteal'])+'", ';
              }
              
              // Movement Speed
              if(typeof data.item.passives['Movement Speed']=='undefined'){
                sql.insertItems += 'null), ';
              }else{
                sql.insertItems += '"'+addslashes(data.item.passives['Movement Speed'])+'"), ';
              }
              
              completed_requests++;
              progress_bar=Math.ceil((completed_requests/item_count)*90); // Calculate the progress % of requests needed to generate sql, reserve 10% for executing SQL
              $scope.progress = progress_bar;
              $scope.progress_message = 'Generating '+data.item.name+'...'; // Update progress message for each item generated
              
              if(completed_requests == item_count){
                $scope.progress_message = 'Populating Items...'; // Update progress message for database activity
                
                // Remove trailing ',' from SQL fragment
                sql.insertItems = sql.insertItems.substring(0, sql.insertItems.length - 2);
                
                // Call database service
                HonDBService.createItems(sql).then(function(data){
                  if(data.success === false){ /* TODO: handle progress and progress_message differently */ }
                  $scope.progress=100; // Assign 100% when DB update complete (remaining 10%)
                  $scope.progress_message = 'Completed!';
                });
              }
            });
          }
        }).
        error(function(data){
          //TODO
        });
      },
      getItemEffects: function(item) {
	      // the $http API is based on the deferred/promise APIs exposed by the $q service
	      // so it returns a promise for us by default
	      return $http({
          method: 'GET',
          url: '/api/item-data',
          params: {id:item.id, name: item.name, icon:item.icon, cost:item.cost, url:item.url}
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
      },
      createItems: function(sql){
        return $http({
          method: 'POST',
          url: '/api/createItems',
          data:{sql:sql}
        }).success(function(data){
          return data;
        });
      },
      getHeroes: function(data){
        return $http({
          method: 'GET',
          url: '/api/getHeroes',
          params:{data:data}
        }).success(function(data){
          return data;
        });
      },
      getItems: function(data){
        return $http({
          method: 'GET',
          url: '/api/getItems'
        }).success(function(data){
          return data;
        });
      }
    }
  }).
  factory('DisplayService', function(){
    return{
      ItemEffects: function(item){
        var len = Object.keys(item).length;
        var effects = ''; // Empty list of item effects
        
        for(var i=0; i< len; i++){
          var key = Object.keys(item)[i];
          
          //loop through item properties and set display
          if(key!=='$$hashKey' && key!=='id' && key!=='name' && key!=='icon'){
            if(item[key]!==null){
              
              var val = item[key].toString().replace(/(\d+\.*\d*)\s(percent)/,"$1%"); // Change 'percent' to display '%'

              // Append Item Effect to Item Description List
              switch(key){
                case 'cost':
                  effects += 'Cost: '+val+', ';
                  break;
                case 'healthregeneration':
                  effects += 'Health Regeneration: +'+val+', ';
                  break;
                case 'attackspeed':
                  effects += 'Attack Speed: +'+val+', ';
                  break;
                case 'manaregeneration':
                  effects += 'Mana Regeneration: +'+val+', ';
                  break;
                case 'magicarmor':
                  effects += 'Magic Armor: +'+val+', ';
                  break;
                case 'maxmana':
                  effects += 'Max Mana: +'+val+', ';
                  break;
                case 'maxhealth':
                  effects += 'Max Health: +'+val+', ';
                  break;
                case 'movementspeed':
                  effects += 'Movement Speed: +'+val+', ';
                  break;
                default:
                  effects += (key.charAt(0).toUpperCase() + key.slice(1))+': +'+val+', '; // Other effects whose key needs only to be uppercased
                  break;
              }
            }
          }
        }
        effects = effects.substring(0, effects.length - 2); // Remove trailing ','
        return effects;
      },
      AggregateEffects: function($scope, stat){
        
        var retVal = 0;
        var level1, percent;
        
        if($scope.itemSlot.length > 0){
                   
          for(var i=0; i<$scope.itemSlot.length;i++){ // Loop through items in Item Tray and aggregate effect values
            
            if($scope.itemSlot[i][stat] !== null){
              if($scope.itemSlot[i][stat].match(/(\d+\.*\d*)\s(percent)/)){ // Handling percent values
                percent = parseInt($scope.itemSlot[i][stat].replace(/(\d+\.*\d*)\s(percent)/, '$1'));
                retVal = retVal + $scope.hero[stat] * (percent/100);
              }
              else if($scope.itemSlot[i][stat].match(/\d+,\d+(,\d+)*/)){ // Handling multiple level values
                // TODO: Some feature for selecting which level of stats to use, for now use level 1
                level1 = parseInt($scope.itemSlot[i][stat].replace(/(\d+),\d+(,\d+)*/, '$1'));
                retVal = retVal + level1;
              }
              else{
                retVal = retVal + parseInt($scope.itemSlot[i][stat]); // Flat values are simply added to total
              }
            }
          }
          return retVal;
        }
      },
      UpdateHeroStats: function($scope, DisplayService, stat, value){
        
        var effect = 0;
        if(typeof(DisplayService.AggregateEffects($scope, stat))!=='undefined'){
          effect = DisplayService.AggregateEffects($scope, stat);
        }
        
        if(typeof(value) == 'string' && value.match(/\d+\-\d+/)){ // Add item effects to min-max values; i.e. 45-55
          var min = effect+parseInt(value.replace(/(\d+)\-\d+/, '$1'));
          var max = effect+parseInt(value.replace(/\d+\-(\d+)/, '$1'));
          return min+'-'+max;
        }
        else if(typeof(value) == 'string' && value.match(/\d+\s\(\s\+\d+\.?\d?\s\)/)){  // Add item effects to values with bracket bonus; i.e. 35 (+2.2)
          var newVal = effect+parseInt(value.replace(/(\d+)\s\(\s\+\d+\.?\d?\s\)/, '$1'));
          var stub = value.replace(/\d+(\s\(\s\+\d+\.?\d?\s\))/, '$1');
          return newVal+stub;
        }
        else{
          return effect+value; // Add effects to normal integer values
        }
        
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
         replace(/"/g, '\\"').
         replace(/%/g,' percent');
}