const mongoose = require("mongoose");
const MealPlan = require("./models/MealPlan");

mongoose.connect("mongodb://127.0.0.1:27017/dabba-food-service");

const mealPlans = [
  {
    name: "Premium",
    items: ["Grilled Salmon", "Quinoa Salad", "Fresh Juice"],
    price: 25,
    description:
      "A premium meal plan with top-quality ingredients and balanced nutrition.",
    image: "https://cdn.dotpe.in/longtail/store-items/9092180/3lhQdeB0.webp",
  },
  {
    name: "Executive",
    items: ["Steak", "Mashed Potatoes", "Red Wine"],
    price: 30,
    description:
      "An executive meal plan with gourmet dishes to satisfy your cravings.",
    image: "https://homeskitchen.in/img/south-indian-executive.jpg",
  },
  {
    name: "Half Executive",
    items: ["Grilled Chicken", "Steamed Vegetables", "Lemonade"],
    price: 20,
    description:
      "A half-executive meal plan for those who want quality with portion control.",
    image: "https://foodservices.ae/wp-content/uploads/2024/05/vegthali.jpg",
  },
  {
    name: "Regular",
    items: ["Pasta", "Garlic Bread", "Iced Tea"],
    price: 15,
    description:
      "A regular meal plan offering a well-balanced and delicious meal.",
    image:
      "https://foost.com.au/wp-content/uploads/2019/10/2f46cba4d4c4a74bcc24b6220f17ffea0fc58861-1-e1571884940848.png",
  },
];

MealPlan.insertMany(mealPlans)
  .then(() => {
    console.log("Meal plans seeded successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding meal plans:", err);
    mongoose.connection.close();
  });
