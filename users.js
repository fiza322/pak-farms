const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const User=require('../models/user');
const users=require('../controllers/users');
const passport = require('passport');

router.route('/register')
.get(users.register)
.post(catchAsync(users.registerMe));

router.route('/login')
.get(users.login)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginme)


router.get('/logout',users.logout);

module.exports=router;