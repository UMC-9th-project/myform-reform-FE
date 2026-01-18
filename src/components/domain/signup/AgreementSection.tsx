import { useState } from 'react';
import Checkbox from '../../common/Checkbox/Checkbox';
import AgreementTermsModal from './Modal/AgreementTermsModal';
import {
  SERVICE_TERMS_CONTENT,
  PRIVACY_TERMS_CONTENT,
} from '../../../constants/agreements';

interface AgreementSectionProps {
  agreeAll: boolean;
  agreeAge: boolean;
  agreeServiceTerms: boolean;
  agreePrivacy: boolean;
  onAgreeAll: (checked: boolean) => void;
  onAgreeAge: (checked: boolean) => void;
  onAgreeServiceTerms: (checked: boolean) => void;
  onAgreePrivacy: (checked: boolean) => void;
}

export default function AgreementSection({
  agreeAll,
  agreeAge,
  agreeServiceTerms,
  agreePrivacy,
  onAgreeAll,
  onAgreeAge,
  onAgreeServiceTerms,
  onAgreePrivacy,
}: AgreementSectionProps) {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  return (
    <div className="border-t border-[var(--color-line-gray-40)] pt-5">
      <div className="flex flex-col">
        {/* 모두 동의 */}
        <div className="bg-white flex gap-5 items-start pb-[0.9375rem] pt-5 px-5">
          <div className="flex items-center pt-[0.375rem]">
            <Checkbox checked={agreeAll} onChange={onAgreeAll} />
          </div>
          <div className="flex flex-col gap-0 leading-[1.5] w-[28.3125rem]">
            <p className="heading-h5-sb text-[var(--color-black)]">
              모두 동의합니다.
            </p>
            <p className="body-b3-rg text-[var(--color-gray-50)]">
              회원 가입 및 회원 관리 등의 목적으로 이메일, 비밀번호, 휴대폰 번호
              등의 정보를 수집 및 이용하고 있습니다.
            </p>
          </div>
        </div>

        {/* 개별 동의 항목 */}
        <div className="bg-white flex gap-5 items-start pb-[0.625rem] pl-5 pr-[0.875rem] pt-[0.9375rem]">
          <div className="flex items-center pt-[0.375rem]">
            <Checkbox checked={agreeAge} onChange={onAgreeAge} />
          </div>
          <p className="body-b1-rg text-[var(--color-black)] w-[21.875rem]">
            [필수] 만 14세 이상입니다.
          </p>
        </div>

        <div className="bg-white flex gap-5 items-start pb-[0.625rem] pt-[0.9375rem] px-5">
          <div className="flex items-center pt-[0.375rem]">
            <Checkbox
              checked={agreeServiceTerms}
              onChange={onAgreeServiceTerms}
            />
          </div>
          <div className="flex gap-[2.0625rem] items-center w-[28.3125rem]">
            <p className="body-b1-rg text-[var(--color-black)] w-[21.875rem]">
              [필수] 서비스 이용약관에 동의합니다.
            </p>
            <button
              type="button"
              className="body-b1-rg text-[var(--color-mint-1)] underline cursor-pointer"
              onClick={() => setIsServiceModalOpen(true)}
            >
              약관보기
            </button>
          </div>
        </div>

        <div className="bg-white flex gap-5 items-start pb-[0.625rem] pt-[0.9375rem] px-5">
          <div className="flex items-center pt-[0.375rem]">
            <Checkbox checked={agreePrivacy} onChange={onAgreePrivacy} />
          </div>
          <div className="flex gap-[2.0625rem] items-center w-[28.3125rem]">
            <p className="body-b1-rg text-[var(--color-black)] w-[21.875rem]">
              [선택] 개인 정보 수집·이용에 동의합니다.
            </p>
            <button
              type="button"
              className="body-b1-rg text-[var(--color-mint-1)] underline cursor-pointer"
              onClick={() => setIsPrivacyModalOpen(true)}
            >
              약관보기
            </button>
          </div>
        </div>
      </div>

      <AgreementTermsModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="서비스 이용약관"
        content={SERVICE_TERMS_CONTENT}
      />

      <AgreementTermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="개인정보 수집·이용 약관"
        content={PRIVACY_TERMS_CONTENT}
      />
    </div>
  );
}
