const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { createClient } = require('@supabase/supabase-js');

const getServiceClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: role || 'employee' }
      }
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role || 'employee'
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const getAllUsers = async (req, res) => {
  try {
    const adminClient = getServiceClient();
    const { data, error } = await adminClient.auth.admin.listUsers();

    if (error) return res.status(400).json({ error: error.message });

    const users = data.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email,
      role: u.user_metadata?.role || 'employee'
    }));

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getMe, getAllUsers };