import React, { useState } from 'react';

function Notifications() {
  // 임시 알림 데이터
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      assetName: '삼성전자',
      targetPrice: '75,000',
      currentPrice: '76,000',
      condition: 'above',
      createdAt: '2024-02-20 14:30',
      isRead: false
    },
    {
      id: 2,
      assetName: 'Bitcoin',
      targetPrice: '65,000,000',
      currentPrice: '64,800,000',
      condition: 'below',
      createdAt: '2024-02-20 14:25',
      isRead: true
    }
  ]);

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <div className="container py-4 text-light">
      {/* 알림 목록 */}
      <div className="card bg-dark border-secondary">
        <div className="card-body">
          <h3 className="card-title mb-3 text-white fw-bold">알림 목록</h3>
          {notifications.length > 0 ? (
            <div className="list-group list-group-flush">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`list-group-item bg-dark border-secondary d-flex justify-content-between align-items-center ${
                    !notification.isRead ? 'text-light' : 'text-secondary'
                  }`}
                >
                  <div>
                    <h5 className="mb-1">{notification.assetName}</h5>
                    <p className="mb-1">
                      목표가 {notification.targetPrice}원 {notification.condition === 'above' ? '이상' : '이하'}
                    </p>
                    <small>설정일: {notification.createdAt}</small>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-secondary py-4">
              설정된 알림이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications; 