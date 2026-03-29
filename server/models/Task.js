import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    // Relation with User links task to user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    status: {
        type: String,
        enum: ["todo", "inprogress", "done"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    startDate: {
        type: Date,

    },
    endDate: {
        type: Date,
        default: null
    },
    assignee: {
        type: String
    }

}, {
    timestamps: true,
})

export default mongoose.model("Task", taskSchema)
