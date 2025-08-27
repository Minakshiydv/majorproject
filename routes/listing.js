const express = require("express");

const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
 const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner} = require("../middleware.js");
const { Cursor } = require("mongoose");
//const ExpressError = require("../utils/ExpressError.js")
const listingController = require("../controllers/listing.js");



//const validateListing = (req , res , next) => {
  //let { error} = listingSchema.validate(req.body.listing);
  //if(error) {
    //let errMsg = error.details.map((el) => el.message).join(",");
    //throw new ExpressError(400 , errMsg); 

  //} else {
    //next();
  //}
//};



//Index Route
router.get("/" , wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn ,listingController.renderNewForm);

//Show Route
router.get("/:id", listingController.showListing);

//Create Route
router.post("/",  isLoggedIn , wrapAsync(listingController.createListing)

  );

//Edit Route
router.get("/:id/edit", isLoggedIn , isOwner ,listingController.editListing);

//Update Route
router.put("/:id", isLoggedIn , isOwner ,listingController.updateListing);

  //Delete Route
  router.delete("/:id",isLoggedIn ,  isOwner , listingController.deleteListing);

  module.exports = router;
