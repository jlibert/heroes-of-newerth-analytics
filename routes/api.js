/*
 * Serve JSON to our AngularJS client
 */
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    uuid = require('node-uuid'),
    sql = require('../public/js/database.js'),
    url = "http://www.heroesofnewerth.com",
    router = express.Router();

/* Get Heroes */
router.get('/heroes', function(req, res){
  var heroes = [];
  
  /* Make request to heroes url */  
  request(url+"/heroes", function(error, res, body){
    if(!error){
      GetHeroes(body);  // Let the scraping begin! :o
    }
  });
  
  /* Scrape All Heroes */
  function GetHeroes(data){
    var $ = cheerio.load(data);
    
    $('#heroHolder.listView').children('a').each(function(){
      
      // Hero description
      var name = $(this).children('div.title').text().trim(),
          heroUrl = url+$(this).attr('href'),
          heroPath = $(this).attr('href'),
          icon = url+$(this).children('div.icon').attr('style').replace(/\s*.+\(\s*'(.*)'\);/,"$1"),
          type = $(this).children('div.default').text().replace(/\s*\w+:\s*/,"");
      
      // Hero Array
      var hero = {
        id: uuid.v4(),
        name: name,
        icon: icon,
        url: heroUrl,
        type: type
      };
      
      heroes.push(hero);
    });
    
    res.json({heroes: heroes}); 
  }
  
});

/* Get Hero Data */
router.get('/hero-data' , function(req, res){
  var heroData = {id:req.param('id'), name:req.param('name'), icon:req.param('icon'), type:req.param('type'), url:req.param('url')};
  
  /* Make request to hero's data url */
  request(req.param('url'), function(error, res, body){
    if(!error){
      GetHeroData(body, heroData);
    }
  });
  
  /* Scrape all hero's data */
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

/* Get Items */
router.get('/items', function(req, res){
  var items = [];
  
  /* Make request to item url */
  request(url+"/items", function(error, res, body){
    if(!error){
      GetItems(body);  // Let the scraping begin! :o
    }
  });
  
  /* Scrape All Items */
  function GetItems(data){
    var $ = cheerio.load(data);
    
    $('#itemHolder.listView').children('a').each(function(){
      
      // Item Description
      var name = $(this).children('div.title').text().trim(),
          icon = url+$(this).children('div.icon').attr('style').replace(/\s*.+\(\s*'(.*)'\);/,"$1"),
          cost = $(this).children('div.default').text().replace(/\s*\w+:\s*/,""),
          itemUrl = url+$(this).attr('href');
      
      // Item Array
      var item = {
        id: uuid.v4(),
        name: name,
        icon: icon,
        cost: cost,
        url: itemUrl
      };
      
      items.push(item);
    });
    res.json({items: items});
  }
  
});

/* Get Item Data */
router.get('/item-data', function(req, res){
  var itemData = {id:req.param('id'), name:req.param('name'), icon:req.param('icon'), cost:req.param('cost'), url:req.param('url')};
  
  /* Make request to item's data url */
  request(req.param('url'), function(error, res, body){
    if(!error){
      GetItemData(body, itemData);
    }
  });
  
  /* Scrape all item's data */
  function GetItemData(body, itemData){
    var passives = [];
    var passivesJSON = {};
    var $ = cheerio.load(body);
    
    // Item Stats
    $('#bio').children('.subTitle').each(function(){
      
      // We're conly concerned with the Passive effects.. (Allied unit aura etc., is currently out of scope )
      if($(this).text().trim() == 'Passive'){ 
        passives = $(this).next('.itemStats').text().trim().split('\n');
      }
    });
    
    
    // Assign Passive effects to key pair
    var re = /\+?((\d+\.?\d*%?,*\s*)+)\s+((\w+\s*)*)/;
    
    for(var i=0; passives.length>i; i++){
      var effect = passives[i].replace(re,"$3");
      var value = passives[i].replace(re,"$1");
      
      passivesJSON[effect]=value;
      
    }
    itemData.passives = passivesJSON;
    res.json({item: itemData});
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

/* Create Items Table */
router.post('/createItems', function(req, res){
  req.getConnection(function(err, connection){
    connection.query(sql.useDB, function(err){
      if (err) return res.status(200).send({'success': false, 'error': err});
      connection.query(sql.createItems, function(err){
        if (err) return res.status(200).send({'success': false, 'error': err});
        connection.query(sql.insertItems+req.body.sql.insertItems+sql.onDuplicateItems, function(err){
          if (err) return res.status(200).send({'success': false, 'error': err});
          res.status(200).send({'success': true, 'error': {}});
        });
      });
    });
  });
});

module.exports = router;
