import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signupReformer } from '../../../api/auth';
import { uploadImage, uploadImages } from '../../../api/upload';
import type { ReformerSignupRequest, SignupRequest } from '../../../types/api/auth';
import useAuthStore from '../../../stores/useAuthStore';

interface Return {
  signup: (data: {
    signupData: SignupRequest;
    portfolioPhotos: File[];
    description: string;
    businessNumber?: string;
    redirectUrl?: string;
  }) => Promise<void>;
}

export const useReformerSignup = (): Return => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();

  const { mutate: signupMutation} = useMutation({
    mutationFn: async (data: {
      signupData: SignupRequest;
      portfolioPhotos: File[];
      description: string;
      businessNumber?: string;
      redirectUrl?: string;
    }) => {
      // 1. 먼저 이미지 파일들을 업로드하여 URL 배열을 받아옴
      let portfolioPhotoUrls: string[] = [];
      
      if (data.portfolioPhotos.length > 0) {
        try {
          if (data.portfolioPhotos.length === 1) {
            // 단일 이미지 업로드
            const uploadResult = await uploadImage(data.portfolioPhotos[0]);
            if (uploadResult.resultType === 'SUCCESS' && uploadResult.success) {
              portfolioPhotoUrls = [uploadResult.success.url];
            } 
          } else {
            // 여러 이미지 업로드
            const uploadResult = await uploadImages(data.portfolioPhotos);
            if (uploadResult.resultType === 'SUCCESS' && uploadResult.success) {
              portfolioPhotoUrls = uploadResult.success.url;
            } 
          }
        } catch (error) {
          console.error('이미지 업로드 중 오류:', error);
        }
      }

      // 2. 업로드된 URL 배열을 사용하여 회원가입 요청
      const requestData: ReformerSignupRequest = {
        data: data.signupData,
        portfolioPhotos: portfolioPhotoUrls, // URL 배열로 전달
        description: data.description,
        ...(data.businessNumber !== undefined ? { businessNumber: data.businessNumber } : {}),
      };
      return signupReformer(requestData);
    },
    onSuccess: (data, variables) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        // 회원가입 성공 시 accessToken 저장
        if (data.success.accessToken) {
          setAccessToken(data.success.accessToken, 'reformer');
        }
        // redirectUrl이 있으면 해당 URL로 이동, 없으면 완료 페이지로 이동
        if (variables.redirectUrl) {
          navigate(variables.redirectUrl);
        } else {
          navigate('/signup/reformer-complete');
        }
      }
    },
   
  });

  const signup: Return['signup'] = async (data) => {
    return new Promise((resolve, reject) => {
      signupMutation(data, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return {
    signup,
  };
};
