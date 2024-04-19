const taskManager = require('../TaskManager');

modules.exports = function(room){
    while(taskManager.hasTaskInQueue('deliver')){
        var task = taskManager.getTask('deliver');
        var demandContainer = Game.getObjectById(task.target_id);
        if(demandContainer == null || 
        demandContainer.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            taskManager.removeTask('deliver');
        }else{
            return;
        }
    }
    var demandContainers = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER &&
                room.memory.demandContainers.includes(structure.id) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
    for(var demandContainer of demandContainers){
        taskManager.addTask('deliver', {
            take: false,
            target_id: demandContainer.id,
            resource_type: RESOURCE_ENERGY
        });
    }
}