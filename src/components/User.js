import React, { useState, useEffect } from 'react';
import boardApi from '../api/boardApi';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

function User() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: '',
    nickname: '',
    isSubscribed: false,
    subscriptionEndDate: null,
  });

  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(0);
  const [likedPostsPage, setLikedPostsPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myPostsTotalPages, setMyPostsTotalPages] = useState(0);
  const [likedPostsTotalPages, setLikedPostsTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState('myPosts'); // 'myPosts' 또는 'likedPosts'

  // 임시 데이터
  const [favoriteStocks] = useState([
    { name: '삼성전자', code: '005930', price: '71,000', change: '+1.2%' },
    { name: 'SK하이닉스', code: '000660', price: '135,000', change: '-0.8%' },
    { name: '네이버', code: '035420', price: '215,000', change: '+2.1%' },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem('X-Auth-User');
        const nickname = await boardApi.getNickname(email);
        
        // 구독 상태 확인 추가
        const isSubscribed = await authApi.checkSubscriptionStatus();
        
        setUserInfo(prev => ({
          ...prev,
          email: email || '',
          nickname: nickname || '',
          isSubscribed: isSubscribed
        }));

        // 내가 쓴 글 가져오기
        const postsData = await boardApi.getMyPosts(postsPage);
        setMyPosts(postsData.content);
        setMyPostsTotalPages(postsData.totalPages);

        // 좋아요한 글 가져오기
        const likedPostsData = await boardApi.getMyLikedPosts(likedPostsPage);
        setLikedPosts(likedPostsData.content);
        setLikedPostsTotalPages(likedPostsData.totalPages);

        setError(null);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubscribe = async () => {
    try {
      const response = await authApi.processSubscription();
      if (response === "구독 처리가 완료되었습니다.") {
        setUserInfo(prev => ({
          ...prev,
          isSubscribed: true,
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
        alert('구독이 완료되었습니다!');
      }
    } catch (error) {
      console.error('Subscribe Error:', error);
      alert('구독 처리 중 오류가 발생했습니다.');
    }
  };

  // 구독 취소 핸들러 추가
  const handleUnsubscribe = async () => {
    try {
      const response = await authApi.cancelSubscription();
      if (response === "구독 취소가 완료되었습니다.") {
        setUserInfo(prev => ({
          ...prev,
          isSubscribed: false,
          subscriptionEndDate: null
        }));
        alert('구독이 취소되었습니다.');
      }
    } catch (error) {
      console.error('Unsubscribe Error:', error);
      alert('구독 취소 중 오류가 발생했습니다.');
    }
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (assetId, postId) => {
    navigate(`/assets/${assetId}/posts/${postId}`);
  };

  // 게시글 목록 렌더링
  const renderPosts = (posts, title, currentPage, totalPages, setPage) => (
    <div className="list-group list-group-flush">
      <h5 className="mb-3">{title}</h5>
      {posts.map(post => (
        <div 
          key={post.id} 
          className="list-group-item bg-dark border-secondary cursor-pointer"
          onClick={() => handlePostClick(post.assetId, post.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-1 text-light">{post.title}</h6>
            <small className="text-secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-secondary">
              조회 {post.viewCount} · 좋아요 {post.likeCount}
            </small>
          </div>
        </div>
      ))}
      
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
              <button
                className="page-link bg-dark text-light"
                onClick={() => setPage(prev => prev - 1)}
                disabled={currentPage === 0}
              >
                이전
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                <button
                  className="page-link bg-dark text-light"
                  onClick={() => setPage(index)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
              <button
                className="page-link bg-dark text-light"
                onClick={() => setPage(prev => prev + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                다음
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* 왼쪽 사이드바 - 사용자 정보 및 구독 */}
        <div className="col-md-4">
          <div className="card bg-dark text-light mb-4">
            <div className="card-header bg-dark border-secondary">
              <h4 className="mb-0">내 정보</h4>
            </div>
            <div className="card-body">
              <h5 className="mb-3">{userInfo.nickname}</h5>
              <p className="text-secondary mb-2">
                <i className="bi bi-envelope me-2"></i>
                {userInfo.email}
              </p>
              <div className="mb-3">
                <span className={`badge ${userInfo.isSubscribed ? 'bg-success' : 'bg-secondary'}`}>
                  {userInfo.isSubscribed ? '구독중' : '미구독'}
                </span>
              </div>
              {userInfo.isSubscribed && userInfo.subscriptionEndDate && (
                <p className="text-secondary">
                  구독 만료일: {new Date(userInfo.subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* 구독 버튼 섹션 수정 */}
          <div className="card bg-dark text-light">
            <div className="card-header bg-dark border-secondary">
              <h4 className="mb-0">구독 상태</h4>
            </div>
            <div className="card-body">
              {userInfo.isSubscribed ? (
                <>
                  <p className="text-success mb-3">현재 구독 중입니다</p>
                  <button 
                    className="btn btn-danger w-100"
                    onClick={handleUnsubscribe}
                  >
                    구독 취소하기
                  </button>
                </>
              ) : (
                <>
                  <p className="card-text text-secondary">
                    - 모든 광고 제거<br />
                    - 종목 분석 데이터 제공<br />
                    - 알림 설정 무제한
                  </p>
                  <h4 className="mb-3 text-primary">월 9,900원</h4>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={handleSubscribe}
                  >
                    구독하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 메인 컨텐츠 */}
        <div className="col-md-8">
          {/* 관심 종목 */}
          <div className="card bg-dark text-light mb-4">
            <div className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center">
              <h4 className="mb-0">관심 종목</h4>
              <button className="btn btn-sm btn-outline-primary">더보기</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr>
                      <th>종목명</th>
                      <th>현재가</th>
                      <th>등락률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favoriteStocks.map((stock, index) => (
                      <tr key={index}>
                        <td>{stock.name}</td>
                        <td>{stock.price}</td>
                        <td className={stock.change.startsWith('+') ? 'text-success' : 'text-danger'}>
                          {stock.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 게시글 목록 카드 수정 */}
          <div className="card bg-dark text-light">
            <div className="card-header bg-dark border-secondary">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'myPosts' ? 'active text-light' : 'text-secondary'}`}
                    onClick={() => setActiveTab('myPosts')}
                    style={{ backgroundColor: activeTab === 'myPosts' ? '#343a40' : 'transparent', border: 'none' }}
                  >
                    내가 쓴 글
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'likedPosts' ? 'active text-light' : 'text-secondary'}`}
                    onClick={() => setActiveTab('likedPosts')}
                    style={{ backgroundColor: activeTab === 'likedPosts' ? '#343a40' : 'transparent', border: 'none' }}
                  >
                    좋아요한 글
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'myPosts' ? (
                renderPosts(myPosts, '내가 쓴 글', postsPage, myPostsTotalPages, setPostsPage)
              ) : (
                renderPosts(likedPosts, '좋아요한 글', likedPostsPage, likedPostsTotalPages, setLikedPostsPage)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;