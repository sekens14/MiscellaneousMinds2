const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'In-Memory (Development Mode)',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    note: 'Using in-memory database for development'
  });
});

// Load routes with correct relative paths
console.log('🔧 Loading routes...');

// Load posts routes
try {
  const postRoutes = require('./routes/posts');
  app.use('/api/posts', postRoutes);
  console.log('✅ Posts routes loaded successfully');
} catch (error) {
  console.log('❌ ERROR loading posts routes:', error.message);
}

// Load upload routes
try {
  const uploadRoutes = require('./routes/upload');
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Upload routes loaded successfully');
} catch (error) {
  console.log('❌ ERROR loading upload routes:', error.message);
}

// API Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎭 Miscellaneous Minds API is running!',
    version: '1.0.0',
    status: 'SUCCESS',
    database: 'In-Memory (Development)',
    timestamp: new Date().toISOString(),
    features: [
      'Multi-content uploads (images, videos, audio)',
      'Social media link sharing',
      'Category-based organization',
      'User posts and comments',
      'In-memory database (no MongoDB required)'
    ],
    endpoints: {
      health: '/health',
      test: '/api/test',
      posts: '/api/posts',
      upload: '/api/upload'
    }
  });
});

// Home Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Miscellaneous Minds!',
    description: 'Community platform for sharing audio, video, images, and social media content',
    status: 'Server is running ✅',
    version: '1.0.0',
    endpoints: {
      home: '/',
      health: '/health',
      test: '/api/test',
      posts: '/api/posts',
      upload: '/api/upload'
    },
    note: 'Using in-memory database for development - data resets on server restart'
  });
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/test',
      'GET /api/posts',
      'POST /api/posts',
      'GET /api/posts/:id',
      'GET /api/upload/test',
      'POST /api/upload/single',
      'POST /api/upload/post'
    ],
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n🚀 Miscellaneous Minds Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: In-Memory (No MongoDB required)`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🏠 Home: http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log(`📊 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📝 Posts Test: http://localhost:${PORT}/api/posts/test`);
  console.log(`📁 Upload Test: http://localhost:${PORT}/api/upload/test`);
  console.log('---');
  console.log('🎯 All routes should now be available!');
  console.log('---');
});