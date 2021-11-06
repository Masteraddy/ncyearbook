require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./configs/db");
const app = express();

// Routes
const userRoutes = require("./routes/user.routes");
const matricRoutes = require("./routes/matric.routes");

const PORT = process.env.PORT || 3030;

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SOrry! I changed my mind, Check API Documentation in API-Test.http file.");
});

app.use("/api/user", userRoutes);
app.use("/api/matric", matricRoutes);

app.use("*", (req, res) =>
  res.status(404).json({ success: false, message: "This route is not found!" })
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
