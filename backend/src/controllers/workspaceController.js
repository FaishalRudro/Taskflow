const { createClient } = require('@supabase/supabase-js');

const getServiceClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const getWorkspaces = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*, workspace_members(*)')
      .eq('owner_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ workspaces: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createWorkspace = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: 'Workspace name required' });

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({ name, description, owner_id: req.user.id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspace.id, user_id: req.user.id, role: 'admin' });

    res.status(201).json({ message: 'Workspace created', workspace });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;
    const { name, description } = req.body;

    const { data, error } = await supabase
      .from('workspaces')
      .update({ name, description })
      .eq('id', id)
      .eq('owner_id', req.user.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Workspace updated', workspace: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const supabase = getServiceClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)
      .eq('owner_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace };