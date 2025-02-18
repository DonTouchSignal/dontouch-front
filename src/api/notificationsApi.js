import axios from 'axios';

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


// 알림 API
const notificationApi = {
    fetchNotifications: async (email) => {
        try {
            // 이메일만 쿼리 파라미터로 전달
            const response = await axiosInstance.get(`/alert/history?email=${email}`);
            return response.data;
        } catch (error) {
            console.error('Notifications 오류:', error);
            throw error;
        }
    },

    // 알림 삭제
    deleteNotification: async (alertiId, email) => {
        try {
            console.log(`DELETE 요청: /alert/delete/${alertiId}?email=${email}`);
            const response = await axiosInstance.get(`/alert/delete/${alertiId}`, {
                params: { email: email },
            });
            console.log('삭제 성공:', response.data);
            return response.data;
        } catch (err) {
            console.error('삭제 요청 실패:', err.response?.data || err.message);
            throw err;
        }
}
};

export default notificationApi;
