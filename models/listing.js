const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{ 
      type:   String,
    },
    description: String,
    image: {
    filename: String,
    url: String,
    // default:  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
// "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    // set:
    //  (v) => v === "" ? "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60": v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
});

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;