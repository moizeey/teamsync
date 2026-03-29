import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const columns = [
    { id: 'todo', title: 'To Do', bg: 'bg-gray-100' },
    { id: 'inprogress', title: 'In Progress', bg: 'bg-blue-50' },
    { id: 'done', title: 'Done', bg: 'bg-green-50' },
];

const Board = ({ tasks, setTasks, fetchTasks }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [activeColumnId, setActiveColumnId] = useState('todo'); // Default to todo


    const handleDragEnd = async (result) => {
        setIsDragging(false);
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const taskToUpdate = tasks.find(t => t._id === draggableId);

        // Optimistic Update
        const updatedTasks = tasks.map(t => {
            if (t._id === draggableId) {
                return { ...t, status: destination.droppableId };
            }
            return t;
        });
        console.log(destination.droppableId, "destination")
        if (destination.droppableId == "done") {
            toast.success("Task Completed")
        }
        setTasks(updatedTasks);

        try {
            await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update task status');
            // Revert on failure
            fetchTasks();
        }
    };

    const handleDelete = async (id) => {


        // Optimistic delete
        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t._id !== id));

        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
            setTasks(previousTasks);
        }
    };

    const handleUpdateTask = async (id, updates) => {
        const previousTasks = [...tasks];

        // Optimistic update
        setTasks(tasks.map(t => t._id === id ? { ...t, ...updates } : t));

        try {
            await api.put(`/tasks/${id}`, updates);
            toast.success('Task updated');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update task');
            setTasks(previousTasks);
        }
    };

    const handleOpenModal = (columnId) => {
        setActiveColumnId(columnId);
        setIsModalOpen(true);
    };

    const handleCreateTask = async (taskData) => {
        // taskData contains { title, description }
        try {
            const response = await api.post('/tasks', {
                ...taskData,
                status: activeColumnId,
            });
            setTasks([...tasks, response.data]);
            toast.success('Task created');
        } catch (error) {
            console.error('Create task error', error);
            toast.error('Failed to create task');
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const getActiveColumnTitle = () => {
        return columns.find(c => c.id === activeColumnId)?.title || 'Board';
    }



    return (
        <div className="h-full flex flex-col">
            <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
                <div className={`flex h-full gap-6 overflow-x-auto overflow-y-hidden pb-4 md:overflow-visible ${!isDragging ? 'snap-x snap-mandatory' : ''}`}>
                    {columns.map((column) => (
                        <div key={column.id} className={`flex-shrink-0 w-[280px] sm:w-[350px] flex snap-center flex-col rounded-lg p-4 ${column.bg} max-h-full`}>
                            <h2 className="mb-4 font-semibold text-gray-700 flex justify-between items-center">

                                <div className="flex items-center gap-2">

                                    {column.title}
                                    <span className="bg-white/50 text-gray-600 text-xs px-2 py-1 rounded-full">
                                        {getTasksByStatus(column.id).length}
                                    </span>
                                </div>
                                <button             
                                    onClick={() => handleOpenModal(column.id)}
                                    className="p-1 hover:bg-white/50 rounded-full transition-colors text-gray-600 hover:text-blue-600"
                                    aria-label={`Add task to ${column.title}`}
                                >
                                    <Plus size={20} />
                                </button>
                            </h2>
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="min-h-[10px] h-full"
                                        >
                                            {getTasksByStatus(column.id).map((task, index) => (
                                                <TaskCard
                                                    key={task._id}
                                                    task={task}
                                                    index={index}
                                                    onDelete={handleDelete}
                                                    onUpdate={handleUpdateTask}
                                                    refreshTasks={fetchTasks}

                                                />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
                columnTitle={getActiveColumnTitle()}
                refreshTasks={fetchTasks}
            />
        </div>
    );
};

export default Board;
