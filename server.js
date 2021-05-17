const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.listen(3000, ()=>{
    console.log('Server is on!');
})

mongoose.connect('mongodb+srv://newadmin:newadmin@sandbox.y6dbq.mongodb.net/itemDb?retryWrites=true&w=majority',{ useUnifiedTopology: true , useNewUrlParser: true})
.then(()=>{
    console.log('database is connected!');
})
.catch((err)=>{
    console.log('Unable to connect with db!!');
})

app.use(express.json())

const userSignup = require('./routes/userSignup')
app.use('/api/user', userSignup)

const userShopping = require('./routes/userShopping')
app.use('/api/shopping', userShopping)

const adminItemCRUD = require('./routes/adminItemCRUD')
app.use('/api/items',adminItemCRUD)

const adminOp = require('./routes/adminOp')
app.use('/api/adminop', adminOp)

//404 not found 
app.use((req, res, next)=>{
    return res.status(404).json({msg:'endpoint not found'})
})