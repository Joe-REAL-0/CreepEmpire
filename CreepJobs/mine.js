const taskManager = require('../TaskManager');

modules.exports = function(creep){
    if(creep.store.energy != creep.store.getCapacity()){
        creep.memory.status = 'mine';
        var source_id = creep.memory.task.target_id;
        var source = Game.getObjectById(source_id);
        if(source.energy == 0){
            taskManager.creepDoneTask(creep);
            return;
        }
        if(creep.harvest(source) == ERR_NOT_IN_RANGE){
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }else{
        creep.memory.status = 'store';
        var container_id = creep.memory.container_id;
        var container = Game.getObjectById(container_id);
        if(container_id == undefined || container.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER &&
                        creep.room.memory.supplyContainers.includes(structure.id) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });
            if(containers.length == 0 || creep.room.find(FIND_MY_CREEPS, {filter: creep => creep.memory.role == 'store'}).length == 0){
                containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_SPAWN || 
                            structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
                });
            }
            if(containers.length == 0) return "房间内没有可以存储能量的容器";
            var reachableContainers = containers.filter(container => {
                var path = container.pos.findPathTo(creep.pos);
                return path != null && path.length <= 50;
            });
            if(reachableContainers.length == 0) return "没有可到达的容器";
            container_id = creep.pos.findClosestByPath(reachableContainers).id;
            creep.memory.container_id = container_id;
            container = Game.getObjectById(container_id);
        }
        if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
    }
}