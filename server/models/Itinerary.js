const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  startPoint: { type: String, required: true },
  destination: {type: String,required:  true},
  startDate : {type: Date, required: true},
  endDate: {type: Date, required: true},
  budget: {type: Number, required: true},
  noOfPeople: {type: Number, required: true},
  preferences: [String], //e.g. ['Veg','History']

  // AI stored response
  generatedPlan: {
    type: Object,
    reuired: true
  },

  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);