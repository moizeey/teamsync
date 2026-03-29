import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, columnTitle, refreshTasks }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [assignee, setAssignee] = useState('');
    const titleInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setDescription('');
            setAssignee('');
            setPriority('low');
            setStartDate('');
            setEndDate('')
            // Focus title input when modal opens
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title, description, priority, startDate, endDate, assignee });
        refreshTasks();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Create Task <span className="text-sm font-normal text-gray-500">in {columnTitle}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={titleInputRef}
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="What needs to be done?"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Add details..."
                        />
                    </div>
                    <div className='mt-4'>

                        <label className='block text-sm font-medium text-gray-700' >Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border'
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>

                        </select>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                            <input type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors cursor-pointer' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>End Date</label>
                            <input type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors cursor-pointer' />
                        </div>
                    </div>
                    <div className='mt-4 mb-4'>
                        <label className='block text-sm font-medium text-gray-700' >Assignee</label>
                        <input type="text"
                            placeholder='e.g John Doe'
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border'
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)} />

                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
