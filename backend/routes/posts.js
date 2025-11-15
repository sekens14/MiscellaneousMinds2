const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Add this import

// GET all posts
router.get('/', async (req, res) => {
  try {
    console.log('📝 Fetching all posts...');
    const posts = await Post.find();
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
});

// GET post by id
router.get('/:id', async (req, res) => {
  try {
    console.log(`📝 Fetching post with ID: ${req.params.id}`);
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post'
    });
  }
});

// CREATE new post
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new post...', req.body);
    
    const { title, description, mediaType, mediaUrl, externalLink, linkPlatform, category, tags, userId, username } = req.body;
    
    // Basic validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and category are required'
      });
    }
    
    const newPost = new Post({
      title,
      description,
      mediaType: mediaType || 'text',
      mediaUrl: mediaUrl || '',
      externalLink: externalLink || '',
      linkPlatform: linkPlatform || '',
      category,
      tags: tags || [],
      userId: userId || 'test-user',
      username: username || 'testuser'
    });
    
    const savedPost = await newPost.save();
    
    console.log('✅ Post created successfully:', savedPost._id);
    
    res.status(201).json({
      success: true,
      data: savedPost
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    });
  }
});

// UPDATE post
router.put('/:id', async (req, res) => {
  try {
    console.log(`📝 Updating post with ID: ${req.params.id}`);
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('❌ Error updating post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update post'
    });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    console.log(`📝 Deleting post with ID: ${req.params.id}`);
    
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Post deleted successfully',
      data: deletedPost
    });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete post'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  console.log('📝 POSTS TEST ROUTE HIT!');
  res.json({ 
    success: true,
    message: '✅ POSTS API IS WORKING!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET    /api/posts',
      'GET    /api/posts/:id',
      'POST   /api/posts',
      'PUT    /api/posts/:id', 
      'DELETE /api/posts/:id'
    ]
  });
});

console.log('✅ Posts routes loaded successfully');

module.exports = router;