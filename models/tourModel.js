const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

// Creating the schema
const tourSchema = new mongoose.Schema(
  {
    // Fields for the data
    name: {
      type: String,
      required: [true, "Name is must"],
      unique: true,
      minLength:[10,"A tour name must be of more than or equal to  10 characters"],
      maxLength:[40,"A tour name must be of less than or equal to  40 characters"],
      validate:{
        validator:validator.isAlpha
      }
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
      enum:{
        values:["easy","medium","difficult"],
        message:"Easy, medium, difficult are only available difficulties"
      }
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min:[1,"the min ratings avg must be 1"],
      max:[5,"the max ratings avg must be 5"]
    },

    ratingsQuantity: {
      type: Number,
      default: 4.5,
    },

    price: {
      type: Number,
      required: [true, "A Tour mush have a price"],
    },

    discount:{
      type: Number,
      // Custom validators
      validate:{
        validator:function(value){
          return value <= 0.5*this.price
        },
        message:"Discount ({VALUE}) can not be greater than 50% of the price"
      }
    },

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

    slug: String,

    // To create a tour that wont be visble through API
    secretTour: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual Properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Document middleware
// Pre works only on create() and save() and the callback provided is run on the event
tourSchema.pre("save", function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
// To remove the secret tours from a query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now()
  next();
});

tourSchema.post(/^find/g,function(docs,next){
  console.log(`Query took ${Date.now()-this.start} milliseconds`)
  // console.log(docs)
  next()
})

// Aggregation middlewares 
// these are run befor an aggregation request  
tourSchema.pre("aggregate",function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})

  console.log(this.pipeline())
  next()
})


// creating the model
// eslint-disable-next-line new-cap
const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
