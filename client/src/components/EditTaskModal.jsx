import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";



const EditTaskModal = ({ isOpen, onClose, task, refreshTasks }) => {

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [priority, setPriority] = useState(task.priority || "low")
    const [assignee, setAssignee] = useState(task.assignee || "")

    const formatForInput = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : ""
    const [startDate, setStartDate] = useState(formatForInput(task.startDate))
    const [endDate, setEndDate] = useState(formatForInput(task.endDate))

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/tasks/${task._id}`, {
                title,
                description,
                priority,
                assignee,
                startDate,
                endDate,
            })
            refreshTasks()
            toast.success('Task updated')
            onClose()
        } catch (error) {
            console.error('Error updating task:', error)
            toast.error('Failed to update task')
        }
    }

    if (!isOpen) return null
    return (
        <div className="fixed px-4 inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Task</h2>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>

                    {/* Priority & Assignee Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assignee</label>
                            <input type="text" value={assignee} onChange={(e) => setAssignee(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        </div>
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 border-t pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;