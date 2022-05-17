const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{timestamps : true})

taskSchema.pre("save", async function (next){
    const task = this
    if(task.isModified("description"))
    {
        task.description = task.description + 'Middleware'
    }

    next()
})

const tasks = mongoose.model('tasks',taskSchema)

module.exports = tasks