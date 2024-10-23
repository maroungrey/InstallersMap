import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { showConfirmationDialog, showReportDialog } from './ConfirmationModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  FaUser, 
  FaClock, 
  FaTrash, 
  FaEdit, 
  FaExclamationTriangle 
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const CommentSection = ({ postId, comments, setComments }) => {
  axios.defaults.withCredentials = true;
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/forums/post/${postId}` } });
      return;
    }
  
    try {
      setSubmitting(true);
      setError('');
      const response = await axios.post(`http://localhost:8081/api/forums/posts/${postId}/comments`, {
        content: newComment
      });
      setComments(prev => [...prev, response.data]);
      setNewComment('');
      Swal.fire('Success', 'Comment posted successfully', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = await showConfirmationDialog({
      title: 'Delete Comment',
      text: 'Are you sure you want to delete this comment? This action cannot be undone.',
      confirmButtonText: 'Yes, delete it'
    });

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8081/api/forums/comments/${commentId}`);
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { ...comment, isDeleted: true, content: '[deleted]' }
              : comment
          )
        );
        Swal.fire('Success', 'Comment deleted successfully', 'success');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  const handleReport = async (commentId) => {
    if (!user) {
      navigate('/login', { state: { from: `/forums/post/${postId}` } });
      return;
    }

    const reason = await showReportDialog();
    if (reason) {
      try {
        await axios.post(`http://localhost:8081/api/forums/comments/${commentId}/report`, { reason });
        Swal.fire('Success', 'Comment reported successfully', 'success');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to report comment');
      }
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const response = await axios.put(`http://localhost:8081/api/forums/comments/${commentId}`, {
        content: editContent
      });
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId ? response.data : comment
        )
      );
      setEditingComment(null);
      setEditContent('');
      Swal.fire('Success', 'Comment updated successfully', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const isEditable = (comment) => {
    if (!user || comment.author._id !== user) return false;
    const commentDate = new Date(comment.createdAt);
    const now = new Date();
    const diffHours = (now - commentDate) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  return (
    <div>
      <h4 className="mb-3">Comments ({comments.length})</h4>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {/* Comment Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <ReactQuill
                value={newComment}
                onChange={setNewComment}
                modules={modules}
                formats={formats}
                placeholder={user ? "Write a comment..." : "Please login to comment"}
                style={{ height: '100px', marginBottom: '40px' }}
              />
            </Form.Group>
            <Button 
              type="submit" 
              disabled={!user || submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Comments List */}
      <div className="d-flex flex-column gap-3">
        {comments.map(comment => (
          <Card key={comment._id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div className="mb-2">
                  <div className="text-muted mb-2">
                    <small>
                      <FaUser className="me-1" />
                      {comment.author.username} · 
                      <FaClock className="ms-2 me-1" />
                      {new Date(comment.createdAt).toLocaleString()}
                      {comment.isEdited && !comment.isDeleted && (
                        <span className="ms-2">· edited</span>
                      )}
                    </small>
                  </div>
                  {editingComment === comment._id ? (
                    <Form onSubmit={(e) => {
                      e.preventDefault();
                      handleEdit(comment._id);
                    }}>
                      <Form.Group className="mb-3">
                        <ReactQuill
                          value={editContent}
                          onChange={setEditContent}
                          modules={modules}
                          formats={formats}
                          style={{ height: '100px', marginBottom: '40px' }}
                        />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button type="submit" size="sm">Save</Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                  )}
                </div>
                {!editingComment && !comment.isDeleted && (
                  <div className="d-flex gap-2">
                    {user && comment.author._id === user && isEditable(comment) && (
                      <>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setEditingComment(comment._id);
                            setEditContent(comment.content);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(comment._id)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    )}
                    {user && comment.author._id !== user && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleReport(comment._id)}
                      >
                        <FaExclamationTriangle />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}

        {comments.length === 0 && (
          <Card body className="text-center text-muted">
            No comments yet. Be the first to comment!
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommentSection;