import React, { useRef } from 'react'; // 1. useRef 추가
import ImageSource from '../../../assets/mypage/Image.svg';
import FolderPlusSource from '../../../assets/mypage/Folder plus.svg';

interface UploadModalProps {
  onClose: () => void;
  onFileSelected: (files: File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onFileSelected }) => {
  // 2. 파일 입력창을 가리킬 '리모컨' 같은 변수를 만듭니다.
  const fileInputRef = useRef<HTMLInputElement>(null);


  // 3. 버튼을 클릭했을 때 실행될 함수
  const handleButtonClick = () => {
    // 숨겨진 file input을 클릭한 것과 같은 효과를 냅니다.
    fileInputRef.current?.click();
  };

  // 4. 파일을 선택했을 때 실행될 함수 (나중에 서버에 올리는 로직이 들어갈 곳)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    onFileSelected(selectedFiles);
    onClose();
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative w-full max-w-[560px] bg-white rounded-[2.5rem] pt-4 pb-12 shadow-xl overflow-hidden">
        
        {/* 헤더 영역 */}
        <div className="relative px-12 flex items-center justify-center">
          <h1 className="heading-h5-sb text-black">내 작업물 업로드하기</h1>
          <button onClick={onClose} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors" title="모달 닫기 버튼">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="w-full h-[1px] bg-[var(--color-gray-40)] mt-4 mb-0" />

        <div className="px-12 flex flex-col items-center">
          {/* 중앙 아이콘 영역 */}
          <div className="relative w-40 h-32 mb-8 flex justify-center items-center">
             <img src={ImageSource} alt="" className="absolute left-0 bottom-3 w-20 h-20 object-contain" />
             <img src={FolderPlusSource} alt="" className="absolute right-2 top-20 w-20 h-20 object-contain" />
          </div>

          <p className="body-b1-rg text-black mt-8 mb-10">사진과 영상을 업로드 해보세요.</p>

          {/* 5. 숨겨진 파일 입력창 */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" // 화면에는 보이지 않게 숨김
            accept="image/*,video/*" 
            title = "파일 입력창"
            multiple
          />

          {/* 6. 실제 보이는 버튼 */}
          <button 
            onClick={handleButtonClick} // 클릭 시 위에서 만든 함수 실행
            className="w-full max-w-[280px] py-6 bg-[var(--color-mint-0)] hover:bg-[#65BCB6] text-white rounded-2xl body-b0-bd transition-all shadow-lg shadow-[#76D2CC]/20"
          >
            내 컴퓨터에서 선택
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;