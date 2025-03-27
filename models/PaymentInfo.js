const mongoose = require("mongoose");

const PaymentInfoSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    mealPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPlan",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      required: true,
    },
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentInfo", PaymentInfoSchema);
