const taskManager = require("../TaskManager");

modules.exports = function(room){
    while(taskManager.hasTaskInQueue('upgrade')){
        var task = taskManager.getTask('upgrade');
        if(room.memory.level != task.room_level){
            taskManager.removeTask('upgrade');
        }else{
            return;
        }
    }
    var controller = room.controller;
    taskManager.addTask('upgrade', {
        take: false,
        target_id: controller.id,
        room_level: room.memory.level
    });
}