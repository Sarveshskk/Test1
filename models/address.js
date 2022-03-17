const mongoose = require("mongoose");
let addressSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    address:String,
    city:String,
    state:String,
    pin_code:Number,
    phone_no:Number,
    users : {type: mongoose.Schema.Types.ObjectId,ref:'User'},
});
module.exports = mongoose.model('Address', addressSchema);