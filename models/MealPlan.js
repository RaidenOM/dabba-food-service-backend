const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  items: [String],
  price: Number,
  description: String,
  image: String,
});

module.exports = mongoose.model("MealPlan", MealPlanSchema);
