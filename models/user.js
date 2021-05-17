const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema =new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    role:{type: Number, required: true},
    status:{type: String, default: 'pending'},
    
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema)