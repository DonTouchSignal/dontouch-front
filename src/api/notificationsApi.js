import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // 'jwt-decode'에서 jwtDecode를 가져옴

const BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 임시 토큰 설정 (테스트용)
localStorage.setItem('accessToken', '\t\n' +
    'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiMTIzIiwiZW1haWwiOiJzb2h5dW41NDI5QGdtYWlsLmNvbSIsImlhdCI6MTczOTg5MTM1NywiZXhwIjoxNzM5ODk0OTU3fQ.XQqHJAJQUy_d3vJGGZWSWr5WXUanXupHZvYzAjVtg8w');
localStorage.setItem('userEmail', 'sohyun5429@gmail.com');

// 로컬 스토리지에서 토큰과 이메일 가져오는 함수
const getAuthHeaders = () => {

    const token = localStorage.getItem('accessToken');  // 저장된 토큰 가져오기

    if (!token) {
        console.warn("토큰이 없습니다.");
        return {};  // 토큰이 없으면 빈 객체 반환
    }

    // JWT 토큰을 디코딩하여 이메일 추출
    try {
        const decodedToken = jwtDecode(token);  // jwtDecode로 토큰 디코딩
        const email = decodedToken.email;  // JWT에서 이메일을 추출

        console.log('[Auth Headers] 이메일:', email || '❌ 없음');

        return {
            'X-Auth-User': email || ''  // 이메일을 헤더에 포함
        };
    } catch (error) {
        console.error('[Auth Headers] 토큰 디코딩 오류:', error);
        return {};  // 디코딩 오류가 발생하면 빈 객체 반환
    }
};

// 알림 API
const notificationApi = {

    // 알림 조회
    fetchNotifications: async () => {
        try {
            console.log('[GET] /alert/history 요청 시작...');
            console.log('[Headers]', getAuthHeaders());

            const response = await axiosInstance.get('/alert/history', {
                headers: getAuthHeaders()
            });

            console.log('[GET] 응답 상태:', response.status, response.statusText);
            console.log('[GET] 응답 데이터:', response.data);

            return response.data;
        } catch (error) {
            console.error('[GET] 알림 조회 오류:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // 알림 삭제
    deleteNotification: async (alertId) => {
        try {
            console.log(`[GET] 요청 시작: /alert/delete/${alertId}`);
            console.log('[Headers]', getAuthHeaders());

            const response = await axiosInstance.get(`/alert/delete/${alertId}`, {
                headers: getAuthHeaders()
            });

            console.log('[GET] 응답 상태:', response.status, response.statusText);
            console.log('[GET] 응답 데이터:', response.data);

            return response.data;
        } catch (err) {
            console.error('[GET] 알림 삭제 오류:', err.response ? err.response.data : err.message);
            throw err;
        }
    }
};

export default notificationApi;
