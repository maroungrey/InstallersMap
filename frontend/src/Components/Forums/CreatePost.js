import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const CreatePost = ({ show, onHide, onPostCreated, categories }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('/api/forums/posts', {
        title,
        content,
        category
      });

      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={5}
              maxLength={200}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={20}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePost;