import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

connectDB();

const app = express()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("API is running...")
})

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default app;