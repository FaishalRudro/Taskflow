import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';

const STATUS_COLORS = {
  todo: 'bg-gray-100',
  in_progress: 'bg-blue-100',
  in_review: 'bg-yellow-100',
  done: 'bg-green-100'
};

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done'
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get('/tasks/my-tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:underline">Dashboard</button>
          <span className="text-sm text-gray-600">Hello, {user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Tasks</h2>
        <p className="text-gray-500 text-sm mb-6">Tasks assigned to you across all projects</p>

        <div className="flex gap-2 mb-6">
          {['all', 'todo', 'in_progress', 'in_review', 'done'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned to you.</p>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl cursor-pointer hover:shadow-md transition ${STATUS_COLORS[task.status]}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-200 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-green-200 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-gray-600 border">
                      {STATUS_LABELS[task.status]}
                    </span>
                  </div>
                </div>
                {task.due_date && (
                  <p className="text-xs text-gray-400 mt-2">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
            setTasks(tasks.map(t => t.id === updated.id ? updated : t));
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}