class TaskManager{
    constructor(){
        if(TaskManager.instance){
            return TaskManager.instance;
        }

        this.taskQueues = {
            mine:[],
            store:[],
            build:[],
            upgrade:[],
            deliver:[],
            repair:[],
            spawn:[],
            recycle:[],
            renew:[]
        } 

        TaskManager.instance = this;
    }

    addTask(queueName, task){
        task.id = this.taskQueues[queueName].length;
        this.taskQueues[queueName].push(task);
    }

    getTask(queueName){
        return this.taskQueues[queueName][0];
    }

    getAvailableTask(queueName){
        availableTasks = this.taskQueues[queueName].filter(task => !task.take);
        return availableTasks.length > 0 ? availableTasks[0] : null;
    }

    spawnDoneTask(spawn){
        var queueName = spawn.memory.task_type;
        var taskId = spawn.memory.task;
        this.taskQueues[queueName] = this.taskQueues[queueName].filter(task => task.id != taskId);
        spawn.memory.task = null;
    }

    creepDoneTask(creep){
        var queueName = creep.memory.role;
        var taskId = creep.memory.task;
        this.taskQueues[queueName] = this.taskQueues[queueName].filter(task => task.id != taskId);
        var newTask = this.getAvailableTask(queueName);
        if(newTask != null){
            creep.memory.task = newTask;
            newTask.take = true;
        }
        creep.memory.task = null;
    }

    removeTask(queueName, taskId){
        this.taskQueues[queueName] = this.taskQueues[queueName].filter(task => task.id != taskId);
    }

    tackTask(queueName){
        this.getAvailableTask(queueName).take = true;
    }

    getTaskCount(queueName){
        return this.taskQueues[queueName].length;
    }

    hasTaskInQueue(queueName){
        return this.taskQueues[queueName].length > 0;
    }
}

module.exports = new TaskManager();