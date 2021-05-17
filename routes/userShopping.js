const express = require('express')
const User = require('../models/user')
const Item = require('../models/item')
const Cart = require('../models/cart')
const userRole = require('../models/userRoles')

const router = express.Router()


router.post('/', (req, res)=>{
    // console.log(req.body.allitems);
    
    const newcart = new Cart({
    allitems: req.body.allitems,
    userid: req.body.userid,
    month: req.body.month    
    })

    
    let selectedItems = req.body.allitems.map(item=>{
        return item.itemtaken
    })

    let totalamt = 0
    
    Item.find({
        _id:{$in:selectedItems}
    })
    .then(item=>{
        
        for(let i=0; i<item.length;i++){
            if(req.body.allitems[i].qty> item[i].qty){
                
                return res.status(403).json({msg:`there are only ${item[i].qty} left for ${item[i].name}`})
                
            }
        }
        item.forEach((x,i)=>{
        totalamt += x.price * (req.body.allitems[i].qty)

            x.qty -= req.body.allitems[i].qty
            
            x.save()
        })
        newcart.totalPrice = totalamt
        newcart.save()
        
        res.json({totalamt})
    })
    .catch(err=>{
        console.log(err);
        res.send({err})
    })

    
})

router.delete('/:id', (req, res)=>{
    Cart.findOne({_id:req.params.id})
    .then(cart=>{
        
        if(!cart) return res.status(400).json({msg:'order not found'})
    
        if(cart.userid!=req.body.userid) return res.status(401).json({msg:'unauthorised request'})
        cart.allitems.forEach(x=>{
            Item.findOne({_id: x.itemtaken})
            .then(item=>{
                item.qty += x.qty

                item.save()
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({msg:'server error'})
            })
        })
        
        cart.remove()
        .then(result=>{
            console.log(result);
            res.status(204)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({msg:'server error'})
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({msg:'server error'})
    })
})

module.exports = router