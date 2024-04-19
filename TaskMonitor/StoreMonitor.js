const taskManager = require("../TaskManager");

modules.exports = function(room){
    while(taskManager.hasTaskInQueue('store')){
        var task = taskManager.getTask('store');
        var storeSite = Game.getObjectById(task.target_id);
        if(storeSite == null || storeSite.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            taskManager.removeTask('store');
        }
    }
    var storeSites = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
    for(var storeSite of storeSites){
        taskManager.addTask('store', {
            take: false,
            target_id: storeSite.id,
            resource_type: RESOURCE_ENERGY
        });
    }
}