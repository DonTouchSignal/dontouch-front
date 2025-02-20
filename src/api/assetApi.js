import axios from "axios";
import { throttle } from "lodash";

const BASE_URL = "http://localhost:8080/asset"; // 백엔드 API URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 400000,
  headers: {
    "Content-Type": "application/json",
  },
});


const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  const authUser = localStorage.getItem('X-Auth-User');
  return { accessToken, authUser };
};

axiosInstance.interceptors.request.use(
  config => {
    const { accessToken, authUser } = getAuthHeaders();
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    if (authUser) {
      config.headers['X-Auth-User'] = authUser;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);




const assetApi = {
  //  종목 검색
  getDomesticStocks: async () => {
    try {
      const response = await axiosInstance.get("/symbols/domestic");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch domestic stocks:", error);
      throw error;
    }
  },

  //  해외 주식 가져오기
  getOverseasStocks: async () => {
    try {
      const response = await axiosInstance.get("/symbols/overseas");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch overseas stocks:", error);
      throw error;
    }
  },

  //  암호화폐 가져오기
  getCryptoStocks: async () => {
    try {
      const response = await axiosInstance.get("/symbols/crypto");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch crypto stocks:", error);
      throw error;
    }
  },

  getLiveMarketData: throttle(async (symbol) => {
    try {
      const response = await axiosInstance.get(`/market-data/live/${symbol}`);
      return response.data;
    } catch (error) {
      console.error("🚨 Failed to fetch live market data:", error);
    }
  }, 2000),  //1초 지연
  
  getLiveCryptoStocks: async () => {
    try {
      const response = await axiosInstance.get("/symbols/crypto/live");
      return response.data;
    } catch (error) {
      //console.error("❌ 암호화폐 실시간 데이터 가져오기 실패:", error);
      return [];
    }
  },
  

  
  searchStocks: async (keyword) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: { keyword: keyword },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch searchStocks:", error);
      throw error;
    }
  },

  //  종목 상세 정보
  getStockDetail: async (symbol) => {
    try {
      const response = await axiosInstance.get(`/${symbol}/market-data`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch stock detail:", error);
      throw error;
    }
  },

  //  관심 종목 조회
  getWatchlist: async (userEmail) => {
    try {
      const response = await axiosInstance.get("/watchlist", {
        headers: { "X-Auth-User": userEmail },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      throw error;
    }
  },

  //  관심 종목 추가
  addToWatchlist: async (userEmail, symbol) => {
    try {
      const response = await axiosInstance.post(`/${symbol}/watchlist`, null, {
        headers: { "X-Auth-User": userEmail },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      throw error;
    }
  },

  //  관심 종목 삭제
  removeFromWatchlist: async (userEmail, symbol) => {
    try {
      const response = await axiosInstance.delete(`/${symbol}/watchlist`, {
        headers: { "X-Auth-User": userEmail },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      throw error;
    }
  },

  //  종목 리스트 (전체 심볼)
  getAllSymbols: async () => {
    try {
      const response = await axiosInstance.get("/symbols");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch symbols:", error);
      throw error;
    }
  },

  setTargetPrice: async (userEmail, symbol, targetPrice) => {
    try {
      const response = await axiosInstance.post(
        `/${symbol}/target-price`, 
        targetPrice,  // ✅ 값만 직접 전송
        { headers: { "X-Auth-User": userEmail } }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to set target price:", error);
      throw error;
    }
  },

  //  목표 가격 조회
  getTargetPrices: async (userEmail) => {
    try {
      const response = await axiosInstance.get("/target-prices", {
        headers: { "X-Auth-User": userEmail },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch target prices:", error);
      throw error;
    }
  },

  //  목표 가격 삭제
  removeTargetPrice: async (userEmail, symbol) => {
    try {
      const response = await axiosInstance.delete(`/${symbol}/target-price`, {
        headers: { "X-Auth-User": userEmail },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to remove target price:", error);
      throw error;
    }
  },

  // 실시간 시세 WebSocket 연결 (WebSocket URL: `/topic/market-data/{symbol}`)
  subscribeLiveMarketData: (symbol, onMessage) => {
    const socket = new WebSocket(`ws://localhost:8087/topic/market-data/${symbol}`);

    socket.onopen = () => console.log(`✅ WebSocket 연결 성공: ${symbol}`);
    socket.onmessage = (event) => onMessage(JSON.parse(event.data));
    socket.onerror = (error) => console.error(`❌ WebSocket 오류: ${error}`);
    socket.onclose = () => console.log(`🚪 WebSocket 연결 종료: ${symbol}`);

    return socket;
  },
};

export default assetApi;
