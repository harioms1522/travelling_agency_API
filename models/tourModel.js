const mongoose = require("mongoose");

// Creating the schema
const tourSchema = new mongoose.Schema(
  {
    // Fields for the data
    name: {
      type: String,
      required: [true, "Name is must"],
      unique: true,
    },

    duration: {
      type: Number,
      required: [true, "A Tour must have a duration"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A Tour mush have a group"],
    },

    difficulty: {
      type: String,
      required: [true, "A Tour mush have a difficulty"],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 4.5,
    },

    price: {
      type: Number,
      required: [true, "A Tour mush have a price"],
    },

    discount: Number,

    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour mush have a price"],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A Tour must have a cover image"],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    startDates: [Date],
  },
  { toJSON: { virtuals: true } }
);

// creating the model
// eslint-disable-next-line new-cap
const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
