// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [userId] = useState(1); // Hardcoded for testing
  const [form, setForm] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`http://localhost:9090/journal/${userId}`);
      setEntries(res.data);
    } catch (err) {
      toast.error('Failed to fetch entries');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:9090/journal/${editId}`, form);
        toast.success('Journal updated');
      } else {
        await axios.post('http://localhost:9090/journal', { ...form, user_id: userId });
        toast.success('Journal added');
      }
      setForm({ title: '', content: '' });
      setEditId(null);
      fetchEntries();
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setForm({ title: entry.title, content: entry.content });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/journal/${id}`);
      toast.success('Deleted successfully');
      fetchEntries();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4 text-primary fw-bold">📝 Daily Journal</h2>

      <form onSubmit={handleSubmit} className="mb-4 bg-light p-4 rounded shadow">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Write your thoughts..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          {editId ? 'Update Entry' : 'Add Entry'}
        </button>
      </form>

      <h5 className="text-muted">Your Entries</h5>
      {entries.map((entry) => (
        <div key={entry.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{entry.title}</h5>
            <h6 className="card-subtitle text-muted mb-2">
              {new Date(entry.created_at).toLocaleString()}
            </h6>
            <p className="card-text">{entry.content}</p>
            <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(entry)}>
              Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(entry.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
