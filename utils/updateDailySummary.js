const Task = require("../models/Task");
const DailySummary = require("../models/DailySummary");

module.exports = async function updateDailySummary(date) {
  const start = new Date(date);
  start.setHours(0,0,0,0);

  const end = new Date(date);
  end.setHours(23,59,59,999);

  const tasks = await Task.find({ date: { $gte: start, $lte: end } });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;

  let completionColor = "yellow";
  let isFullyCompleted = false;

  if (totalTasks > 0 && completedTasks === totalTasks) {
    completionColor = "green";
    isFullyCompleted = true;
  } else if (completedTasks > 0) {
    completionColor = "orange";
  }

  await DailySummary.findOneAndUpdate(
    { date: start },
    {
      date: start,
      totalTasks,
      completedTasks,
      completionColor,
      isFullyCompleted
    },
    { upsert: true, new: true }
  );
};
