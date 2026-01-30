const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
require("dotenv").config();

const app = express();
connectDB();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://xdone-server.onrender.com" // add this later
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/summary", summaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
