import React, { useState, useEffect } from 'react';
import notificationApi from '../api/notificationsApi';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  // localStorage에서 email 가져오기 (없으면 기본값 사용)
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("Email이 localStorage에 없습니다. 기본값을 사용합니다.");
      setEmail("sohyun5429@gmail.com");  // 테스트용 기본 이메일 (실제 환경에서는 로그인 기능 필요)
    }
  }, []);

  // 알림 조회
  const getNotifications = async () => {
    try {
      console.log('알림을 가져오기 위한 email:', email || "없음 (비로그인 상태)");
      const data = await notificationApi.fetchNotifications(email);
      console.log('알림 가져오기 성공:', data);
      setNotifications(data);
    } catch (err) {
      console.error('알림을 가져오는 데 실패했습니다:', err);
      setError('알림을 가져오는 데 실패했습니다.');
    }
  };

  // 알림 삭제
  const handleDelete = async (alertId, email) => {
    try {
      console.log("삭제 요청 시작: alertId =", alertId, "email =", email);

      const response = await notificationApi.deleteNotification(alertId, email);

      console.log('삭제 응답:', response);
      setNotifications(notifications.filter((notif) => notif.alertId !== alertId));
      alert(response.message || '알림이 삭제되었습니다.');
    } catch (err) {
      console.error('알림 삭제 실패:', err);
      alert('알림 삭제에 실패했습니다.');
    }
  };


  // email이 설정된 후에만 getNotifications 실행
  useEffect(() => {
    if (email !== null) {
      getNotifications();
    }
  }, [email]);

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
                          key={notification.alertId}
                          className={`list-group-item bg-dark border-secondary d-flex justify-content-between align-items-center ${
                              !notification.isRead ? 'text-light' : 'text-secondary'
                          }`}
                      >
                        <div key={notification.alertId}>
                          <h5 className="mb-1">{notification.assetName}</h5>
                          {/*<p className="mb-1">*/}
                          {/*  목표가 {notification.targetPrice}원 {notification.condition === 'above' ? '이상' : '이하'}*/}
                          {/*</p>*/}
                          <p>알림 ID: {notification.alertId}</p>
                          <p>메시지: {notification.kafkaMessage}</p>
                          <small>{notification.triggeredAt}</small>
                        </div>
                        <div>
                          <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(notification.alertId,email)}
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
            {error && <div className="text-center text-danger py-2">{error}</div>}
          </div>
        </div>
      </div>
  );
}

export default Notifications;
