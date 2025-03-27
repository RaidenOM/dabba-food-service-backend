const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  meal: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
  },
  timestamp: {
    type: Date,
  },
  location: {
    type: String,
  },
});
