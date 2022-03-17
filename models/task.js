const mongoose = require("mongoose");
let taskSchema = mongoose.Schema({
    manager_id: {
        type: String,
        required: true
    },
    task_name:{
        type: String,
        required: true
    },
    description:String,
    task_status:{
        type: [{
            type: String,
            enum: ['open', 'ready','inreview','completed']
        }],
        default: ['open']},
    users : [{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
},
    {timestamps: true},
);
module.exports = mongoose.model('Task', taskSchema);
