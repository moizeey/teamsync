import express from "express";
const router = express.Router()
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { protectedRoute } from "../middleware/authMiddleware.js"

router.get("/", protectedRoute, getTasks)
router.post("/", protectedRoute, createTask)
router.put("/:id", protectedRoute, updateTask)
router.delete("/:id", protectedRoute, deleteTask)

export default router;