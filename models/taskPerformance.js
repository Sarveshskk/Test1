const mongoose = require("mongoose");
let taskPerformanceSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    task_id: {
        type: String,
        required: true
    },
    task_rating:{
        type: Number,
        required: true
    },
    
    users : {type: mongoose.Schema.Types.ObjectId,ref:'User'},
});
module.exports = mongoose.model('TaskPerformance', taskPerformanceSchema);