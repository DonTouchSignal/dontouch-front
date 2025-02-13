import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

function Navbar() {
  // 임시로 로그인 상태를 true로 설정
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState('홍길동');
  const [unreadNotifications, setUnreadNotifications] = useState(2); // 임시 알림 카운트

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        {/* 로고와 메인 네비게이션 */}
        <div className="d-flex align-items-center">
          <Link className="navbar-brand me-4" to="/">돈 터치</Link>
          <ul className="navbar-nav me-auto mb-0">
            <li className="nav-item">
              <Link className="nav-link" to="/assets?category=domestic">국내주식</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assets?category=overseas">해외주식</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assets?category=crypto">암호화폐</Link>
            </li>
          </ul>
        </div>

        {/* 모바일 토글 버튼 */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarAuth"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 인증 관련 네비게이션 */}
        <div className="collapse navbar-collapse" id="navbarAuth">
          <ul className="navbar-nav ms-auto align-items-center">
            {isLoggedIn && (
              <li className="nav-item me-3">
                <Link to="/notifications" className="nav-link position-relative">
                  <FaBell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    <span className="text-light">{username}</span>님 환영합니다
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleLogin}>로그인</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light ms-2" to="/register">
                    회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 