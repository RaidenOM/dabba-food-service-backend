const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Active", "BalanceExhausted", "Discontinued", "MealOff"],
    default: "Discontinued",
  },
  balance: {
    type: Number,
    default: 0,
  },
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealPlan",
  },
  breakfast: {
    type: Boolean,
    default: false,
  },
  lunch: {
    type: Boolean,
    default: false,
  },
  dinner: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
