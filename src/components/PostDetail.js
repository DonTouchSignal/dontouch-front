import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import boardApi from '../api/boardApi';

function PostDetail() {
  const { assetId, postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(0);
  const [totalCommentPages, setTotalCommentPages] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const currentUserId = localStorage.getItem('userId');

  // 게시글 데이터 가져오기
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [assetId, postId]);

  const fetchPost = async () => {
    try {
      const data = await boardApi.getPost(assetId, postId);
      setPost(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
      setError(null);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error('Error fetching post:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await boardApi.getComments(postId, commentPage);
      
      // 데이터가 비어있고 현재 페이지가 0이 아닌 경우
      if (data.content.length === 0 && commentPage > 0) {
        setCommentPage(prev => prev - 1); // 이전 페이지로 이동
        return; // 여기서 함수 종료
      }

      setComments(data.content);
      setTotalCommentPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError('댓글을 불러오는데 실패했습니다.');
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 수정
  const handleEditPost = async () => {
    try {
      const updatedPost = {
        title: editedTitle.trim(),
        content: editedContent.trim()
      };
      await boardApi.updatePost(assetId, postId, updatedPost);
      setIsEditing(false);
      fetchPost();
    } catch (err) {
      setError('게시글 수정에 실패했습니다.');
      console.error('Error updating post:', err);
    }
  };

  // 댓글 작성
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await boardApi.createComment(postId, { content: newComment.trim() });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Error creating comment:', err);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId) => {
    try {
      await boardApi.updateComment(postId, commentId, { 
        content: editingCommentContent.trim() 
      });
      setEditingCommentId(null);
      setEditingCommentContent('');
      fetchComments();
    } catch (err) {
      setError('댓글 수정에 실패했습니다.');
      console.error('Error updating comment:', err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    
    try {
      await boardApi.deleteComment(postId, commentId);
      
      // 현재 페이지의 댓글이 1개이고, 첫 페이지가 아닌 경우
      if (comments.length === 1 && commentPage > 0) {
        setCommentPage(prev => prev - 1); // 이전 페이지로 이동
      } else {
        fetchComments(); // 현재 페이지 새로고침
      }
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.');
      console.error('Error deleting comment:', err);
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await boardApi.deletePost(assetId, postId);
        navigate(`/assets/${assetId}/posts`);
      } catch (err) {
        setError('게시글 삭제에 실패했습니다.');
        console.error('Error deleting post:', err);
      }
    }
  };

  // 좋아요 토글
  const handleToggleLike = async () => {
    try {
      if (post.isLiked) {
        await boardApi.unlikePost(assetId, postId);
      } else {
        await boardApi.likePost(assetId, postId);
      }
      fetchPost(); // 게시글 정보 새로고침
    } catch (err) {
      setError('좋아요 처리에 실패했습니다.');
      console.error('Error toggling like:', err);
    }
  };

  // 페이지 변경 시 댓글 다시 불러오기
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, commentPage]);

  if (loading) return (
    <div className="container py-4 text-light">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container py-4">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="container py-4">
      <div className="card bg-dark text-light mb-4">
        <div className="card-body">
          {isEditing ? (
            // 게시글 수정 폼
            <form onSubmit={(e) => { e.preventDefault(); handleEditPost(); }}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-dark text-light"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control bg-dark text-light"
                  rows="5"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">저장</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            // 게시글 표시
            <>
              <h2 className="card-title">{post.title}</h2>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <span className="text-secondary me-3">작성자: User #{post.userId}</span>
                  <span className="text-secondary me-3">조회수: {post.viewCount}</span>
                  <span className="text-secondary">좋아요: {post.likeCount}</span>
                </div>
                <span className="text-secondary">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
              <hr className="border-secondary" />
              <p className="card-text">{post.content}</p>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className={`btn ${post.isLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleToggleLike()}
                >
                  좋아요 {post.likeCount}
                </button>
                <div>
                  {post.userId === parseInt(currentUserId) && (
                    <>
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setIsEditing(true)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-outline-danger me-2"
                        onClick={handleDeletePost}
                      >
                        삭제
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/assets/${assetId}/posts`)}
                  >
                    목록으로
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="card bg-dark text-light">
        <div className="card-body">
          <h5 className="mb-4">댓글</h5>
          
          {/* 댓글 작성 폼을 위로 이동 */}
          <form onSubmit={handleSubmitComment} className="mb-4">
            <div className="form-group">
              <textarea
                className="form-control bg-dark text-light"
                rows="3"
                placeholder="댓글을 작성하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end mt-2">
              <button type="submit" className="btn btn-primary">
                댓글 작성
              </button>
            </div>
          </form>

          {/* 구분선 추가 */}
          <hr className="border-secondary mb-4" />
          
          {/* 댓글 목록 */}
          {Array.isArray(comments) && comments.map(comment => (
            <div key={comment.id} className="mb-3 border-bottom border-secondary pb-3">
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    className="form-control bg-dark text-light mb-2"
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      저장
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingCommentContent('');
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>User #{comment.userId}</strong>
                    <small className="text-secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="me-3" style={{ flex: 1, textAlign: 'left' }}>
                      <p className="mb-0" style={{ wordBreak: 'break-all' }}>{comment.content}</p>
                    </div>
                    {comment.userId === parseInt(currentUserId) && (
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingCommentContent(comment.content);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* 페이지네이션 */}
          {totalCommentPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${commentPage === 0 ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-dark text-light"
                    onClick={() => setCommentPage(prev => prev - 1)}
                    disabled={commentPage === 0}
                  >
                    이전
                  </button>
                </li>
                {[...Array(totalCommentPages)].map((_, index) => (
                  <li 
                    key={index} 
                    className={`page-item ${commentPage === index ? 'active' : ''}`}
                  >
                    <button
                      className="page-link bg-dark text-light"
                      onClick={() => setCommentPage(index)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${commentPage >= totalCommentPages - 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-dark text-light"
                    onClick={() => setCommentPage(prev => prev + 1)}
                    disabled={commentPage >= totalCommentPages - 1}
                  >
                    다음
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail; 