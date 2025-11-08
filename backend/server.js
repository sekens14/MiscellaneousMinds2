const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

require('dotenv').config();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DEBUG: Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Try to load and use posts routes with error handling
console.log('🔧 Attempting to load posts routes...');
try {
  const postRoutes = require('./routes/posts');
  app.use('/api/posts', postRoutes);
  console.log('✅ Posts routes registered successfully');
} catch (error) {
  console.log('❌ ERROR loading posts routes:', error.message);
  console.log('Error details:', error.stack);
  
  // Create fallback routes if main routes fail
  app.get('/api/posts/test', (req, res) => {
    res.json({ 
      message: '✅ FALLBACK POSTS TEST ROUTE',
      note: 'Main routes failed to load, using fallback',
      timestamp: new Date().toISOString()
    });
  });
}

// Test route - direct route (should always work)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎭 Miscellaneous Minds API is running!',
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });
});

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Miscellaneous Minds!',
    description: 'Community platform for music, videos, movies, books, art, politics, blogs, and social media links',
    status: 'Server is running ✅',
    endpoints: {
      home: '/',
      test: '/api/test',
      posts_test: '/api/posts/test',
      posts_all: '/api/posts'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/test', 
      'GET /api/posts/test',
      'GET /api/posts'
    ]
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Miscellaneous Minds Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🏠 Home: http://localhost:${PORT}`);
  console.log(`📊 Test API: http://localhost:${PORT}/api/test`);
  console.log(`📝 Posts Test: http://localhost:${PORT}/api/posts/test`);
  console.log('---');
});