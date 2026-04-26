import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TaskModal({ task, onClose, onUpdate }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [task.id]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/tasks/${task.id}/comments`);
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/tasks/${task.id}/comments`, { content: newComment });
      setComments([...comments, res.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  task.priority === 'high' ? 'bg-red-200 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                  'bg-green-200 text-green-700'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-4">{task.description}</p>
          )}

          {task.due_date && (
            <p className="text-sm text-gray-500 mb-4">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}

          <hr className="my-4" />

          <h3 className="font-semibold text-gray-700 mb-3">Comments ({comments.length})</h3>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-800">{comment.content}</p>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addComment} className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? '...' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}