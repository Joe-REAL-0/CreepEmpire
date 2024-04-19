const taskManager = require('../TaskManager');

modules.exports = function(creep){
    if(creep.store.energy != 0){
        creep.memory.status = 'deliver';
        var target_id = creep.memory.task.target_id;
        var target = Game.getObjectById(target_id);
        var demandContainers = creep.room.memory.demandContainers.map(id => Game.getObjectById(id));
        var averageEnergy = demandContainers.reduce((sum, container) => sum + container.store.energy, 0) / demandContainers.length;
        if(target.store.energy > averageEnergy) {
            taskManager.creepDoneTask(creep);
            return;
        }
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
    }else{
        creep.memory.status = 'get'
        var container_id = creep.memory.container_id;
        var container = Game.getObjectById(container_id);
        if(container_id == undefined || container.store.energy == 0){
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.energy > 0);
                }
            });
            if(containers.length == 0) return "房间内没有可以取能量的容器";
            var reachableContainers = containers.filter(container => {
                var path = container.pos.findPathTo(creep.pos);
                return path != null && path.length <= 50;
            });
            if(reachableContainers.length == 0) return "没有可到达的容器";
            container_id = creep.pos.findClosestByPath(reachableContainers).id;
            creep.memory.container_id = container_id;
            container = Game.getObjectById(container_id);
        }
    }
}