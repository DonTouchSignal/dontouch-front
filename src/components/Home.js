import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  // 임시 데이터
  const trendingStocks = [
    { name: '삼성전자', change: '+2.5%', price: '75,000' },
    { name: 'SK하이닉스', change: '-1.8%', price: '135,000' },
    { name: '현대차', change: '+3.2%', price: '210,000' }
  ];

  const trendingCoins = [
    { name: 'Bitcoin', change: '+5.2%', price: '65,000,000' },
    { name: 'Ethereum', change: '-2.1%', price: '3,500,000' },
    { name: 'XRP', change: '+1.8%', price: '800' }
  ];

  const latestNews = [
    { title: '美 연준, 기준금리 동결 결정', time: '1시간 전' },
    { title: '삼성전자, 신규 파운드리 공장 건설 발표', time: '2시간 전' },
    { title: '비트코인, 신규 상장지수펀드 승인', time: '3시간 전' }
  ];

  const popularPosts = [
    { title: '오늘의 주식 시장 분석', comments: 42, likes: 156 },
    { title: '코인 투자 전략 공유', comments: 38, likes: 128 },
    { title: '새로운 규제안에 대한 의견', comments: 27, likes: 95 }
  ];

  return (
    <div className="container py-4 text-light">
      {/* 검색바 */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="주식/코인 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="button">
              검색
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* 왼쪽 컨텐츠 영역 */}
        <div className="col-md-8">
          {/* 급상승/급하락 종목 */}
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3 text-light">급상승/급하락 종목</h3>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-light mb-2">주식</h5>
                  <div className="list-group list-group-flush">
                    {trendingStocks.map((stock, index) => (
                      <div key={index} className="list-group-item bg-dark text-light border-secondary">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{stock.name}</span>
                          <span className={stock.change.startsWith('+') ? 'text-success' : 'text-danger'}>
                            {stock.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <h5 className="text-light mb-2">코인</h5>
                  <div className="list-group list-group-flush">
                    {trendingCoins.map((coin, index) => (
                      <div key={index} className="list-group-item bg-dark text-light border-secondary">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{coin.name}</span>
                          <span className={coin.change.startsWith('+') ? 'text-success' : 'text-danger'}>
                            {coin.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 뉴스 */}
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3 text-light">최신 뉴스</h3>
              <div className="list-group list-group-flush">
                {latestNews.map((news, index) => (
                  <div key={index} className="list-group-item bg-dark text-light border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{news.title}</span>
                      <small className="text-secondary">{news.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 인기글 */}
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h3 className="card-title mb-3 text-light">인기글</h3>
              <div className="list-group list-group-flush">
                {popularPosts.map((post, index) => (
                  <div key={index} className="list-group-item bg-dark text-light border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{post.title}</span>
                      <small className="text-secondary">
                        댓글 {post.comments} · 좋아요 {post.likes}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 채팅 영역 */}
        <div className="col-md-4">
          <div className="card bg-dark border-secondary" style={{ position: 'sticky', top: '1rem' }}>
            <div className="card-body">
              <h3 className="card-title mb-3 text-light">실시간 채팅</h3>
              <div className="chat-container bg-darker p-3 mb-3" style={{ height: '600px', overflowY: 'auto' }}>
                <div className="text-secondary text-center">
                  채팅 기능 준비 중입니다...
                </div>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="메시지를 입력하세요..."
                  disabled
                />
                <button className="btn btn-outline-primary" type="button" disabled>
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 