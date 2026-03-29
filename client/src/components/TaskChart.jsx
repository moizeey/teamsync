import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'


ChartJS.register(ArcElement, Tooltip, Legend)

const TaskChart = ({ tasks }) => {

    // Calculate the data
    const todoCount = tasks.filter(task => task.status === 'todo').length;
    const inProgressCount = tasks.filter(task => task.status === 'inprogress').length;
    const doneCount = tasks.filter(task => task.status === 'done').length;

    // If there are no tasks, show a placeholder
    if (tasks.length === 0) {
        return <div className="text-gray-500 text-sm text-center p-4">No tasks to analyze.</div>;
    }

    // 2. Format the data for Chart.js
    const data = {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [
            {
                label: 'Tasks',
                data: [todoCount, inProgressCount, doneCount],
                backgroundColor: [
                    '#E5E7EB', // Gray for To Do
                    '#3B82F6', // Blue for In Progress
                    '#10B981', // Green for Done
                ],
                borderColor: [
                    '#D1D5DB',
                    '#2563EB',
                    '#059669',
                ],
                borderWidth: 1,
            },
        ],
    };

    // 3. Configure chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        cutout: '70%', // Makes it a doughnut instead of a pie
    };

    return (
        <div className="bg-white p-4  ">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Project Overview</h2>
            <div className="flex justify-center">
                <div className="w-48 h-48">
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        </div>
    )
}

export default TaskChart
