const { createClient } = require('@supabase/supabase-js');

const getServiceClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const getProjects = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { workspaceId } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ projects: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name required' });

    const { data, error } = await supabase
      .from('projects')
      .insert({ name, description, workspace_id: workspaceId, created_by: req.user.id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Project created', project: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;
    const { name, description } = req.body;

    const { data, error } = await supabase
      .from('projects')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Project updated', project: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };