const express = require('express')
const User = require('../models/user')
const checkauth = require('../middleware/check-auth-admin')

const router = express.Router();




module.exports = router;