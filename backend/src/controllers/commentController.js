const { createClient } = require('@supabase/supabase-js');

const getServiceClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const getComments = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { taskId } = req.params;

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ comments: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createComment = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { taskId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: 'Comment content required' });

    const { data, error } = await supabase
      .from('comments')
      .insert({ content, task_id: taskId, user_id: req.user.id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Comment added', comment: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getComments, createComment, deleteComment };