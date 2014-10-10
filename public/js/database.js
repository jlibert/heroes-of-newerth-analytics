/* Queries */
module.exports = {
  'getHonDB'              : 'SELECT COUNT(*) AS RESULT FROM information_schema.SCHEMATA where SCHEMA_NAME = "honDB";',
  'createHonDB'           : 'CREATE DATABASE IF NOT EXISTS `honDB`;',
  'createHeroesTable'     : 'CREATE TABLE IF NOT EXISTS `heroes` (`id` varchar(36) NOT NULL, `name` varchar(40) NOT NULL, '+
                            '`herotype` varchar(20) NOT NULL,`icon` varchar(150) NOT NULL, `statsId` int(11) NOT NULL, '+
                            'PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`), KEY `statsId` (`statsId`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;',
  'createHeroesStatsTable': 'CREATE TABLE IF NOT EXISTS `herostats` (`id` int(11) NOT NULL AUTO_INCREMENT, `health` int(11) NOT NULL,'+
                            ' `damage` varchar(6) NOT NULL, `mana` decimal(6,2) NOT NULL, `armor` decimal(6,2) NOT NULL,'+
                            ' `strength` varchar(15) NOT NULL, `intelligence` varchar(15) NOT NULL, `agility` varchar(15) NOT NULL,'+
                            ' `attackspeed` decimal(2,2) NOT NULL, `atkrange` int(11) NOT NULL, `movementspeed` int(11) NOT NULL,'+
                            ' PRIMARY KEY (`id`)) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=',
  'insertHeroes'          : 'INSERT INTO `heroes` (`id`, `name`, `herotype`, `icon`, `statsId`) VALUES ',
  'insertHeroStats'       : 'INSERT INTO `herostats` (`id`, `health`, `damage`, `mana`, `armor`, `strength`, `intelligence`,'+
                            ' `agility`, `attackspeed`, `atkrange`, `movementspeed`) VALUES ',
  'onDuplicateHeroes'     : ' ON DUPLICATE KEY UPDATE `name`=VALUES(name), `herotype`=VALUES(herotype), `icon`=VALUES(icon);',
  'onDuplicateHeroStats'  : ' ON DUPLICATE KEY UPDATE `health`=VALUES(health), `damage`=VALUES(damage), `mana`=VALUES(mana), `armor`=VALUES(armor),'+
                            ' `strength`=VALUES(strength), `intelligence`=VALUES(intelligence), `agility`=VALUES(agility),'+
                            ' `attackspeed`=VALUES(attackspeed), `atkrange`=VALUES(atkrange), `movementspeed`=VALUES(movementspeed);',
  'getHeroConstraint'     : 'SELECT IF(EXISTS(SELECT * FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = "honDB"'+
                            ' AND CONSTRAINT_NAME = "heroes_ibfk_1" AND CONSTRAINT_TYPE = "FOREIGN KEY"), 1, 0) AS RESULT;',
  'addHeroConstraint'     : 'ALTER TABLE `heroes` ADD CONSTRAINT `heroes_ibfk_1` FOREIGN KEY (`statsId`) REFERENCES `herostats` (`id`);'
};