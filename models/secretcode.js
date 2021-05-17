const mongoose = require('mongoose')

const scodeSchema = new mongoose.Schema({
    
    secretcode:{type: Number, required:true},
    createdAt:{type:Date, default:Date.now(),  expires: 120},
    userid:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true}
})

module.exports = mongoose.model('scode', scodeSchema)