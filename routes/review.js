const express = require("express");

const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

//const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req , res , next) => {
  let { error} = reviewSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg); 

  } else {
    next();
  }
};



//reviews route 
//post  review route
router.post("/" , isLoggedIn, validateReview ,async(req,res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      newReview.author = req.user._id;
     await newReview.save();
     await listing.save();
      req.flash("success" , "New Review Created!");
          res.redirect(`/listings/${listing._id}`);
});
// delete  review route

router.delete("/:reviewId" , isLoggedIn , isReviewAuthor ,wrapAsync(async (req, res )=> {
  let {id , reviewId} = req.params;
   await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "New Review Delete!");
   res.redirect(`/listings/${id}`);
}));

module.exports = router;