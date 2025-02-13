import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

// JWT 토큰을 가져오는 함수 (나중에 구현)
const getAuthToken = () => {
  // localStorage나 다른 상태 관리 도구에서 토큰을 가져옴
  return localStorage.getItem('token');
};

// JWT 토큰에서 userId를 디코딩하거나, 별도로 저장된 userId를 가져옴
const getUserId = () => {
  const userId = localStorage.getItem('userId');
  console.log('Current userId:', userId); // 디버깅용
  return userId ? parseInt(userId) : null;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 요청 인터셉터에서 자동으로 인증 헤더 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = getAuthToken();
    const userId = getUserId();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      config.headers['X-USER-ID'] = userId;
    }
    
    console.log('Making request:', config.method.toUpperCase(), `${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 수정
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  error => {
    // 더 자세한 에러 로깅
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('No Response Received:', {
        request: error.request,
        config: error.config
      });
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error('Error Config:', error.message);
    }
    return Promise.reject(error);
  }
);

const boardApi = {
  // 사용자 ID 가져오기
  getUserId: () => {
    const userId = localStorage.getItem('userId');
    console.log('Current userId:', userId);
    return userId ? parseInt(userId) : null;
  },

  // 게시글 관련 API
  getPosts: async (assetId, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`/assets/${assetId}/posts`, {
        params: { page, size }
      });
      console.log('Posts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('getPosts Error Details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  getPost: async (assetId, postId) => {
    try {
      const response = await axiosInstance.get(`/assets/${assetId}/posts/${postId}`);
      const post = response.data;
      
      // 현재 사용자의 좋아요 여부 확인
      try {
        const likeStatus = await boardApi.getLikeStatus(assetId, postId);
        post.isLiked = likeStatus;
      } catch (error) {
        console.error('Failed to get like status:', error);
        post.isLiked = false;
      }
      
      return post;
    } catch (error) {
      console.error('getPost Error:', error);
      throw error;
    }
  },

  createPost: async (assetId, postData) => {
    try {
      const response = await axiosInstance.post(`/assets/${assetId}/posts`, postData);
      return response.data;
    } catch (error) {
      console.error('createPost Error:', error);
      throw error;
    }
  },

  updatePost: async (assetId, postId, postData) => {
    const response = await axiosInstance.put(`/assets/${assetId}/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (assetId, postId) => {
    await axiosInstance.delete(`/assets/${assetId}/posts/${postId}`);
  },

  // 댓글 관련 API
  getComments: async (postId, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}/comments`, {
        params: {
          page,
          size,
          sort: 'createdAt,desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('getComments Error:', error);
      throw error;
    }
  },

  createComment: async (postId, commentData) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('createComment Error:', error);
      throw error;
    }
  },

  updateComment: async (postId, commentId, commentData) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error('updateComment Error:', error);
      throw error;
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
    } catch (error) {
      console.error('deleteComment Error:', error);
      throw error;
    }
  },

  // 좋아요 관련 API
  toggleLike: async (assetId, postId) => {
    const isLiked = await boardApi.getLikeStatus(assetId, postId);
    if (isLiked) {
      await axiosInstance.delete(`/assets/${assetId}/posts/${postId}/like`);
    } else {
      await axiosInstance.post(`/assets/${assetId}/posts/${postId}/like`);
    }
  },

  getLikeStatus: async (assetId, postId) => {
    const response = await axiosInstance.get(`/assets/${assetId}/posts/${postId}/like`);
    return response.data;
  },

  // 현재 로그인한 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/user/me');
      return response.data;
    } catch (error) {
      console.error('getCurrentUser Error:', error);
      throw error;
    }
  },

  // 좋아요 등록
  likePost: async (assetId, postId) => {
    try {
      console.log(`Liking post: assetId=${assetId}, postId=${postId}`);
      const response = await axiosInstance.post(`/assets/${assetId}/posts/${postId}/like`);
      console.log('Like response:', response.data);
      return response.data;
    } catch (error) {
      console.error('likePost Error:', error);
      throw error;
    }
  },

  // 좋아요 취소
  unlikePost: async (assetId, postId) => {
    try {
      console.log(`Unliking post: assetId=${assetId}, postId=${postId}`);
      const response = await axiosInstance.delete(`/assets/${assetId}/posts/${postId}/like`);
      console.log('Unlike response:', response.data);
      return response.data;
    } catch (error) {
      console.error('unlikePost Error:', error);
      throw error;
    }
  },

  // 좋아요 상태 확인
  getLikeStatus: async (assetId, postId) => {
    try {
      const response = await axiosInstance.get(`/assets/${assetId}/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('getLikeStatus Error:', error);
      throw error;
    }
  },
};

export default boardApi;
