import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';

const STATUSES = ['todo', 'in_progress', 'in_review', 'done'];
const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done'
};
const STATUS_COLORS = {
  todo: 'bg-gray-100',
  in_progress: 'bg-blue-100',
  in_review: 'bg-yellow-100',
  done: 'bg-green-100'
};

export default function ProjectPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', assignee_id: '' });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const taskData = {
        ...newTask,
        assignee_id: newTask.assignee_id || user.id
      };
      const res = await api.post(`/projects/${projectId}/tasks`, taskData);
      setTasks([...tasks, res.data.task]);
      setNewTask({ title: '', description: '', priority: 'medium', assignee_id: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const getUserName = (assigneeId) => {
    if (!assigneeId) return null;
    if (assigneeId === user?.id) return 'Me';
    const found = users.find(u => u.id === assigneeId);
    return found ? found.name : 'Assigned';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/my-tasks')} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">
            My Tasks
          </button>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:underline">
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kanban Board</h2>
          {isAdmin && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Admin</span>
          )}
        </div>

        {isAdmin && (
          <form onSubmit={createTask} className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="flex-1 min-w-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="flex-1 min-w-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={newTask.assignee_id}
              onChange={(e) => setNewTask({ ...newTask, assignee_id: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Assign to: Me</option>
              {users.filter(u => u.id !== user?.id).map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Adding...' : '+ Add Task'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-700 mb-3">
                  {STATUS_LABELS[status]}
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {getTasksByStatus(status).length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {getTasksByStatus(status).map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg ${STATUS_COLORS[status]} cursor-pointer hover:opacity-80`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{task.description}</p>
                      )}
                      {task.assignee_id && (
                        <p className="text-xs text-purple-600 mt-1">
                          👤 {getUserName(task.assignee_id)}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-200 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-green-200 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        {isAdmin && (
                          <div onClick={(e) => e.stopPropagation()} className="flex gap-1">
                            {status !== 'done' && (
                              <button
                                onClick={() => updateStatus(task.id, STATUSES[STATUSES.indexOf(status) + 1])}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                →
                              </button>
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}