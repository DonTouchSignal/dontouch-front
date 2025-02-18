import React, { useState, useEffect } from 'react';
import userApi from '../api/userApi';

function User() {
  const [userInfo, setUserInfo] = useState({
    email: 'user@example.com',
    nickname: '홍길동',
    isSubscribed: false,
    subscriptionEndDate: null,
  });
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);


  useEffect(() => {
    const loadFavoriteStocks = async () => {
      try {
        const favoriteStocksData = await userApi.getFavoriteStocks(userInfo.email);
        setFavoriteStocks(favoriteStocksData);
      } catch (error) {
        console.error('Error loading favoriteStocks:', error);
      }
    };
    loadFavoriteStocks();

    const loadMyPosts = async () => {
      try {
        const myPostsData = await userApi.getMyPosts(userInfo.email);
        setMyPosts(myPostsData);
      } catch (error) {
        console.error('Error loading myPosts:', error);
      }
    };
    loadMyPosts();

    const loadMyComments = async () => {
      try {
        const myCommentsData = await userApi.getMyComments(userInfo.email);
        setMyComments(myCommentsData);
      } catch (error) {
        console.error('Error loading myComments:', error);
      }
    };
    loadMyComments();
  }, []);

  const handleSubscribe = () => {
    setUserInfo(prev => ({
      ...prev,
      isSubscribed: true,
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    alert('구독이 완료되었습니다!'); 
  };

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

          {!userInfo.isSubscribed && (
            <div className="card bg-dark text-light">
              <div className="card-header bg-dark border-secondary">
                <h4 className="mb-0">프리미엄 구독</h4>
              </div>
              <div className="card-body">
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
              </div>
            </div>
          )}
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

          {/* 내가 쓴 글 */}
          <div className="card bg-dark text-light">
          <div className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center">
              <h4 className="mb-0">내 활동</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {/* 내가 쓴 글 */}
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">내가 쓴 글</h5>
                    <button className="btn btn-sm btn-outline-primary">더보기</button>
                  </div>
                  <div className="list-group list-group-flush">
                    {myPosts.map(post => (
                      <div key={post.id} className="list-group-item bg-dark border-secondary">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-1 text-light">{post.title}</h6>
                          <small className="text-secondary">{post.date}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 내가 쓴 댓글 */}
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">내가 쓴 댓글</h5>
                    <button className="btn btn-sm btn-outline-primary">더보기</button>
                  </div>
                  <div className="list-group list-group-flush">
                    {myComments.map(comment => (
                      <div key={comment.id} className="list-group-item bg-dark border-secondary">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-secondary">{comment.postTitle}</small>
                          <small className="text-secondary">{comment.date}</small>
                        </div>
                        <p className="mb-0 text-light">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;