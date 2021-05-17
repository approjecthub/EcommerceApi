const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    name:{type: String, required: true},
    brand:{type: String, required: true},
    category:{type: String, required: true},
    qty:{type: Number, required: true},
    price:{type: Number, required: true},
    userid:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'user'}
})

module.exports = mongoose.model('item', itemSchema)