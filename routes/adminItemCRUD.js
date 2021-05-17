const express = require('express');
const router = express.Router();
const Item = require('../models/item')
const checkauth = require('../middleware/check-auth-admin')

router.get('/', async (req,res)=>{
    
    try{
        const items = await Item.find();
        res.json(items)
    }
    catch(err){
        res.status(501).json ({msg:err.message})
    }
})

router.get('/:id', (req,res)=>{
    res.json(res.item)
})

router.post('/',checkauth, async(req,res)=>{
    
    const item = new Item({
        name:req.body.name,
        price:req.body.price,
        brand:req.body.brand,
        category:req.body.category,
        qty:req.body.qty,
        userid: req.userid
    })
    
    try{
        const newItem = await item.save()        
        res.status(201).json(newItem)
    }
    catch(err){
        res.status(400).json({msg:err.message})
    }
})

router.put('/:id',checkauth, async(req,res)=>{
    
    const item = new Item({
        _id:req.params.id,
        name:req.body.name,
        price:req.body.price,
        brand:req.body.brand,
        category:req.body.category,
        qty:req.body.qty,
        userid: req.userid
    })
    
    Item.updateOne({_id: req.params.id, userid:req.userid}, item)
    .then(result =>{
        console.log(result.nModified );
        if(result.nModified === 0)return res.status(400).json({msg:'updation failed'})
        res.status(200).json({msg:'updated successfully'})
    })
    .catch(err=>{
        res.status(400).json({msg:err.message})
    })
})

router.delete('/:id',checkauth, async(req,res)=>{
try{
       const item = await Item.findOne({_id:req.params.id, userid:req.userid})
       if(!item) return res.status(400).json({msg:'Unauthorised access'})
     
        await item.remove()
    res.json({msg:'Deleted item'})
   } 
   catch(err){
    res.status(500).json({msg:err.message})
   }
})


module.exports = router;