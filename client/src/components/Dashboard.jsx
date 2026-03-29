import { useAuth } from '../context/AuthContext';
import Board from './Board';
import { Layout, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import TaskChart from './TaskChart';
import { useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isChartOpen, setIsChartOpen] = useState(false);
    console.log(user, "User data")

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        }
    };

    return (
        <div className="h-screen bg-gray-50 overflow-hidden flex flex-col md:flex-row">
            {/* Mobile Header & Chart Section */}
            <div className="md:hidden flex flex-col flex-shrink-0 bg-white border-b border-gray-200">
                <header className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Layout className="h-6 w-6" />
                        <h1 className="text-lg font-bold text-gray-900">TeamSync</h1>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        aria-label="Sign out"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </header>
                
                <div className="border-t border-gray-100">
                    <button
                        onClick={() => setIsChartOpen(!isChartOpen)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                        View Project Overview
                        {isChartOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {isChartOpen && (
                        <div className="p-4 flex justify-center border-t border-gray-100">
                            <TaskChart tasks={tasks} />
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Layout className="h-8 w-8" />
                        <h1 className="text-xl font-bold text-gray-900">TeamSync</h1>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
                    <TaskChart tasks={tasks} />
                </div>

                <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                        <span className="sr-only">Sign out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden p-4 md:p-8">
                <Board
                    tasks={tasks}
                    setTasks={setTasks}
                    fetchTasks={fetchTasks}
                />
            </main>
        </div>
    );
};

export default Dashboard;
