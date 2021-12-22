const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: String,
        required: true    
    },
    tag: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    guilds: {
        type: Array,
        required: true,
    }
}, {
    versionKey: false,
    _id: false
})

const Users = mongoose.model('User', userSchema);
module.exports = Users;