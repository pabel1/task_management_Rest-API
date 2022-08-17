const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  getTaskByStatus,
  getTaskCountByStatus,
} = require("../Controller/taskController");
const authVerification = require("../Middleware/authVerification");
const router = express.Router();

// task create router
router.post("/createtask", authVerification, createTask);

// task update route
router.put("/updatetask/:id/:status", authVerification, updateTask);
// task delete route
router.delete("/deletetask/:id", authVerification, deleteTask);

// task by status
router.get("/gettask/:id", authVerification, getTaskByStatus);
router.get("/taskcount", authVerification, getTaskCountByStatus);

module.exports = router;
