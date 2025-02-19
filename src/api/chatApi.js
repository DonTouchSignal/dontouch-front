import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  withCredentials: true
  }
});

class ChatApi {
  constructor() {
    this.stompClient = null;
    this.messageCallbacks = [];
    this.isConnecting = false;
  }

  // 전체 메시지 조회
  getAllMessages = async () => {
    try {
      const response = await axiosInstance.get('/chat/all');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  // WebSocket 연결
  connectWebSocket = (onConnect, onError) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      debug: function (str) {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        'X-XSRF-TOKEN': 'null'  // CSRF 토큰 무시
      }
    });

    client.onConnect = () => {
      this.stompClient = client;
      
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        this.messageCallbacks.forEach(callback => callback(receivedMessage));
      });

      if (onConnect) onConnect();
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      if (onError) onError(frame);
    };

    client.activate();
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }

  // 메시지 수신 콜백 등록
  onMessage = (callback) => {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  // 메시지 전송
  sendMessage = async (message) => {
    if (!this.stompClient?.active) return;

    const messageData = {
      message: message,
      guest: true,
      nickName: null,
      sendAt: new Date().toISOString()
    };

    this.stompClient.publish({
      destination: '/app/message',
      body: JSON.stringify(messageData)
    });

    return messageData;
  }
}

export default new ChatApi();