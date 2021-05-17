const User = require('../models/user')
const userRole = require('../models/userRoles')

module.exports = (req, res,next)=>{
    // console.log(req.body.mail);
    User.findOne({email:req.body.mail})
    .then(user=>{
        // console.log(user);
        if(!user || user.role!==userRole['admin'])
         return res.status(400).json({msg:'Unauthorised access'})
        if(user.status==='pending')
        return res.status(400).json({msg:'account is not verified'})
        req.userid = user._id
        
        next()
    })
    .catch(err=>{
        res.json(err)
    })
}