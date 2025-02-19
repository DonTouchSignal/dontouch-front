import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import chatApi from '../api/chatApi';
import newsApi from '../api/newsApi';
import { chatStyles } from '../styles/ChatStyles';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [stockNews, setStockNews] = useState([]);
  const [cryptoNews, setCryptoNews] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');
  const [showMoreNews, setShowMoreNews] = useState(false);
  const chatContainerRef = useRef(null);

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

  const popularPosts = [
    { title: '오늘의 주식 시장 분석', comments: 42, likes: 156 },
    { title: '코인 투자 전략 공유', comments: 38, likes: 128 },
    { title: '새로운 규제안에 대한 의견', comments: 27, likes: 95 }
  ];

  const adContents = [
    {
      imageUrl: "/ads/ad1.jpg",
      title: "투자 전략 강의",
      description: "전문가와 함께하는 투자 분석",
      link: "#"
    },
    {
      imageUrl: "/ads/ad2.jpg",
      title: "프리미엄 구독",
      description: "실시간 매매 신호",
      link: "#"
    }
  ];

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await chatApi.getAllMessages();
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    loadMessages();

    const cleanup = chatApi.connectWebSocket(
      () => setConnected(true),
      () => setConnected(false)
    );

    const unsubscribe = chatApi.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      cleanup();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    try {
      const newMessage = {
        message: currentMessage,
        guest: true,
        userId: null,
        sendAt: new Date().toISOString()
      };
      
      await chatApi.sendMessage(currentMessage);
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const stockNewsData = await newsApi.getStockNews(searchTerm);
      setStockNews(stockNewsData.items);

      const cryptoNewsData = await newsApi.getCryptoNews(searchTerm);
      setCryptoNews(cryptoNewsData.items);
    } catch (error) {
      console.error('Failed to search news:', error);
    }
  };

  const handleNewsClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container-fluid bg-dark py-4">
      <div className="row">
        {/* 왼쪽 광고 사이드바 */}
        <div className="col-lg-2">
          <div className="sticky-top" style={{ top: '1rem' }}>
            {adContents.map((ad, index) => (
              <div key={index} className="mb-3">
                <div className="card bg-dark border-secondary" style={{ width: '160px' }}>
                  <img 
                    src={ad.imageUrl} 
                    alt={ad.title} 
                    className="card-img-top"
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                  <div className="card-body p-2">
                    <h6 className="card-title text-light mb-1">{ad.title}</h6>
                    <p className="card-text text-secondary small mb-2">{ad.description}</p>
                    <a href={ad.link} className="btn btn-outline-primary btn-sm w-100">자세히 보기</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* 메인 컨텐츠 영역 */}
        <div className="col-lg-7">

          {/* 급상승/급하락 종목 */}
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h3 className="card-title mb-0 text-light">급상승/급하락 종목</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 border-end border-secondary">
                  <h5 className="text-light mb-3">주식</h5>
                  <div className="list-group list-group-flush">
                    {trendingStocks.map((stock, index) => (
                      <div key={index} className="list-group-item bg-dark text-light border-secondary">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">{stock.name}</span>
                          <span className={`badge ${stock.change.startsWith('+') ? 'bg-success' : 'bg-danger'}`}>
                            {stock.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <h5 className="text-light mb-3">코인</h5>
                  <div className="list-group list-group-flush">
                    {trendingCoins.map((coin, index) => (
                      <div key={index} className="list-group-item bg-dark text-light border-secondary">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">{coin.name}</span>
                          <span className={`badge ${coin.change.startsWith('+') ? 'bg-success' : 'bg-danger'}`}>
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

          {/* 인기글 섹션 */}
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0 text-light">인기글</h3>
              <button className="btn btn-outline-primary btn-sm">더보기</button>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {popularPosts.map((post, index) => (
                  <div key={index} 
                    className="list-group-item bg-dark text-light border-secondary d-flex align-items-center" 
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="badge bg-primary me-3">{index + 1}</span>
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{post.title}</div>
                      <small className="text-secondary">
                        <i className="bi bi-chat-dots me-1"></i> {post.comments}
                        <i className="bi bi-heart ms-3 me-1"></i> {post.likes}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 뉴스 섹션 */}
          <div className="card bg-dark border-secondary">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h3 className="card-title mb-3 text-light">실시간 뉴스</h3>
              <div className="d-flex gap-2 mb-3">
                <button 
                  className={`btn ${activeTab === 'stock' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('stock')}
                >
                  주식
                </button>
                <button 
                  className={`btn ${activeTab === 'crypto' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('crypto')}
                >
                  암호화폐
                </button>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder={`${activeTab === 'stock' ? '주식' : '암호화폐'} 뉴스 검색...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSearch}
                >
                  검색
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {(activeTab === 'stock' ? stockNews : cryptoNews).length > 0 ? (
                <>
                  <div className="row m-0">
                    <div className="col-md-6 p-0">
                      {(activeTab === 'stock' ? stockNews : cryptoNews)
                        .slice(0, 5)
                        .map((news, index) => (
                          <div 
                            key={index}
                            className="list-group-item bg-dark text-light border-secondary p-3"
                            onClick={() => handleNewsClick(news.link)}
                            style={{ cursor: 'pointer' }}
                          >
                            <h5 className="mb-1">{news.title}</h5>
                            <p className="text-secondary small mb-2">
                              {news.description?.substring(0, 100)}...
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-secondary">
                                {new Date(news.pubDate).toLocaleDateString()}
                              </small>
                              <i className="bi bi-arrow-right text-primary"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="col-md-6 p-0 border-start border-secondary">
                      {(activeTab === 'stock' ? stockNews : cryptoNews)
                        .slice(5, 10)
                        .map((news, index) => (
                          <div 
                            key={index}
                            className="list-group-item bg-dark text-light border-secondary p-3"
                            onClick={() => handleNewsClick(news.link)}
                            style={{ cursor: 'pointer' }}
                          >
                            <h5 className="mb-1">{news.title}</h5>
                            <p className="text-secondary small mb-2">
                              {news.description?.substring(0, 100)}...
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-secondary">
                                {new Date(news.pubDate).toLocaleDateString()}
                              </small>
                              <i className="bi bi-arrow-right text-primary"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {(activeTab === 'stock' ? stockNews : cryptoNews).length > 10 && (
                    <div className="text-center p-3 border-top border-secondary">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setShowMoreNews(true)}
                      >
                        더보기
                      </button>
                    </div>
                  )}

                  {/* 더보기 모달 */}
                  <div 
                    className={`modal fade ${showMoreNews ? 'show' : ''}`} 
                    style={{ display: showMoreNews ? 'block' : 'none' }}
                    tabIndex="-1"
                  >
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                      <div className="modal-content bg-dark">
                        <div className="modal-header border-secondary">
                          <h5 className="modal-title text-light">
                            {activeTab === 'stock' ? '주식' : '암호화폐'} 뉴스 전체보기
                          </h5>
                          <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={() => setShowMoreNews(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="list-group list-group-flush">
                            {(activeTab === 'stock' ? stockNews : cryptoNews)
                              .slice(10)
                              .map((news, index) => (
                                <div 
                                  key={index}
                                  className="list-group-item bg-dark text-light border-secondary p-3"
                                  onClick={() => handleNewsClick(news.link)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <h5 className="mb-1">{news.title}</h5>
                                  <p className="text-secondary small mb-2">
                                    {news.description?.substring(0, 150)}...
                                  </p>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-secondary">
                                      {new Date(news.pubDate).toLocaleDateString()}
                                    </small>
                                    <i className="bi bi-arrow-right text-primary"></i>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {showMoreNews && (
                    <div 
                      className="modal-backdrop fade show" 
                      onClick={() => setShowMoreNews(false)}
                    ></div>
                  )}
                </>
              ) : (
                <div className="text-center p-5">
                  <i className="bi bi-newspaper fs-1 text-secondary mb-3"></i>
                  <p className="text-secondary mb-0">
                    관심 있는 {activeTab === 'stock' ? '주식' : '암호화폐'} 뉴스를 검색해보세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="col-lg-3">
          {/* 채팅 */}
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0 text-light">실시간 채팅</h3>
              {connected && <span className="badge bg-success">Live</span>}
            </div>
            <div className="card-body">
              <div 
                className="chat-container rounded bg-darker p-3 mb-3" 
                style={chatStyles.chatContainer}
                ref={chatContainerRef}
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} style={chatStyles.messageContainer}>
                      <div className="d-flex justify-content-between mb-1">
                        <span style={chatStyles.username}>
                          {msg.userId ? `User ${msg.userId}` : 'Guest'}
                        </span>
                        <span style={chatStyles.timestamp}>
                          {new Date(msg.sendAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div style={chatStyles.messageContent}>
                        {msg.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-secondary">
                    <i className="bi bi-chat-dots fs-1 mb-2"></i>
                    <p className="mb-0">채팅 내역이 없습니다</p>
                  </div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder={connected ? "메시지를 입력하세요..." : "연결 중..."}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!connected}
                />
                <button 
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!connected}
                >
                  전송
                </button>
              </div>
            </div>
          </div>

          {/* TradingView 위젯 */}
          <div className="card bg-dark border-secondary">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h3 className="card-title mb-0 text-light">실시간 시장 동향</h3>
            </div>
            <div 
              className="card-body p-0" 
              style={{ height: '550px' }}
              dangerouslySetInnerHTML={{
                __html: `
                  <div class="tradingview-widget-container">
                    <div class="tradingview-widget-container__widget"></div>
                    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js" async>
                    {
                      "feedMode": "all_symbols",
                      "isTransparent": false,
                      "displayMode": "regular",
                      "width": "100%",
                      "height": 550,
                      "colorTheme": "dark",
                      "locale": "en"
                    }
                    </script>
                  </div>
                `
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;