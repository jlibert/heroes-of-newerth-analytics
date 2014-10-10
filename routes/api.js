/*
 * Serve JSON to our AngularJS client
 */
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    uuid = require('node-uuid'),
    sql = require('../public/js/database.js');
    router = express.Router();

/* Scrape Heroes */
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


/* Scrape Hero Data */
router.get('/hero-data' , function(req, res){
  var heroData = {id:req.param('id'), name:req.param('name'), icon:req.param('icon'), type:req.param('type'), url:req.param('url')};
  
  // Get Hero Data
  request(req.param('url'), function(error, res, body){
    if(!error){
      GetHeroData(body, heroData);
    }
  });
  
  // Get Hero Data
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
      
      connection.query(sql.getHonDB, function(err, rows) {
        if (err) return next(err);
        res.json({connection: rows[0].RESULT});
      });

  });
});

/* Create Database */
router.post('/createDB', function(req, res){
  req.getConnection(function(err, connection){
    if (err) return res.status(200).send({'success': false, 'error': err});
    connection.query(sql.createHonDB, function(err){
      return (err)? res.status(200).send({'success': false, 'error': err}): res.status(200).send({'success': true, 'error': ''});
    });
  });
});

/* Create Hero Table */
router.post('/createHeroes', function(req, res){
  req.getConnection(function(err, connection){
    connection.query(sql.useDB, function(err){
      if (err) return res.status(200).send({'success': false, 'error': err});
      connection.query(sql.createHeroes, function(err){
        if (err) return res.status(200).send({'success': false, 'error': err});
        connection.query(sql.insertHeroes+req.body.sql.insertHeroes+sql.onDuplicateHeroes, function(err){
          if (err) return res.status(200).send({'success': false, 'error': err});
          res.status(200).send({'success': true, 'error': {}});
        });
      });
    });
  });
});

module.exports = router;
