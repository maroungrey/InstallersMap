import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaThumbsUp } from 'react-icons/fa';

const PostsList = ({ posts, onPostUpdated }) => {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/forums/post/${postId}`);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map(post => (
        <Card 
          key={post._id}
          className="cursor-pointer"
          onClick={() => handlePostClick(post._id)}
          style={{ cursor: 'pointer' }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">{post.title}</h5>
                <p className="text-muted mb-2">
                  Posted by {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Badge bg="secondary" className="me-2">
                  {post.category}
                </Badge>
              </div>
              <div className="d-flex gap-3 text-muted">
                <div>
                  <FaComments className="me-1" />
                  {post.commentsCount}
                </div>
                <div>
                  <FaThumbsUp className="me-1" />
                  {post.likesCount}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}

      {posts.length === 0 && (
        <Card body className="text-center text-muted">
          No posts found
        </Card>
      )}
    </div>
  );
};

export default PostsList;