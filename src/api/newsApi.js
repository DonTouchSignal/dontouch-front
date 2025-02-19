import axios from 'axios';

const BASE_URL = 'http://localhost:8086/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const cleanTitle = (title) => {
  return title
    .replace(/<\/?b>/g, '')    
    .replace(/&quot;/g, '"') 
    .replace(/&amp;/g, '&')  
    .replace(/&lt;/g, '<')    
    .replace(/&gt;/g, '>')     
};

const newsApi = {
  // 주식 뉴스 검색
  getStockNews: async (stockName) => {
    try {
      const response = await axiosInstance.get('/news/stock', {
        params: { name: stockName }
      });
      response.data.items = response.data.items.map(item => ({
        ...item,
        title: cleanTitle(item.title)
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stock news:', error);
      throw error;
    }
  },

  // 암호화폐 뉴스 검색
  getCryptoNews: async (cryptoName) => {
    try {
      const response = await axiosInstance.get('/news/crypto', {
        params: { name: cryptoName }
      });
      response.data.items = response.data.items.map(item => ({
        ...item,
        title: cleanTitle(item.title)
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch crypto news:', error);
      throw error;
    }
  }
};

export default newsApi;