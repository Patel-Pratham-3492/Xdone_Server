const mongoose = require("mongoose");
const Task = require("./models/Task");
const DailySummary = require("./models/DailySummary");

require("dotenv").config();

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

async function rebuild() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected");

  // Clear summaries
  await DailySummary.deleteMany({});
  console.log("Old summaries removed");

  const tasks = await Task.find({});
  const map = {};

  tasks.forEach(task => {
    const dateKey = normalizeDate(task.date).toISOString();

    if (!map[dateKey]) {
      map[dateKey] = {
        date: normalizeDate(task.date),
        totalTasks: 0,
        completedTasks: 0
      };
    }

    map[dateKey].totalTasks += 1;
    if (task.status === "done") {
      map[dateKey].completedTasks += 1;
    }
  });

  for (const key in map) {
    const d = map[key];
    const ratio = d.totalTasks === 0 ? 0 : d.completedTasks / d.totalTasks;

    let color = "yellow";
    if (ratio === 1) color = "green";
    else if (ratio >= 0.5) color = "lightGreen";
    else if (ratio > 0) color = "orange";

    await DailySummary.create({
      date: d.date,
      totalTasks: d.totalTasks,
      completedTasks: d.completedTasks,
      completionColor: color,
      isFullyCompleted: d.totalTasks > 0 && d.completedTasks === d.totalTasks
    });
  }

  console.log("Rebuild completed");
  process.exit();
}

rebuild();
