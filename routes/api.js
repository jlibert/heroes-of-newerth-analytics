/*
 * Serve JSON to our AngularJS client
 */
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    uuid = require('node-uuid'),
    router = express.Router();

router.get('/heroes', function(req, res){
  var url = "http://www.heroesofnewerth.com";
  var heroes = [];
  
  /* Get All Heroes */  
  request(url+"/heroes", function(error, res, body){
    if(!error){
      GetHeroes(body);  // Let the scraping begin! :o
    }
  });
  
  /* Get All Heroes */
  function GetHeroes(data){
    var $ = cheerio.load(data);
    
    $('#heroHolder.listView').children('a').each(function(){
      
      // Hero description
      var heroUrl = url+$(this).attr('href');
      var heroPath = $(this).attr('href');
      var icon = url+$(this).children('div.icon').attr('style').slice(23,-3);
      var type = $(this).children('div.default').text().substring(6);
      
      // Hero Array
      var hero = {
        id: uuid.v4(),
        name: $(this).children('div.title').text().trim(),
        icon: icon,
        url: heroUrl,
        type: type
      };
      
      heroes.push(hero);
    });
    
    res.json({heroes: heroes}); 
  }
  
});



router.get('/hero-data' , function(req, res){
  var heroData = {id:req.param('id'), name:req.param('name'), icon:req.param('icon'), type:req.param('type'), url:req.param('url')};
  
  /* Get Hero Data */
  request(req.param('url'), function(error, res, body){
    if(!error){
      GetHeroData(body, heroData);
    }
  });
  
  /* Get Hero Data */
  function GetHeroData(body, heroData){
    
    var stats = [];
    var $ = cheerio.load(body);
    
    //Hero Stats
    $('#stats').children('.theText').children('div:first-child').children('p').each(function(){
      var val = $(this).text().replace(/(\w+:)/,"").trim(); //remove stats label
      stats.push(val);
    });
    
    //Advanced Hero Stats
    $('#advStats').children('.theText').children('.statCol').each(function(){
      $(this).children('p').each(function(){
        var val = $(this).text().replace(/((\w+\s*)+:)/,"").trim(); //remove stats label
        stats.push(val);
      });
    });
    
    heroData.stats = stats;
    
    res.json({hero: heroData});
  }
  
  
});

/* Get Database Status */
router.get('/getDBStatus', function(req, res, next){
  req.getConnection(function(err, connection) {
      if (err) return next(err);
      
      connection.query('SELECT COUNT(*) AS RESULT FROM information_schema.SCHEMATA where SCHEMA_NAME = "honDB";', [], function(err, rows) {
        if (err) return next(err);
        res.json({connection: rows[0].RESULT});
      });

  });
});

/* Create Database */
router.post('/createDB', function(req, res, next){
  req.getConnection(function(err, connection){
    if (err) return next(err);
    connection.query('CREATE DATABASE IF NOT EXISTS `honDB`;',[], function(err){
      if (err) return next(err);
      connection.query('USE `honDB`;',[],function(err){
        if (err) return next(err);
        connection.query('CREATE TABLE IF NOT EXISTS `heroes` (`id` varchar(36) NOT NULL, `name` varchar(40) NOT NULL, `herotype` varchar(20) NOT NULL,`icon` varchar(150) NOT NULL, `statsId` int(11) NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`), KEY `statsId` (`statsId`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;',[],function(err){
        if (err) return next(err);
        connection.query('CREATE TABLE IF NOT EXISTS `herostats` (`id` int(11) NOT NULL AUTO_INCREMENT, `health` int(11) NOT NULL, `damage` varchar(6) NOT NULL,'+
                  '`mana` decimal(6,2) NOT NULL, `armor` decimal(6,2) NOT NULL, `strength` varchar(15) NOT NULL, `intelligence` varchar(15) NOT NULL, `agility` varchar(15) NOT NULL,'+
                  '`attackspeed` decimal(2,2) NOT NULL, `atkrange` int(11) NOT NULL, `movementspeed` int(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB  DEFAULT CHARSET=latin1'+
                  ' AUTO_INCREMENT='+req.body.sql.autoIncr+';',[],function(err){
            if (err) return next(err);
            
              // Begin Transactions
              connection.beginTransaction(function(err){
                if (err) return next(err);
                
                connection.query('INSERT INTO `herostats` (`id`, `health`, `damage`, `mana`, `armor`, `strength`, `intelligence`, `agility`, `attackspeed`, `atkrange`, `movementspeed`) VALUES '+req.body.sql.insertHeroStats+' ON DUPLICATE KEY UPDATE `health`=VALUES(health), `damage`=VALUES(damage), `mana`=VALUES(mana), `armor`=VALUES(armor), `strength`=VALUES(strength), `intelligence`=VALUES(intelligence), `agility`=VALUES(agility), `attackspeed`=VALUES(attackspeed), `atkrange`=VALUES(atkrange), `movementspeed`=VALUES(movementspeed);',[],function(err){
                  if (err){
                    connection.rollback(function(){ return next(err); });
                  }
                });
                
                connection.query('INSERT INTO `heroes` (`id`, `name`, `herotype`, `icon`, `statsId`) VALUES '+req.body.sql.insertHeroes+' ON DUPLICATE KEY UPDATE `name`=VALUES(name), `herotype`=VALUES(herotype), `icon`=VALUES(icon);',[],function(err){
                  if (err){
                    connection.rollback(function(){ return next(err); });
                  }
                  connection.commit(function(err) {
                    if (err) { 
                      connection.rollback(function(){ return next(err); });
                    }
                    console.log('success!');
                  });
                });
                
              });
            // Add constraint if it doesn't exist
            connection.query('SELECT IF(EXISTS(SELECT * FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = "honDB" AND CONSTRAINT_NAME = "heroes_ibfk_1" AND CONSTRAINT_TYPE = "FOREIGN KEY"), 1, 0) AS RESULT;', [], function(err, rows){
              if (err) return next(err);
              if(rows[0].RESULT === 0){
                connection.query('ALTER TABLE `heroes` ADD CONSTRAINT `heroes_ibfk_1` FOREIGN KEY (`statsId`) REFERENCES `herostats` (`id`);',[],function(err){
                  if (err) return next(err);
                  res.json({success: 'success'});
                });  
              }else{
                res.json({success: 'success'});
              }
            });
          });
        });
      });
    });
  });
});

module.exports = router;
