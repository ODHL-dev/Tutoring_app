const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// API proxy to backend (optional)
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

app.use('/api', (req, res) => {
  // Proxy API requests to Django backend
  const fetch = require('node-fetch');
  const url = `${BACKEND_URL}${req.url}`;
  
  fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  })
    .then(r => r.json())
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`📱 Backend API: ${BACKEND_URL}`);
});
