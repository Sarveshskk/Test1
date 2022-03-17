const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: [{
            type: String,
            enum: ['user', 'admin','manager']
        }],
        default: ['user']
    },
    address : [{type: mongoose.Schema.Types.ObjectId, ref:'Address'}],
    task : [{type: mongoose.Schema.Types.ObjectId, ref:'Task'}],
    manager : [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    users : [{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
});
module.exports = mongoose.model('User', UsersSchema);
