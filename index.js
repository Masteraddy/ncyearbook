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
  res.send("The documentary will be here");
});

app.use("/api/user", userRoutes);
app.use("/api/matric", matricRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
