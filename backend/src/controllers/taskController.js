const { createClient } = require('@supabase/supabase-js');

const getServiceClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const getTasks = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { projectId } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ tasks: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { projectId } = req.params;
    const { title, description, status, priority, assignee_id, due_date } = req.body;

    if (!title) return res.status(400).json({ error: 'Task title required' });

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        project_id: projectId,
        assignee_id,
        due_date,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Task created', task: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;
    const { title, description, status, priority, assignee_id, due_date } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .update({ title, description, status, priority, assignee_id, due_date })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Task updated', task: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['todo', 'in_progress', 'in_review', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Status updated', task: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, updateTaskStatus, deleteTask };