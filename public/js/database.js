/* Queries */
module.exports = {
  'useDB'                 : 'USE `honDB`;',
  
  'getHonDB'              : 'SELECT COUNT(*) AS RESULT FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = "honDB";',
  
  'getHeroesTable'        : 'SELECT COUNT(*) AS RESULT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "honDB" AND TABLE_NAME = "heroes";',
  
  'getItemsTable'         : 'SELECT COUNT(*) AS RESULT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "honDB" AND TABLE_NAME = "items";',
  
  'createHonDB'           : 'CREATE DATABASE IF NOT EXISTS `honDB`;',
  
  'createHeroes'          : 'CREATE TABLE IF NOT EXISTS `heroes` (`id` varchar(36) NOT NULL, `name` varchar(40) NOT NULL, '+
                            '`herotype` varchar(20) NOT NULL,`icon` varchar(150) NOT NULL, `health` int(11) NOT NULL, '+
                            ' `damage` varchar(6) NOT NULL, `mana` decimal(6,2) NOT NULL, `armor` decimal(6,2) NOT NULL,'+
                            ' `strength` varchar(15) NOT NULL, `intelligence` varchar(15) NOT NULL, `agility` varchar(15) NOT NULL,'+
                            ' `attackspeed` decimal(2,2) NOT NULL, `atkrange` int(11) NOT NULL, `movementspeed` int(11) NOT NULL,'+
                            'PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;',
  
  'createItems'           : 'CREATE TABLE IF NOT EXISTS `items` (`id` varchar(36) NOT NULL, `name` varchar(40) NOT NULL, '+
                            '`cost` int(6) NOT NULL, `icon` varchar(150) NOT NULL, `maxhealth` varchar(20), `damage` varchar(20), '+
                            '`maxmana` varchar(20), `armor` varchar(20), `strength` varchar(20), `intelligence` varchar(20),'+
                            ' `agility` varchar(20), `attackspeed` varchar(20), `healthregeneration` varchar(20),'+
                            ' `manaregeneration` varchar(20), `magicarmor` varchar(20), `lifesteal` varchar(20),'+
                            ' `movementspeed` varchar(20), PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;',
  
  'insertHeroes'          : 'INSERT INTO `heroes` (`id`, `name`, `herotype`, `icon`, `health`, `damage`, `mana`, `armor`,'+
                            ' `strength`, `intelligence`, `agility`, `attackspeed`, `atkrange`, `movementspeed`) VALUES ',
  
  'insertItems'           : 'INSERT INTO `items` (`id`, `name`, `cost`, `icon`, `maxhealth`, `damage`, `maxmana`, `armor`,'+
                            ' `strength`, `intelligence`, `agility`, `attackspeed`, `healthregeneration`, `manaregeneration`,'+
                            ' `magicarmor`, `lifesteal`, `movementspeed`) VALUES ',
  
  'onDuplicateHeroes'     : ' ON DUPLICATE KEY UPDATE `name`=VALUES(name), `herotype`=VALUES(herotype), `icon`=VALUES(icon),'+
                            ' `health`=VALUES(health), `damage`=VALUES(damage), `mana`=VALUES(mana), `armor`=VALUES(armor),'+
                            ' `strength`=VALUES(strength), `intelligence`=VALUES(intelligence), `agility`=VALUES(agility),'+
                            ' `attackspeed`=VALUES(attackspeed), `atkrange`=VALUES(atkrange), `movementspeed`=VALUES(movementspeed);',
  
  'onDuplicateItems'      : ' ON DUPLICATE KEY UPDATE `name`=VALUES(name), `cost`=VALUES(cost), `icon`=VALUES(icon),'+
                            ' `maxhealth`=VALUES(maxhealth), `damage`=VALUES(damage), `maxmana`=VALUES(maxmana), `armor`=VALUES(armor),'+
                            ' `strength`=VALUES(strength), `intelligence`=VALUES(intelligence), `agility`=VALUES(agility),'+
                            ' `attackspeed`=VALUES(attackspeed), `healthregeneration`=VALUES(healthregeneration),'+
                            ' `manaregeneration`=VALUES(manaregeneration), `magicarmor`=VALUES(magicarmor),'+
                            ' `lifesteal`=VALUES(lifesteal), `movementspeed`=VALUES(movementspeed);',
  
  'getHeroes'             : 'SELECT * FROM `heroes` ORDER BY `name`;',
  
  'getHeroesWhere'        : 'SELECT * FROM `heroes` WHERE ?',
  
  'getItems'              : 'SELECT * FROM `items` ORDER BY `name`;'
};