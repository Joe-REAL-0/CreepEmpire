var AssignWorkByRole = require('JoeSorter');

module.exports.loop = function () {
    if(Game.cpu.bucket == 10000) Game.cpu.generatePixel();

    var roomsOccupied = [];
    for(var roomName in Memory.rooms){
        if(!Game.rooms[roomName].controller.my) continue;
        roomsOccupied.push(roomName);
        var room = Game.rooms[roomName];
        if(room.memory.level == undefined){
            room.memory.level = room.controller.level;
        }
        
        

    }
    Memory.roomsOccupied = roomsOccupied;

    for(var name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
            continue;
        }
        AssignWorkByRole(Game.creeps[name]);
    }
}