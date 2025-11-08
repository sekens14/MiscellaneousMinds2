const express = require('express');
const router = express.Router();

// SUPER SIMPLE test route
router.get('/test', (req, res) => {
  console.log('📝 TEST ROUTE HIT!');
  res.json({ 
    message: '✅ POSTS TEST ROUTE IS WORKING!',
    timestamp: new Date().toISOString()
  });
});

// GET all posts
router.get('/', (req, res) => {
  res.json({
    message: 'All posts endpoint',
    posts: Post.find()
  });
});

// GET post by id
router.get('/:id', (req, res) => {
  const post = Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// CREATE post
router.post('/', (req, res) => {
  const created = Post.create(req.body);
  res.status(201).json(created);
});

// DELETE post
router.delete('/:id', (req, res) => {
  const removed = Post.deleteById(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Post not found' });
  res.json({ message: 'Deleted', post: removed });
});

console.log('✅ Posts routes file loaded');

module.exports = router;