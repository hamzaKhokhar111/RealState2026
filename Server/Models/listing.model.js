import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String, // ✅ yahan string hoga
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: [String], // ✅ array of strings (har image ka URL string me hoga)
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId, // ✅ user ko ref karna ho to ObjectId use karo
      ref: "User", // agar user model ka naam User hai
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
