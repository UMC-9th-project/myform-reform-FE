import { z } from 'zod';

// 이메일 스키마
export const emailSchema = z.string().email('유효하지 않은 이메일입니다.');

// 비밀번호 스키마
export const passwordSchema = z
  .string()
  .min(8, '영문, 숫자, 특수문자가 들어간 8자 이상의 비밀번호를 입력해주세요.')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    '영문, 숫자, 특수문자가 들어간 8자 이상의 비밀번호를 입력해주세요.'
  );

// 닉네임 스키마
export const nicknameSchema = z
  .string()
  .min(1, '사용할 수 없는 닉네임입니다.')
  .max(10, '사용할 수 없는 닉네임입니다.');

// 전화번호 스키마
export const phoneSchema = z
  .string()
  .regex(/^01[0-9]{8,9}$/, '정확한 휴대폰번호를 입력해주세요.');

// 인증코드 스키마
export const verificationCodeSchema = z
  .string()
  .min(1, '인증코드를 입력해주세요.')
  .regex(/^\d{6}$/, '정확한 인증코드를 입력해주세요.');
