modules.exports = function(creep){
    if((creep.store.energy != 0 && creep.memory.status == 'upgrade') || (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && creep.memory.status == 'charge')){
        creep.memory.status = 'upgrade';
        var controller = creep.room.controller;
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }else{
        creep.memory.status = 'charge';
        var container_id = creep.memory.container_id;
        var container = Game.getObjectById(container_id);
        if(container_id == undefined || container.store.energy == 0){
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER &&
                        creep.room.memory.demandContainers.includes(structure.id) &&
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
        if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    
}