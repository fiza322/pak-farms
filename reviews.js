const express=require('express');

const path=require('path');
const router =express.Router({mergeParams:true});
const{validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');

const Farmhouse=require('../models/farmhouses');


const Review=require('../models/review');
const reviews=require('../controllers/reviews');
const {reviewSchema}=require('../schemas.js');

const ExpressError=require('../utils/ExpressError');

const catchAsync=require('../utils/catchAsync');



router.post('/',isLoggedIn, validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReviews));

module.exports=router;
