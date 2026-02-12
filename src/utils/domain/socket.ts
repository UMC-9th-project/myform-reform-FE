import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (accessToken: string) => {
  if (!accessToken) {
    console.error('❌ 토큰이 없어 소켓 연결 불가');
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

  console.log('🔑 소켓 연결 시도');

  socket = io('https://seoki.cloud', {
    path: '/socket.io', // 기본값이긴 하지만 명시해도 됨
    transports: ['websocket', 'polling'],
    auth: {
      token: `Bearer ${accessToken}`, // ✅ 핵심
    },
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('✅ 소켓 연결 성공:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('🔥 소켓 연결 에러:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ 소켓 연결 종료:', reason);
  });

  socket.on('token_expired', (data) => {
    console.warn('⏰ 토큰 만료:', data.message);
    // 여기서 로그아웃 처리하면 좋음
  });

  return socket;
};

export const getSocket = () => socket;
