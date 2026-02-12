import { io, Socket } from 'socket.io-client';

export let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!token) {
    console.error("❌ 토큰이 없어 소켓 연결 불가");
    return null;
  }

  if (socket?.connected) {
    console.log('♻️ 기존 소켓 재사용', socket.id);
    return socket;
  }

  if (socket) {
    console.log('🗑️ 기존 소켓 제거');
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  console.log('🔑 토큰으로 소켓 연결 시도');

  // 🔥 polling을 먼저 시도하여 handshake (여기서 extraHeaders 작동)
  // 그 다음 자동으로 WebSocket으로 업그레이드됨
  socket = io("https://api.myform-reform.p-e.kr", {
    path: "/socket.io",
    transports: ["polling", "websocket"], // 🔥 순서 중요: polling 먼저
    extraHeaders: {
      auth: token // 🔥 백엔드가 기대하는 헤더명
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    upgrade: true, // polling → websocket 업그레이드 허용
  });

  socket.on('connect', () => {
    console.log('✅ 웹소켓 연결 성공', {
      socketId: socket?.id,
      transport: socket?.io.engine.transport.name // 현재 전송 방식 확인
    });
  });

  socket.on('upgrade', (transport) => {
    console.log('⬆️ 전송 방식 업그레이드:', transport.name);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ 웹소켓 연결 끊김:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('🔥 소켓 연결 에러:', err.message, err);
  });

  socket.onAny((event, ...args) => {
    console.log(`📩 수신 [${event}]`, args);
  });

  socket.onAnyOutgoing((event, ...args) => {
    console.log(`📤 발신 [${event}]`, args);
  });

  return socket;
};

export const getSocket = () => socket;
