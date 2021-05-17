const express = require('express')
const User = require('../models/user')
const userRole = require('../models/userRoles')
const hashcodeGenerator = require('string-hash')
const nodemailer = require('nodemailer');
const Scode = require('../models/secretcode')

const router = express.Router()

router.post('/', (req, res, next)=>{
    
    const newuser = new User({
        email: req.body.email,
        role: userRole[req.body.role],
        secretcode: hashcodeGenerator(req.body.email + (Date.now().toString()))
    })

    const newScode = new Scode({
        secretcode: hashcodeGenerator(req.body.email + (Date.now().toString())),
        userid : newuser._id,
    })
    
    
    if (typeof newuser.role==='undefined')return res.status(500).json({error: 'not a valid role'})
    newuser.save()
    .then(user=>{
        
        newScode.save()
        .then(c=>{
            return sendEmailVerification(req, res, newScode, req.body.email)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err)
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err)
    })
})

router.get('/resend/:emailid', (req,res)=>{
    
    User.findOne({email:req.params.emailid})
    .then(user=>{
        const newScode = new Scode({
            secretcode: hashcodeGenerator(user.email + (Date.now().toString())),
            userid : user._id,
        })
        newScode.save()
        .then(c=>{
            return sendEmailVerification(req, res, newScode,user.email)
        })
        .catch(err=>{

            res.status(500).json(err)
        })
    })
    .catch(err=>{
        res.status(404).json(err)
    })
})

router.get('/:emailid/:secretcode', (req, res)=>{
       
    Scode.findOne({secretcode:req.params.secretcode})
    .then(c=>{
        if(!c) return res.status(400).json({msg:'verfication link has expired'})
        User.findOne({_id: c.userid, email:req.params.emailid})
        .then(user=>{
            if(!user)  return res.status(400).json({msg:'incorrect verification link'})

            user.status = 'active'
        user.save()
        .then(result =>{
            console.log(result.nModified)
            res.status(200).json({msg:'updated successfully'})
        })
        .catch(err=>{
            res.status(400).json({msg:err.message})
        })
        })
    })
})

function sendEmailVerification(req, res, newScode,emailid){
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'thepuja2018@gmail.com',
          pass: 'puja0007'
        }
      });
      
      const url = `http://127.0.0.1:3000/api/user/${emailid}/${newScode.secretcode}`
      var mailOptions = {
        from: 'thepuja2018@gmail.com',
        to: emailid,
        subject: 'Email Verification from Ecom',
        html: `<p>Click <a href=${url}>here</a> to verify your email</p>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.send(error);
        } else {
         
         res.status(200).json({'Email info': info.response, 'Activation url':url})
        }
      });
    
}


module.exports = router