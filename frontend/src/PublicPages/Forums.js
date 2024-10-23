import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../Components/Forums/CategoryCard';
import PostsList from '../Components/Forums/PostsList';
import CreatePost from '../Components/Forums/CreatePost';
import { 
  FaComments, 
  FaQuestionCircle, 
  FaBullhorn, 
  FaBolt, 
  FaTools, 
  FaLightbulb 
} from 'react-icons/fa';
import axios from 'axios';

const Forums = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { 
      id: 'general',
      name: 'General Discussion', 
      icon: <FaComments className="text-primary" size={24} />,
      description: 'General discussions about solar energy and storage'
    },
    { 
      id: 'help',
      name: 'Questions & Help', 
      icon: <FaQuestionCircle className="text-success" size={24} />,
      description: 'Ask questions and get help from the community'
    },
    { 
      id: 'news',
      name: 'News & Announcements', 
      icon: <FaBullhorn className="text-info" size={24} />,
      description: 'Latest updates and announcements'
    },
    { 
      id: 'batteries',
      name: 'Battery Discussion', 
      icon: <FaBolt className="text-warning" size={24} />,
      description: 'Discuss different battery technologies and comparisons'
    },
    { 
      id: 'installation',
      name: 'Installation Tips', 
      icon: <FaTools className="text-secondary" size={24} />,
      description: 'Share and discuss installation tips and tricks'
    },
    { 
      id: 'showcase',
      name: 'Project Showcase', 
      icon: <FaLightbulb className="text-danger" size={24} />,
      description: 'Share your completed projects and installations'
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/forums/posts${selectedCategory ? `?category=${selectedCategory}` : ''}`);
      setPosts(response.data.posts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      navigate('/login', { state: { from: '/forums' } });
      return;
    }
    setShowCreatePost(true);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowCreatePost(false);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Forums</h1>
            <Button 
              variant="primary" 
              onClick={handleCreatePost}
            >
              Create New Post
            </Button>
          </div>

          {/* Categories Grid */}
          <Row className="g-4 mb-5">
            {categories.map(category => (
              <Col md={6} lg={4} key={category.id}>
                <CategoryCard 
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                />
              </Col>
            ))}
          </Row>

          {/* Posts List */}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <PostsList 
              posts={posts} 
              onPostUpdated={fetchPosts}
            />
          )}
        </Col>
      </Row>

      <CreatePost 
        show={showCreatePost}
        onHide={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
        categories={categories}
      />
    </Container>
  );
};

export default Forums;