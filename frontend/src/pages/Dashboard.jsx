import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      setWorkspaces(res.data.workspaces);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/workspaces', newWorkspace);
      setWorkspaces([...workspaces, res.data.workspace]);
      setNewWorkspace({ name: '', description: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/my-tasks')}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100"
          >
            My Tasks
          </button>
          <span className="text-sm text-gray-600">Hello, {user?.name}</span>
          {isAdmin && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Admin</span>
          )}
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isAdmin ? 'My Workspaces' : 'Workspaces'}
        </h2>

        {isAdmin && (
          <form onSubmit={createWorkspace} className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Workspace name"
              value={newWorkspace.name}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newWorkspace.description}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : '+ New'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {isAdmin ? 'No workspaces yet. Create one above!' : 'No workspaces assigned to you yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => navigate(`/workspace/${ws.id}`)}
                className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">{ws.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{ws.description || 'No description'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}