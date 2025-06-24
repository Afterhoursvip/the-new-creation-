import React, { useEffect, useState } from 'react';

// Set your backend API base URL here
const API_BASE_URL = "https://the-new-creation.onrender.com/api";

function AdminDashboard() {
  const [posts, setPosts] = useState([
    { id: 1, title: 'First Blog Post', content: 'This is the first post.', date: '2025-06-22' },
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Fetch posts from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/posts`)
      .then(res => res.json())
      .then(setPosts);
  }, []);

  // Add post to backend
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const created = await res.json();
      setPosts([created, ...posts]);
      setNewPost({ title: '', content: '' });
    }
  };

  // Delete post from backend
  const handleDeletePost = async (id) => {
    await fetch(`${API_BASE_URL}/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.id !== id));
  };

  // Users management state
  const [users, setUsers] = useState([
    { id: 1, name: 'Jane Blogger', email: 'jane@blog.com', role: 'admin' },
    { id: 2, name: 'John Writer', email: 'john@blog.com', role: 'blogger' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'blogger' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({ name: '', email: '', role: 'blogger' });
  const [showUsers, setShowUsers] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, postId: 1, author: 'Alice', text: 'Great post!', approved: false },
    { id: 2, postId: 1, author: 'Bob', text: 'Thanks for sharing!', approved: true },
  ]);
  const [categories, setCategories] = useState(['General', 'Tech', 'Life']);
  const [newCategory, setNewCategory] = useState('');
  const [siteSettings, setSiteSettings] = useState({ title: 'the new creation', description: 'A modern blog platform.' });
  const [editingSettings, setEditingSettings] = useState(false);

  // User management handlers
  const handleAddUser = async () => {
    if (newUser.name.trim() && newUser.email.trim()) {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const created = await res.json();
      setUsers([...users, created]);
      setNewUser({ name: '', email: '', role: 'blogger' });
    }
  };
  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditingUser(user);
  };
  const handleSaveUser = () => {
    setUsers(users.map(u => u.id === editingUserId ? editingUser : u));
    setEditingUserId(null);
    setEditingUser({ name: '', email: '', role: 'blogger' });
  };
  const handleDeleteUser = async (id) => {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== id));
  };

  // Comments moderation handlers
  const handleApproveComment = async (id) => {
    await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    setComments(comments.map(c => c.id === id ? { ...c, approved: true } : c));
  };
  const handleDeleteComment = async (id) => {
    await fetch(`${API_BASE_URL}/comments/${id}`, { method: 'DELETE' });
    setComments(comments.filter(c => c.id !== id));
  };

  // Categories management handlers
  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };
  const handleDeleteCategory = async (cat) => {
    await fetch(`${API_BASE_URL}/categories/${cat}`, { method: 'DELETE' });
    setCategories(categories.filter(c => c !== cat));
  };

  // Fetch and update site settings from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(setSiteSettings);
  }, []);
  const handleSaveSettings = async () => {
    await fetch(`${API_BASE_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteSettings),
    });
    setEditingSettings(false);
  };

  // UI toggles
  const toggleSection = (section) => {
    setShowUsers(section === 'users' ? !showUsers : false);
    setShowPosts(section === 'posts' ? !showPosts : false);
    setShowComments(section === 'comments' ? !showComments : false);
    setShowCategories(section === 'categories' ? !showCategories : false);
    setShowSettings(section === 'settings' ? !showSettings : false);
  };

  return (
    <section style={{ padding: '2rem', maxWidth: 900, width: '100%' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Administrator Dashboard</h2>
      <p>Welcome, Admin! Here you can manage all aspects of the webapp, including users, posts, comments, categories, and site settings.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 220 }}>
          <h3>Users Management</h3>
          <p>View, add, edit, or remove users. Assign roles and permissions.</p>
          <button onClick={() => toggleSection('users')}>Manage Users</button>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 220 }}>
          <h3>Posts Management</h3>
          <p>Review, edit, or delete any blog post. Moderate content.</p>
          <button onClick={() => toggleSection('posts')}>Manage Posts</button>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 220 }}>
          <h3>Comments Moderation</h3>
          <p>Approve, delete, or respond to comments across the site.</p>
          <button onClick={() => toggleSection('comments')}>Manage Comments</button>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 220 }}>
          <h3>Categories & Tags</h3>
          <p>Add, edit, or remove categories and tags for posts.</p>
          <button onClick={() => toggleSection('categories')}>Manage Categories</button>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 220 }}>
          <h3>Site Settings</h3>
          <p>Update site title, description, and other global settings.</p>
          <button onClick={() => toggleSection('settings')}>Site Settings</button>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 220, flex: 1 }}>
          <h3>Post a New Blog</h3>
          <form onSubmit={handleAddPost} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              placeholder="Post Title"
              required
            />
            <textarea
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              placeholder="Post Content"
              rows={4}
              required
            />
            <button type="submit">Publish Post</button>
          </form>
        </div>
      </div>
      {/* Users Management Section */}
      {showUsers && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3>Users</h3>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {editingUserId === user.id ? (
                  <>
                    <input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} placeholder="Name" />
                    <input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} placeholder="Email" />
                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                      <option value="admin">admin</option>
                      <option value="blogger">blogger</option>
                    </select>
                    <button onClick={handleSaveUser}>Save</button>
                  </>
                ) : (
                  <>
                    {user.name} ({user.email}) [{user.role}]
                    <button onClick={() => handleEditUser(user)} style={{ marginLeft: 8 }}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: 4 }}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 8 }}>
            <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Name" />
            <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" />
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="admin">admin</option>
              <option value="blogger">blogger</option>
            </select>
            <button onClick={handleAddUser}>Add User</button>
          </div>
        </div>
      )}
      {/* Posts Management Section */}
      {showPosts && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3>All Blog Posts</h3>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <strong>{post.title}</strong> <span style={{ color: '#888' }}>({post.date})</span>
                <p>{post.content}</p>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Comments Moderation Section */}
      {showComments && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3>Comments Moderation</h3>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>
                <strong>{comment.author}:</strong> {comment.text}
                {comment.approved ? (
                  <span style={{ color: 'green', marginLeft: 8 }}>[Approved]</span>
                ) : (
                  <button onClick={() => handleApproveComment(comment.id)} style={{ marginLeft: 8 }}>Approve</button>
                )}
                <button onClick={() => handleDeleteComment(comment.id)} style={{ marginLeft: 8 }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Categories Management Section */}
      {showCategories && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3>Categories</h3>
          <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <li key={cat} style={{ background: '#f3f3f3', padding: '0.5rem 1rem', borderRadius: 6 }}>
                {cat} <button onClick={() => handleDeleteCategory(cat)} style={{ marginLeft: 4 }}>x</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Add new category"
            style={{ marginRight: 8 }}
          />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
      )}
      {/* Site Settings Section */}
      {showSettings && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3>Site Settings</h3>
          {editingSettings ? (
            <>
              <input value={siteSettings.title} onChange={e => setSiteSettings({ ...siteSettings, title: e.target.value })} placeholder="Site Title" />
              <input value={siteSettings.description} onChange={e => setSiteSettings({ ...siteSettings, description: e.target.value })} placeholder="Description" />
              <button onClick={handleSaveSettings}>Save</button>
            </>
          ) : (
            <>
              <p>Title: {siteSettings.title}</p>
              <p>Description: {siteSettings.description}</p>
              <button onClick={() => setEditingSettings(true)}>Edit</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
