const Badges = require('badgerific');
//Ecery rule must be declared in the json
const rules = require('./badgeRules.json');

const badges = new Badges(rules);

function addGamePlayed(){
    //It should be games that that user played + 1 TODO
    badges.setValue('gameCount', 1)
}

