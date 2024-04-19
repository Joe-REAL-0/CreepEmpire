const taskManager = require('../TaskManager');
const creepBodyDic = require('../Parameters').creepBodyDic;

modules.exports = function(room){
    var spawns = room.find(FIND_MY_SPAWNS);
    for(var spawn of spawns){
        if(spawn.spawning != null) continue;
        if(spawn.memory.task != null) taskManager.spawnDoneTask(spawn);
        var recycleTask = taskManager.getAvailableTask('recycle');
        if(recycleTask != null){
            spawn.memory.task_type = "recycle";
            spawn.memory.task = recycleTask;
            var creepToRecycle = Game.getObjectById(recycleTask.target_id);
            if(creepToRecycle == null){
                taskManager.removeTask('recycle', recycleTask.id);
            }
            taskManager.tackTask('recycle');
            creepToRecycle.memory.status = 'recycle';
            if(spawn.recycleCreep(creepToRecycle) != ERR_NOT_IN_RANGE) creepToRecycle.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
            continue;
        }
        var renewTask = taskManager.getAvailableTask('renew');
        if(renewTask != null){
            spawn.memory.task_type = "renew";
            spawn.memory.task = renewTask;
            var creepToRenew = Game.getObjectById(renewTask.target_id);
            if(creepToRenew == null){
                taskManager.removeTask('renew' ,renewTask.id);
            }
            taskManager.tackTask('renew');
            creepToRenew.memory.status = 'renew';
            if(spawn.renewCreep(creepToRenew) != ERR_NOT_IN_RANGE) creepToRenew.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
            continue;
        }
        var spawnTask = taskManager.getAvailableTask('spawn');
        if(spawnTask != null){
            spawn.memory.task_type = "spawn";
            spawn.memory.task = spawnTask;
            var creepBody = creepBodyDic[spawnTask.role][room.memory.level];
            spawn.spawnCreep(creepBody, spawnTask.name, {memory: {role: spawnTask.role, task: spawnTask.creep_task}});
        }
    }

}