const taskManager = require("../TaskManager");

modules.exports = function(room){
    while(taskManager.hasTaskInQueue('repair')){
        var task = taskManager.getTask('repair');
        if(Game.getObjectById(task.target_id).hits == Game.getObjectById(task.target_id).hitsMax || 
        (task.structure_type == STRUCTURE_WALL && Game.getObjectById(task.target_id).hits >= 12000) || 
        (task.structure_type == STRUCTURE_RAMPART && Game.getObjectById(task.target_id).hits == 12000)){
            taskManager.removeTask('repair');
        }else{
            return;
        }
    }
    var repairSites = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.hits < structure.hitsMax*0.5) || 
                (structure.structureType == STRUCTURE_WALL && structure.hits < 4000) ||
                (structure.structureType == STRUCTURE_RAMPART && structure.hits < 4000)
            );
        }
    });
    for(var repairSite of repairSites){
        taskManager.addTask('repair', {
            take: false,
            target_id: repairSite.id,
            structure_type: repairSite.structureType
        });
    }
}