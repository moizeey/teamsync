import Task from "../models/Task.js"
import User from "../models/User.js"

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
        res.status(200).json(tasks)
    } catch (error) {
        console.log(error, "Error get tasks controller")
        res.status(500).json({ message: error.message })

    }
}

// @desc    Set task
// @route   POST /api/tasks
// @access  Private

const createTask = async (req, res) => {
    if (!req.body.title) {
        res.status(400).json({ message: "Please add a title" })
        return
    }
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
            priority: req.body.priority,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            assignee: req.body.assignee
        })
        res.status(200).json(task)

    } catch (error) {
        console.log(error, "Error create task controller")
        res.status(500).json({ message: error.message })

    }
}

// @desc    Update task (Move columns)
// @route   PUT /api/tasks/:id
// @access  Private

const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }

    if (!req.user) {
        return res.status(401).json({ message: "User not found" })
    }
    if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" })
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.status(200).json(updatedTask)
    } catch (error) {
        console.log(error, "Error update task controller")
        res.status(500).json({ message: error.message })

    }

}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }

    if (!req.user) {
        return res.status(401).json({ message: "User not found" })
    }
    if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" })
    }

    try {
        await task.deleteOne()
        res.status(200).json({ message: "Task deleted" })
    } catch (error) {
        console.log(error, "Error delete task controller")
        res.status(500).json({ message: error.message })
    }
}

export {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}
