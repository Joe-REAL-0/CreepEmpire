var mine = require('CreepJobs/mine');
var store = require('CreepJobs/store');
var build = require('CreepJobs/build');
var upgrade = require('CreepJobs/upgrade');
var deliver = require('CreepJobs/deliver');
var repair = require('CreepJobs/repair');

module.exports = function(creep){
    var message = "";
    switch(creep.memory.role){
        case 'mine':
            message = mine(creep);
            break;
        case 'store':
            message = store(creep);
            break;
        case 'build':
            message = build(creep);
            break;
        case 'upgrade':
            message = upgrade(creep);
            break;
        case 'deliver':
            message = deliver(creep);
            break;
        case 'repair':
            message = repair(creep);
            break;
    }
    if(message != null && message != ""){
        console.log(creep.name + ": " + message);
    }
}