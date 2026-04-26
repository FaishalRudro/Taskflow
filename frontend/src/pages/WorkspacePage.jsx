import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/workspaces/${workspaceId}/projects`);
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post(`/workspaces/${workspaceId}/projects`, newProject);
      setProjects([...projects, res.data.project]);
      setNewProject({ name: '', description: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/my-tasks')} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">
            My Tasks
          </button>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:underline">
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          {isAdmin && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Admin</span>
          )}
        </div>

        {isAdmin && (
          <form onSubmit={createProject} className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No projects yet.{isAdmin ? ' Create one above!' : ''}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.description || 'No description'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}