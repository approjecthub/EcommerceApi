const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    allitems:[{itemtaken: {type:mongoose.Schema.Types.ObjectId, ref:"item", required:true}, qty:Number}],
    userid:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    month:{type:Number, default:new Date().getMonth()+1},
    totalPrice:{type:Number, default:-1}
})

module.exports = mongoose.model('cart', cartSchema)