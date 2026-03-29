import { Trash2, Pencil, Check, X, Plus } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import EditTaskModal from './EditTaskModal';
import DeleteConfirmModal from './DeleteConfirmModal';


const TaskCard = ({ task, index, onDelete, refreshTasks }) => {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);



    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'bg-green-500 text-green-200 ';
            case 'medium':
                return 'bg-yellow-500 text-yellow-200 ';
            case 'high':
                return 'bg-red-500 text-red-200 ';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-700';
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    }


    return (

        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow group"
                >

                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 break-words">{task.title}</h3>

                            {task.description && (
                                <p className="mt-1 text-sm text-gray-500 break-words whitespace-pre-wrap">{task.description}</p>
                            )}
                            {task.priority && (
                                <span className={`text-[10px]  font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            )}
                            <div className='flex justify-between items-center mt-4 border-t border-gray-100 pt-3'>
                                <div className="flex items-center text-xs text-gray-600">
                                    <span className="bg-gray-200 text-gray-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 text-[10px] font-bold">
                                        {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
                                    </span>
                                    <span className="truncate max-w-[80px]">
                                        {task.assignee || 'Unassigned'}
                                    </span>
                                </div>
                                {(task.startDate || task.endDate) && (
                                    <div className="flex items-center text-[10px] text-gray-500 font-medium">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        {formatDate(task.startDate)} {task.endDate && ` - ${formatDate(task.endDate)}`}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                aria-label="Edit task"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                id={task._id}
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                aria-label="Delete task"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    <EditTaskModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        task={task}
                        refreshTasks={refreshTasks}
                    />
                    <DeleteConfirmModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={() => onDelete(task._id)}
                        taskTitle={task.title}
                    />
                </div>

            )}
        </Draggable>

    );
};

export default TaskCard;
