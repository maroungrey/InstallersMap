import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../AuthContext';
import CommentSection from '../Components/Forums/CommentSection';
import { showConfirmationDialog, showReportDialog } from '../Components/Forums/ConfirmationModal';
import Swal from 'sweetalert2';
import { 
 FaThumbsUp, 
 FaRegThumbsUp, 
 FaClock, 
 FaUser,
 FaExclamationTriangle,
 FaEdit,
 FaTrash
} from 'react-icons/fa';
import axios from 'axios';

const PostView = () => {
 axios.defaults.withCredentials = true;
 const [post, setPost] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [comments, setComments] = useState([]);
 const [isEditing, setIsEditing] = useState(false);
 const [editedContent, setEditedContent] = useState('');
 const { postId } = useParams();
 const { user } = useAuth();
 const navigate = useNavigate();

 const modules = {
   toolbar: [
     [{ 'header': [1, 2, false] }],
     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
     [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
     ['link'],
     ['clean']
   ],
 };

 const formats = [
   'header',
   'bold', 'italic', 'underline', 'strike', 'blockquote',
   'list', 'bullet', 'indent',
   'link'
 ];

 useEffect(() => {
   fetchPost();
 }, [postId]);

 const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/forums/posts/${postId}`);
      setPost(response.data.post);
      setComments(response.data.comments);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

 const handleLike = async () => {
    if (!user) {
        navigate('/login', { state: { from: `/forums/post/${postId}` } });
        return;
      }
    
      try {
        const response = await axios.post(`http://localhost:8081/api/forums/posts/${postId}/like`);
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to like post');
      }
 };

 const handleDelete = async () => {
   if (!user || post.author._id !== user) {
     return;
   }

   const confirmed = await showConfirmationDialog({
     title: 'Delete Post',
     text: 'Are you sure you want to delete this post? This action cannot be undone.',
     confirmButtonText: 'Yes, delete it'
   });

   if (confirmed) {
    try {
        await axios.delete(`http://localhost:8081/api/forums/posts/${postId}`);
        navigate('/forums');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete post');
      }
   }
 };

 const handleReport = async () => {
   if (!user) {
     navigate('/login', { state: { from: `/forums/post/${postId}` } });
     return;
   }

   const reason = await showReportDialog();
   if (reason) {
    try {
        await axios.post(`http://localhost:8081/api/forums/posts/${postId}/report`, { reason });
        Swal.fire('Success', 'Post reported successfully', 'success');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to report post');
      }
   }
 };

 const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8081/api/forums/posts/${postId}`, {
        content: editedContent
      });
      setPost(response.data);
      setIsEditing(false);
      Swal.fire('Success', 'Post updated successfully', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
 };

 const isEditable = () => {
   if (!user || post.author._id !== user) return false;
   const postDate = new Date(post.createdAt);
   const now = new Date();
   const diffHours = (now - postDate) / (1000 * 60 * 60);
   return diffHours < 24;
 };

 if (loading) {
   return (
     <Container className="py-5 text-center">
       <Spinner animation="border" role="status">
         <span className="visually-hidden">Loading...</span>
       </Spinner>
     </Container>
   );
 }

 if (error) {
   return (
     <Container className="py-5">
       <Alert variant="danger">{error}</Alert>
     </Container>
   );
 }

 if (!post) {
   return (
     <Container className="py-5">
       <Alert variant="warning">Post not found</Alert>
     </Container>
   );
 }

 return (
   <Container className="py-5">
     <Card className="mb-4">
       <Card.Body>
         <div className="d-flex justify-content-between align-items-start mb-3">
           <div>
             <h2>{post.title}</h2>
             <div className="text-muted mb-2">
               <small>
                 <FaUser className="me-1" />
                 {post.author.username} · 
                 <FaClock className="ms-2 me-1" />
                 {new Date(post.createdAt).toLocaleString()}
                 {post.updatedAt !== post.createdAt && (
                   <span className="ms-2">
                     · edited {new Date(post.updatedAt).toLocaleString()}
                   </span>
                 )}
               </small>
             </div>
             <div>
               <span className="badge bg-secondary">{post.category}</span>
             </div>
           </div>
           <div className="d-flex gap-2">
             {user && post.author._id === user && (
               <>
                 {isEditable() && (
                   <Button 
                     variant="outline-primary" 
                     size="sm"
                     onClick={() => {
                       setEditedContent(post.content);
                       setIsEditing(true);
                     }}
                   >
                     <FaEdit /> Edit
                   </Button>
                 )}
                 <Button 
                   variant="outline-danger" 
                   size="sm"
                   onClick={handleDelete}
                 >
                   <FaTrash /> Delete
                 </Button>
               </>
             )}
             {user && post.author._id !== user && (
               <Button 
                 variant="outline-warning" 
                 size="sm"
                 onClick={handleReport}
               >
                 <FaExclamationTriangle /> Report
               </Button>
             )}
           </div>
         </div>

         <div className="post-content mb-3">
           {isEditing ? (
             <Form onSubmit={handleSave}>
               <Form.Group className="mb-3">
                 <ReactQuill 
                   value={editedContent}
                   onChange={setEditedContent}
                   modules={modules}
                   formats={formats}
                   style={{ height: '200px', marginBottom: '50px' }}
                 />
               </Form.Group>
               <div className="d-flex gap-2">
                 <Button type="submit" variant="primary">Save Changes</Button>
                 <Button variant="secondary" onClick={() => setIsEditing(false)}>
                   Cancel
                 </Button>
               </div>
             </Form>
           ) : (
             <div dangerouslySetInnerHTML={{ __html: post.isDeleted ? '[deleted]' : post.content }} />
           )}
         </div>

         <div className="d-flex justify-content-between align-items-center">
           <Button
             variant="outline-primary"
             size="sm"
             onClick={handleLike}
             disabled={!user}
           >
             {post.likedBy?.includes(user) ? (
               <FaThumbsUp className="me-1" />
             ) : (
               <FaRegThumbsUp className="me-1" />
             )}
             {post.likesCount || 0}
           </Button>
         </div>
       </Card.Body>
     </Card>

     <CommentSection 
       postId={postId}
       comments={comments}
       setComments={setComments}
     />
   </Container>
 );
};

export default PostView;