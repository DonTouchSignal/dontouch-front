import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import chatApi from '../api/chatApi';
import { chatStyles } from '../styles/ChatStyles';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [connected, setConnected] = useState(false);
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
      
      // 화면에 즉시 표시
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
};

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
              <h3 className="card-title mb-3 text-light">
                실시간 채팅
                {connected && <span className="ms-2 badge bg-success">Live</span>}
              </h3>
              <div 
                className="chat-container" 
                style={chatStyles.chatContainer}
                ref={chatContainerRef}
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} style={chatStyles.messageContainer}>
                      <span style={chatStyles.username}>
                        {msg.userId ? `User ${msg.userId}` : 'Guest'}
                      </span>
                      <span style={chatStyles.messageContent}>
                        {msg.message}
                      </span>
                      <span style={chatStyles.timestamp}>
                        {new Date(msg.sendAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-light">
                    채팅 내역이 없습니다.
                  </div>
                )}
              </div>
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control bg-dark text-light"
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
        </div>
      </div>
    </div>
  );
}

export default Home;