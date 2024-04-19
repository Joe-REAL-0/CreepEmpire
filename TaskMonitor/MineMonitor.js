const taskManager = require("../TaskManager");

modules.exports = function(room){
    while(taskManager.hasTaskInQueue('mine')){
        var task = taskManager.getTask('mine');
        if(Game.getObjectById(task.target_id).energy == 0){
            taskManager.removeTask('mine');
        }else{
            return;
        }
    }
    var sources = room.find(FIND_SOURCES,{
        filter: (source) => {
            return source.energy > 0 || source.ticksToRegeneration < 50;
        }
    });
    for(var source of sources){
        taskManager.addTask('mine', {
            take: false,
            target_id: source.id,
            resource_type: RESOURCE_ENERGY
        });
    }
}