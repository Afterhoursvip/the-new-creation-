import React, { useState } from 'react';

function Dashboard() {
  // Sample data for demonstration
  const [posts, setPosts] = useState([
    { id: 1, title: 'Welcome to My Blog', status: 'Published', date: '2025-06-20' },
    { id: 2, title: 'Draft: My Next Post', status: 'Draft', date: '2025-06-21' },
  ]);
  const [comments, setComments] = useState([
    { id: 1, author: 'Alice', text: 'Great post!', approved: false },
    { id: 2, author: 'Bob', text: 'Thanks for sharing!', approved: true },
  ]);
  const [search, setSearch] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [categories, setCategories] = useState(['General', 'Tech', 'Life']);
  const [newCategory, setNewCategory] = useState('');
  const [profile, setProfile] = useState({ name: 'Jane Blogger', email: 'jane@blog.com', editing: false });
  const [profileEdit, setProfileEdit] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');

  // Handlers for posts
  const handleAddPost = () => {
    if (newPostTitle.trim()) {
      setPosts([
        ...posts,
        { id: Date.now(), title: newPostTitle, status: 'Draft', date: new Date().toISOString().slice(0, 10) },
      ]);
      setNewPostTitle('');
      setNotifications(n => [{ text: 'New post created (draft)', date: new Date().toLocaleString() }, ...n]);
    }
  };
  const handleEditPost = (id, title) => {
    setEditPostId(id);
    setEditPostTitle(title);
  };
  const handleSaveEditPost = () => {
    setPosts(posts.map(post => post.id === editPostId ? { ...post, title: editPostTitle } : post));
    setEditPostId(null);
    setEditPostTitle('');
    setNotifications(n => [{ text: 'Post updated', date: new Date().toLocaleString() }, ...n]);
  };
  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    setNotifications(n => [{ text: 'Post deleted', date: new Date().toLocaleString() }, ...n]);
  };
  const handlePublishPost = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, status: 'Published' } : post));
    setNotifications(n => [{ text: 'Post published', date: new Date().toLocaleString() }, ...n]);
  };

  // Handlers for comments
  const handleApproveComment = (id) => {
    setComments(comments.map(c => c.id === id ? { ...c, approved: true } : c));
    setNotifications(n => [{ text: 'Comment approved', date: new Date().toLocaleString() }, ...n]);
  };
  const handleDeleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
    setNotifications(n => [{ text: 'Comment deleted', date: new Date().toLocaleString() }, ...n]);
  };

  // Handlers for categories
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setNotifications(n => [{ text: 'Category added', date: new Date().toLocaleString() }, ...n]);
    }
  };
  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
    setNotifications(n => [{ text: 'Category deleted', date: new Date().toLocaleString() }, ...n]);
  };

  // Profile editing
  const handleEditProfile = () => {
    setProfileEdit({ name: profile.name, email: profile.email });
    setProfile({ ...profile, editing: true });
  };
  const handleSaveProfile = () => {
    setProfile({ name: profileEdit.name, email: profileEdit.email, editing: false });
    setNotifications(n => [{ text: 'Profile updated', date: new Date().toLocaleString() }, ...n]);
  };

  // Filtered posts for search
  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <section style={{ padding: '2rem', maxWidth: 900, width: '100%' }}>
      {/* Profile Section */}
      <div style={{ background: '#e6f7ff', padding: '1rem', borderRadius: 8, marginBottom: '2rem' }}>
        <h3>Blogger Profile</h3>
        {profile.editing ? (
          <div>
            <input value={profileEdit.name} onChange={e => setProfileEdit({ ...profileEdit, name: e.target.value })} placeholder="Name" style={{ marginRight: 8 }} />
            <input value={profileEdit.email} onChange={e => setProfileEdit({ ...profileEdit, email: e.target.value })} placeholder="Email" style={{ marginRight: 8 }} />
            <button onClick={handleSaveProfile}>Save</button>
          </div>
        ) : (
          <>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <button style={{ marginTop: 8 }} onClick={handleEditProfile}>Edit Profile</button>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={newPostTitle}
          onChange={e => setNewPostTitle(e.target.value)}
          placeholder="New post title"
          style={{ marginRight: 8 }}
        />
        <button onClick={handleAddPost} style={{ marginRight: 8 }}>New Post</button>
        <button onClick={() => setNotifications(n => [{ text: 'Visited site (demo)', date: new Date().toLocaleString() }, ...n])}>View Site</button>
      </div>

      {/* Search/Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="search"
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: 220 }}
        />
      </div>

      {/* Post Management */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Posts</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f3f3' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post.id}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  {editPostId === post.id ? (
                    <>
                      <input value={editPostTitle} onChange={e => setEditPostTitle(e.target.value)} style={{ marginRight: 8 }} />
                      <button onClick={handleSaveEditPost}>Save</button>
                    </>
                  ) : (
                    post.title
                  )}
                </td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{post.status}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{post.date}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  {post.status === 'Draft' && (
                    <button onClick={() => handlePublishPost(post.id)} style={{ marginRight: 4 }}>Publish</button>
                  )}
                  <button onClick={() => handleEditPost(post.id, post.title)} style={{ marginRight: 4 }}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drafts */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Drafts</h3>
        <ul>
          {posts.filter(post => post.status === 'Draft').map(draft => (
            <li key={draft.id}>{draft.title} ({draft.date})</li>
          ))}
        </ul>
      </div>

      {/* Comments Moderation */}
      <div style={{ marginBottom: '2rem' }}>
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

      {/* Categories/Tags Management */}
      <div style={{ marginBottom: '2rem' }}>
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

      {/* Statistics/Analytics */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 120 }}>
          <h4>Posts</h4>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{posts.length}</p>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 120 }}>
          <h4>Comments</h4>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{comments.length}</p>
        </div>
        <div style={{ background: '#f3f3f3', padding: '1rem', borderRadius: 8, minWidth: 120 }}>
          <h4>Categories</h4>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{categories.length}</p>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: '#fff1f0', padding: '1rem', borderRadius: 8, marginBottom: '2rem', maxHeight: 120, overflowY: 'auto' }}>
        <h3>Notifications</h3>
        <ul>
          {notifications.length === 0 ? <li>No new notifications</li> : notifications.map((n, i) => (
            <li key={i}>{n.text} <span style={{ color: '#888', fontSize: '0.9em' }}>({n.date})</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Dashboard;
