// In-memory storage for development
let posts = [];
let currentId = 1;

class Post {
  constructor(data) {
    this._id = currentId.toString();
    this.title = data.title;
    this.description = data.description || '';
    this.mediaType = data.mediaType || 'text';
    this.mediaUrl = data.mediaUrl || null;
    this.externalLink = data.externalLink || null;
    this.linkPlatform = data.linkPlatform || null;
    this.category = data.category || 'other';
    this.tags = data.tags || [];
    this.userId = data.userId || 'test-user';
    this.username = data.username || 'testuser';
    this.likes = data.likes || 0;
    this.views = data.views || 0;
    this.comments = data.comments || [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(data) {
    const post = new Post(data);
    posts.push(post);
    return post;
  }

  static find() {
    return Promise.resolve([...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }

  static findById(id) {
    return Promise.resolve(posts.find(post => post._id === id));
  }

  static findByCategory(category) {
    return Promise.resolve(posts.filter(post => post.category === category));
  }

  static findByIdAndUpdate(id, updateData) {
    const index = posts.findIndex(post => post._id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updateData, updatedAt: new Date() };
      return Promise.resolve(posts[index]);
    }
    return Promise.resolve(null);
  }

  static findByIdAndDelete(id) {
    const index = posts.findIndex(post => post._id === id);
    if (index !== -1) {
      return Promise.resolve(posts.splice(index, 1)[0]);
    }
    return Promise.resolve(null);
  }

  save() {
    // For in-memory, just return the instance
    return Promise.resolve(this);
  }
}

// Add some sample posts for testing
posts.push(
  new Post({
    title: 'Welcome to Miscellaneous Minds!',
    description: 'This is a sample post to test our community platform',
    mediaType: 'text',
    category: 'social',
    userId: 'system',
    username: 'admin'
  })
);

console.log('✅ In-memory Post model loaded with sample data');

module.exports = Post;