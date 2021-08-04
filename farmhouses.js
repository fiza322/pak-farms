const express=require('express');
const router=express.Router();
const farmhouses=require('../controllers/farmhouses');
const catchAsync=require('../utils/catchAsync');

const {isLoggedIn,isAuthor,validateFarmhouse}=require('../middleware');
const multer  = require('multer');
const{storage}=require('../cloudinary');
const  upload = multer({ storage });

const Farmhouse=require('../models/farmhouses');


router.route('/')
       .get(catchAsync(farmhouses.index))
       .post(isLoggedIn,upload.array('image'),validateFarmhouse,catchAsync(farmhouses.createFarmhouse))

       
router.get('/new',isLoggedIn,farmhouses.renderNewForm) 
router.get('/about',isLoggedIn,farmhouses.renderNewForm) 

router.route('/:id')
.get(catchAsync(farmhouses.showFarmhouse))
.put(isLoggedIn,isAuthor,upload.array('image'),validateFarmhouse,catchAsync(farmhouses.updateFarmhouse)) 
.delete(isLoggedIn,isAuthor,catchAsync(farmhouses.destroyFarmhouse))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(farmhouses.editFarmhouse));
  
   
module.exports=router;