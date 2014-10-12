var server = require('../hon.js'); // Will start the server
var request = require('request');
var baseUrl = 'http://localhost/';

describe('All Database functionality: ', function(){
  
  describe('getDBStatus', function () {

    it("should return a value.", function(done) {
      request(baseUrl+"/api/getDBStatus", function(req, res, data){
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data).connection).toBeDefined();
        done();
      });
    }, 250);

  });

  describe('createDB', function(){
    
    it("should successfully create the honDB database", function(done){
      request.post(baseUrl+'/api/createDB', function(req, res, data){
        expect(res.statusCode).toBe(200);
        done();
      });
    }, 250);
    
  });
  
  describe('createHeroes', function(){
    var autoIncr, insertHeroes, insertHeroStats, sql;
    
    it("should create/update `heroes` table with heroes; Andromeda and Ophelia", function(done){

      insertHeroes = '("b1c7ccde-8e27-480d-8da2-dc0eaa6c4315", "Andromeda", "Agility", "http://www.heroesofnewerth.com/images/heroes/102/icon_128.jpg",'+
                     ' 473, "40-50", 208, 2.96, "17 ( +2.1 )", "16 ( +1.8 )", "26 ( +2.4 )", 0.74, 400, 295),'+
                     ' ("824d7e5e-afba-4bcf-a46d-2f84698455a0", "Ophelia", "Intelligence", "http://www.heroesofnewerth.com/images/heroes/36/icon_128.jpg",'+
                     ' 511, "43-53", 273, 1.1, "19 ( +1.5 )", "21 ( +2.8 )", "15 ( +1.7 )", 0.68, 600, 300)';
      
      sql = {'sql':{'insertHeroes':insertHeroes}};

      request.post({url: baseUrl+'/api/createHeroes', form: sql}, function(req, res, data){
        expect(res.statusCode).toBe(200);
        done();
      });
    }, 250);
    
    it("should fail to insert/update `heroes` table with hero; Androooomeda", function(done){
      
      insertHeroes = '(null, "Androooomeda", "Agility", "http://www.heroesofnewerth.com/images/heroes/102/icon_128.jpg",'+
                     ' 500, "40-50", 208, 2.96, "17 ( +2.1 )", "16 ( +1.8 )", "26 ( +2.4 )", 0.74, 400, 295)';
      
      sql = {'sql':{'insertHeroes':insertHeroes}};
      
      request.post({url: baseUrl+'/api/createHeroes', form: sql}, function(req, res, data){
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data).success).toBeFalsy();
        expect(JSON.parse(data).error).toBeDefined();
        done();
      });
    }, 250);
  });
  
  
  afterEach(function () { //Close the server
    setTimeout(function () {
      server.close();
    }, 1200);
  });
  
});