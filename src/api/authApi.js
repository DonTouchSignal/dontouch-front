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

const authApi = {
  // 회원가입
  register: async (userData) => {
    try {
      console.log('Request Data:', userData);
      const response = await axiosInstance.post('/user/signup', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
      }
      throw error;
    }
  },

  // 로그인
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data === "로그인 성공") {
        // 변경된 헤더 이름으로 토큰 가져오기
        const accessToken = response.headers['accesstoken'];
        const refreshToken = response.headers['refreshtoken'];
        const authUser = response.headers['x-auth-user'];
        
        console.log('Response Headers:', {
          accessToken,
          refreshToken,
          authUser
        });

        // localStorage에 저장
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        if (authUser) {
          localStorage.setItem('X-Auth-User', authUser);
        }

        // 저장된 값 확인
        console.log('Stored values:', {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
          authUser: localStorage.getItem('X-Auth-User')
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout', null, {
        headers: {
          'X-Auth-User': localStorage.getItem('X-Auth-User'),
          'Authorization': localStorage.getItem('accessToken')
        }
      });
      
      // 로그아웃 성공 시 저장된 정보 삭제
      localStorage.removeItem('X-Auth-User');
      localStorage.removeItem('accessToken');
      
      return response.data;
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },

  // 로그인 상태 확인
  checkLoginStatus: async () => {
    try {
      const response = await axiosInstance.get('/auth/status', {
        headers: {
          'X-Auth-User': localStorage.getItem('X-Auth-User'),
          'Authorization': localStorage.getItem('accessToken')
        }
      });
      return response.data;
    } catch (error) {
      console.error('Check Login Status Error:', error);
      throw error;
    }
  }
};

// axios 인터셉터 수정
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    const authUser = localStorage.getItem('X-Auth-User');
    
    if (token) {
      config.headers['accesstoken'] = token; // 헤더 이름 변경
    }
    if (authUser) {
      config.headers['x-auth-user'] = authUser;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default authApi; 