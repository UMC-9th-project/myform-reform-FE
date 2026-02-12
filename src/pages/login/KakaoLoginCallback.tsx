import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

const KakaoLoginCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const redirectUrl = searchParams.get('redirectUrl') || '/';

    if (accessToken) {
      // accessToken 저장
      // role은 서버에서 받은 토큰에 포함되어 있을 수 있으므로, 
      // 필요시 토큰을 디코딩하여 role을 추출하거나 별도로 받아야 함
      // 여기서는 기본적으로 'user'로 설정 (실제로는 서버 응답에 따라 결정)
      setAccessToken(accessToken, 'user');
      
      // refreshToken은 쿠키로 자동 저장됨 (withCredentials: true)
      
      // redirectUrl로 이동
      navigate(redirectUrl);
    } else {
      // 토큰이 없으면 에러 처리
      console.error('카카오 로그인 실패: accessToken이 없습니다.');
      navigate('/login');
    }
  }, [searchParams, navigate, setAccessToken]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="body-b1-md text-[var(--color-black)]">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoLoginCallback;
