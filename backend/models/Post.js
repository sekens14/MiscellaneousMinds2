// In-memory storage for testing (replace with MongoDB later)
let posts = [];
let currentId = 1;

class Post {
  constructor(data) {
    this.id = currentId++;
    this.title = data.title;
    this.description = data.description || '';
    this.mediaType = data.mediaType;
    this.mediaUrl = data.mediaUrl || null;
    this.externalLink = data.externalLink || null;
    this.linkPlatform = data.linkPlatform || null;
    this.category = data.category;
    this.tags = data.tags || [];
    this.userId = data.userId || 'test-user';
    this.username = data.username || 'testuser';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(data) {
    const post = new Post(data);
    posts.push(post);
    return post;
  }

  static find() {
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static findById(id) {
    return posts.find(post => post.id === parseInt(id));
  }

  static findByCategory(category) {
    return posts.filter(post => post.category === category);
  }

  static deleteById(id) {
    const index = posts.findIndex(post => post.id === parseInt(id));
    if (index !== -1) {
      return posts.splice(index, 1)[0];
    }
    return null;
  }
}

module.exports = Post;