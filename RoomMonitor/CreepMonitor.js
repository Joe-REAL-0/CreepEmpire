const taskManager = require("../TaskManager");
const roleList = require("../Parameters").creepRoleList;
const maxCountDic = require("../Parameters").maxCreepCountDic;

module.exports = function(room){
    creeps = room.find(FIND_MY_CREEPS);
    for(var role of roleList){
        var creepsInRole = creeps.filter(creep => creep.memory.role == role);
        for(var i = creepsInRole.length; i < taskManager.getTaskCount(role); i++){
            var task = taskManager.getAvailableTask(role);
            if(creepsInRole.length >= maxCountDic[role][room.memory.level]) break;
            taskManager.addTask('spawn',{tack: false, name: role + (creepsInRole.length+1) + "_" + room.name, role: role, creep_task: taskManager.getTask(role)})
            if(role == 'upgrade') continue;
            taskManager.tackTask(role);
        }
        for(var creep of creepsInRole){
            if(creep.memory.task != null) continue;
            var task = taskManager.getAvailableTask(role);
            if(task == null) break;
            creep.memory.task = task;
            if(role == 'upgrade') continue;
            taskManager.tackTask(role);
        }
        var creepsWithoutTask = creepsInRole.filter(creep => creep.memory.task == null);
        if(creepsWithoutTask.length == 0) continue;
        creepsWithoutTask.array.forEach(creep => {
            taskManager.addTask('recycle', {take: false, target_id: creep.id});
        });
    }
}