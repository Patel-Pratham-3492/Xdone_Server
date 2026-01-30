const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["todo", "done"], default: "todo" },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Task", taskSchema);
