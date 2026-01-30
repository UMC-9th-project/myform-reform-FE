import { useState } from 'react';
import NicknameModal from '../../components/domain/mypage/NicknameModal';
import Button from '../../components/common/button_tmp/button1';
import Profile from '../../assets/icons/profile.svg';

const EditProfilePage = () => {
    const MAX_NICKNAME_LENGTH = 10;
    const [nickname, setNickname] = useState('침착한 대머리 독수리');
    const MAX_DESCRIPTION_LENGTH = 200;
    const [description, setDescription] = useState(`- 2019년부터 리폼 공방 운영 시작 ✨\n- 6년차 스포츠 의류 리폼 전문 공방\n\n고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어 있던 옷에 새로운 가치와 트렌디한 디자인을 더하는 리폼을 선보이고 있어요. 1:1 맞춤 리폼 제작부터 완성 제품까지 모두 주문 가능합니다.`);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [inputKeyword, setInputKeyword] = useState('');
    const DEFAULT_PROFILE_IMAGE = Profile;
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleDeleteKeyword = (tag: string) => {
        setKeywords(keywords.filter(k => k !== tag));
    };


    return (
        <div className="w-full min-h-screen bg-white py-16">
            <div className="max-w-[75rem] mx-auto px-12 flex gap-20 items-start">
                {/* [왼쪽 영역] 프로필 이미지 - sticky 적용 */}
                <div className="w-[12.5rem] flex-shrink-0">
                    <div className="sticky top-10">
                        <div className="w-48 h-48 rounded-full overflow-hidden border border-[var(--color-gray-50)]">
                            <img
                                src={profileImage || DEFAULT_PROFILE_IMAGE}
                                alt="Profile"
                                className={`object-cover w-full h-full ${
                                !profileImage ? "scale-140" : ""
                                }`}
                                onError={(e) => {
                                e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                                }}
                            />
                        </div>
                        <label className="absolute bottom-2 right-2 w-10 h-10 bg-[#5A616A] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-gray-600 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>
                            <input
                                type="file"
                                className='hidden'
                                accept="image/*"
                                title="사진 첨부"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setProfileImage(imageUrl);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

                {/* 입력 폼 */}
                <div className="flex-1 space-y-12">
                    {/* 닉네임 섹션 */}
                    <div className="relative">
                        <label className="block body-b1-rg mb-4">닉네임</label>
                        <div className="flex items-center border border-[var(--color-line-gray-40)] p-5 transition-colors">
                            <input 
                                type="text" 
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                maxLength={MAX_NICKNAME_LENGTH}
                                className="w-full body-b0-rg outline-none bg-transparent"
                                title="닉네임 입력"
                            />
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" onClick={() => setIsNicknameModalOpen(true)} className='cursor-pointer'>
                                <path d="M1 27H6.57124L27 6.57124L21.4281 1L1 21.4288V27Z" stroke="#646F7C" strokeWidth="2" strokeLinejoin="round"/>
                                <path d="M15.8555 6.57031L21.4267 12.1416" stroke="#646F7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="absolute -right-16 -bottom-0 text-sm text-[var(--color--gray-60)]">{nickname.length}/{MAX_NICKNAME_LENGTH}자</span>
                    </div>

                    {/* 자기소개 섹션 */}
                    <div className="relative">
                        <label className="block body-b1-rg mb-4 text-black">자기소개</label>
                        <div className="border border-[var(--color-line-gray-40)] p-6 focus-within:border-[#82D1D1] transition-colors">
                            <textarea 
                                rows={10}
                                value={description} // value로 통일
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={MAX_DESCRIPTION_LENGTH}
                                placeholder='프로필에 노출될 소개글을 작성해주세요.'
                                className="w-full text-[var(--color-gray-50)] body-b1-rg leading-relaxed outline-none resize-none bg-transparent"
                            />
                            <div className="absolute -bottom-0 -right-20 text-sm text-[var(--color--gray-60)]">
                                {description.length}/{MAX_DESCRIPTION_LENGTH}자
                            </div>
                        </div>
                    </div>

                    {/* 키워드 섹션 */}
                    <div>
                        <label className="block body-b1-rg mb-4">키워드</label>
                        <div className="border border-[var(--color-line-gray-40)] p-4 focus-within:border-[#82D1D1] transition-colors">
                            <input 
                                type="text"
                                value={inputKeyword}
                                onChange={(e) => setInputKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if ((e.key === 'Enter' || e.key === ',') && inputKeyword.trim() !== '') {
                                        e.preventDefault();
                                        const newTag = inputKeyword.trim();
                                        if (keywords.includes(newTag)) {
                                            alert('이미 등록된 키워드입니다.');
                                        } else if (keywords.length >= 3) {
                                            alert('키워드는 최대 3개까지 등록 가능합니다.');
                                        } else {
                                            setKeywords([...keywords, newTag]);
                                        }
                                        setInputKeyword('');
                                    }
                                }}
                                placeholder='자신을 표현하는 키워드를 입력해주세요'
                                className='w-full outline-none bg-transparent body-b1-rg text-[var(--color-gray-50)]'
                            />
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2 flex-wrap">
                                    {keywords.map(tag => (
                                        <span key={tag} className='px-3 py-2 mb-3 rounded-[5rem] bg-[var(--color-mint-6)] border border-[var(--color-mint-1)] text-[var(--color-gray-60)] body-b3-rg flex items-center gap-1'>
                                            # {tag}
                                            <button type="button" onClick={() => handleDeleteKeyword(tag)} className="text-xs ml-1">✕</button>
                                        </span>
                                    ))}
                                </div>
                                <span className="absolute right-28 -translate-y-[1.5rem] text-sm text-[var(--color--gray-60)]">{keywords.length}/3개</span>
                            </div>
                            <p className="body-b1-rg text-[var(--color-gray-50)]">
                                Tip) 본인이 주로 제작하는 상품 유형, 디자인 스타일 등을 작성해주세요!
                            </p>
                    </div>
                </div>
            </div>
            {/* 하단 버튼 */}
            <div className="pt-10 flex justify-center">
                <Button
                    size="big"
                    variant="primary"
                    className="w-64"
                    onClick={() => {
                        // 저장 로직
                    }}
                >
                    수정하기
                </Button>

            </div>
            {isNicknameModalOpen && (
              <NicknameModal
                isOpen={isNicknameModalOpen}
                currentNickname={nickname} 
                onClose={() => setIsNicknameModalOpen(false)} 
                onSave={(newNickname: string) => {
                    setNickname(newNickname);
                    setIsNicknameModalOpen(false);
                }}
            />
)}

        </div>
    );
};

export default EditProfilePage;