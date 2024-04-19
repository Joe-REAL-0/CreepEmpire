const taskManager = require('../TaskManager');

modules.exports = function(room){
    while(taskManager.hasTaskInQueue('build')){
        var task = taskManager.getTask('build');
        if(Game.getObjectById(task.target_id) == null){
            taskManager.removeTask('build');
        }else{
            return;
        }
    }
    var buildSites = room.find(FIND_CONSTRUCTION_SITES);
    for(var buildSite of buildSites){
        taskManager.addTask('build', {
            take: false,
            target_id: buildSite.id,
            structure_type : buildSite.structureType
        });
    }
}