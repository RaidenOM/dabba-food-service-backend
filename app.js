const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Customer = require("./models/Customer");
const { createToken } = require("./UtilityFunctions");
const MealPlan = require("./models/MealPlan");
const PaymentInfo = require("./models/PaymentInfo");
const { verifyToken } = require("./middleware");
const app = express();
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage: storage });
const http = require("http");
const { Server } = require("socket.io");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

mongoose.connect("mongodb://127.0.0.1:27017/dabba-food-service");

app.post("/register", async (req, res) => {
  const { firstName, lastName, type, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
    phone: phone,
    type: type,
  });
  const savedUser = await user.save();

  if (type === "customer") {
    const { address, email } = req.body;
    const customer = new Customer({
      userId: user,
      address: address,
      email: email,
    });
    await customer.save();
  }

  const token = createToken(savedUser._id);

  res.json({ savedUser: savedUser, token: token });
});

app.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone: phone });

  if (!user) return res.json({ message: "Invalid phone or password" });

  const passwordVerification = await bcrypt.compare(password, user.password);
  if (!passwordVerification)
    return res.json({ message: "Invalid phone or password" });

  const token = createToken(user._id);
  res.json({ token: token });
});

app.get("/profile", verifyToken, async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const user = await User.findById(id);
  let profile;
  if (user.type === "customer") {
    profile = await Customer.findOne({ userId: id })
      .populate("userId")
      .populate("mealPlanId");
  }
  console.log(profile);
  res.json(profile);
});

app.get("/mealplan", async (req, res) => {
  const mealPlans = await MealPlan.find();
  res.json(mealPlans);
});

app.post("/mealplan", upload.single("image"), async (req, res) => {
  const { name, description, price, items } = req.body;

  const imageUrl = req.file ? req.file.path : null;

  const mealPlan = new MealPlan({
    name: name,
    description: description,
    image: imageUrl,
    price: price,
    items: JSON.parse(items),
  });

  const savedMealPlan = await mealPlan.save();

  res.json({ mealPlan: savedMealPlan });
});

app.put("/mealplan/:id", upload.single("image"), async (req, res) => {
  const { name, description, price, items } = req.body;
  const { id } = req.params;

  const imageUrl = req.file ? req.file.path : null;

  const existingMealPlan = await MealPlan.findById(id);
  const updatedMealPlan = await MealPlan.findByIdAndUpdate(
    id,
    {
      name: name,
      price: price,
      description: description,
      items: items,
      image: imageUrl ? imageUrl : existingMealPlan.image,
    },
    { new: true }
  );

  res.json({ updatedMealPlan: updatedMealPlan });
});

app.put("/status", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { status } = req.body;
  const user = await User.findById(id);
  const customer = await Customer.findOne({ userId: user.id })
    .populate("mealPlanId")
    .populate("userId");
  customer.status = status;
  const savedCustomer = await customer.save();
  console.log(savedCustomer);
  res.json(savedCustomer);
});

app.post("/paymentinfo", async (req, res) => {
  const { customerId, mealPlanId, paymentMethod, breakfast, lunch, dinner } =
    req.body;
  const paymentInfo = new PaymentInfo({
    customerId,
    mealPlanId,
    paymentMethod,
    breakfast,
    lunch,
    dinner,
  });
  const savedPaymentInfo = await paymentInfo.save();

  // find meal plan
  const mealPlan = await MealPlan.findById(mealPlanId);

  let count = 0;
  breakfast && count++;
  lunch && count++;
  dinner && count++;

  const customer = await Customer.findById(customerId).populate("userId");
  customer.balance = (customer.balance || 0) + mealPlan.price * count * 30;
  customer.status = "Active";
  customer.mealPlanId = mealPlanId;
  customer.breakfast = breakfast;
  customer.lunch = lunch;
  customer.dinner = dinner;
  await customer.save();

  console.log(customer.userId._id.toString());

  io.to(customer.userId._id.toString()).emit(
    "payment-confirm",
    customer.populate("mealPlanId")
  );

  res.json({ paymentInfo: savedPaymentInfo });
});

// socket io setup
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User with socket id: ${socket.id} joined room ${userId}`);
  });

  socket.on("leave-room", (userId) => {
    socket.leave(userId);
    console.log(`User with socket id: ${socket.id} left room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on PORT: 3000");
});
