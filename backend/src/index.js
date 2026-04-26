const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const workspaceRoutes = require('./routes/workspaces');
app.use('/api/workspaces', workspaceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskFlow API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});