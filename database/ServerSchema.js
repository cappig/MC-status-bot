const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serverSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    IP: {
        type: String,
        default: ""
    },
    Logging: {
        type: Boolean,
        default: false
    },
    StatusChannId: {
        type: String,
        required: false
    },
    NumberChannId:{
        type: String,
        required: false
    },
    CategoryId: {
        type: String,
        required: false
    }
}, {
    versionKey: false
})

const Server = mongoose.model('Server', serverSchema);
module.exports = Server;
