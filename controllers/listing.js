const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", {listings});
};

module.exports.renderNewForm = (req, res) => {

  res.render("listings/new");
};

module.exports.showListing= async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews" , populate: {path: "author"}, 
  }).populate("owner");
  if (!listing) {
    req.flash("error" , "Listings you requested for does not exit!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing });
};

module.exports.createListing =    async(req, res , next) => {
   const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      console.log("user in create listing" , req.user);
       await newListing.save();
       console.log(req.body);
       req.flash("success" , "New Listing Created!");
  res.redirect(`/listings ${newListing._id}`);
  };


  module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  };


  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };
  module.exports.deleteListing =  async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!")  ;
    res.redirect("/listings");
  };
  
