const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    name:  String,
    email: String,
    message: String,

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    datePosted: {
        type: Date,
        default: new Date()
    }
})
const Contact = mongoose.model('Contact',ContactSchema);
module.exports = Contact