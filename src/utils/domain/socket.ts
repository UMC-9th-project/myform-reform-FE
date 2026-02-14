import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (accessToken: string) => {
  if (!accessToken) {
    console.error('토큰이 없어 소켓 연결 불가');
    return null;
  }

  // 이미 연결되어 있으면 재사용
  if (socket && socket.connected) {
    return socket;
  }

  // 기존 소켓 정리
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  console.log('소켓 연결 시도');

  socket = io('https://seoki.cloud', {
    path: '/test/socket.io',
    transports: ['websocket', 'polling'],
    auth: {
      token: `Bearer ${accessToken}`,
    },
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('소켓 연결 성공:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('소켓 연결 에러:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('소켓 연결 종료:', reason);
  });

  socket.on('token_expired', (data) => {
    console.warn('토큰 만료:', data.message);
  });

  return socket;
};

export const getSocket = () => socket;
