import React, { useRef } from 'react';
import { AlignLeft, ArrowsUpFromLine } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useNavigate } from 'react-router-dom';

const ProductDescriptionEditor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Highlight,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder:'제품의 상세 설명을 입력해주세요!'
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[60rem] focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="heading-h2-bd text-black">상품 설명 등록하기</h2>
      </div>

      <hr className="border-black mb-4" />

      {/* 툴바 */}
      <div className="flex flex-col gap-2">
        {/* 상단 */}
        <div className="flex items-center justify-between px-2 py-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center text-gray-500 hover:text-gray-800"
          >
            <span className="body-b0-rg mt-1 text-[var(--color-gray-50)]">
              <svg
                width="48"
                height="43"
                viewBox="0 0 48 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.33333 41H39.6667C42.0599 41 44 39.0599 44 36.6667V6.33333C44 3.9401 42.0599 2 39.6667 2H9.33333C6.9401 2 5 3.9401 5 6.33333V36.6667C5 39.0599 6.9401 41 9.33333 41ZM9.33333 41L33.1667 17.1667L44 28M20.1667 13.9167C20.1667 15.7116 18.7116 17.1667 16.9167 17.1667C15.1217 17.1667 13.6667 15.7116 13.6667 13.9167C13.6667 12.1217 15.1217 10.6667 16.9167 10.6667C18.7116 10.6667 20.1667 12.1217 20.1667 13.9167Z"
                  stroke="#1E1E1E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              사진
            </span>
          </button>

          <button
            onClick={() => {
              const html = editor.getHTML();
              navigate('/custom-order/create',{
                state: {
                  description: html,
                },
            });
            }}
            className="bg-[var(--color-mint-0)] text-white px-10 py-5 rounded-[0.625rem] body-b0-bd"
          >
            등록하기
          </button>

        </div>

        <hr className="border-[var(--color-line-gray-40)]" />

        {/* 하단 툴바 */}
        <div className="flex items-center gap-4 px-2 py-2 text-gray-600 overflow-x-auto">
          <span className='body-b0-rg text-[var(--color-gray-60)]'>본문</span>
          <div className="w-[0.05rem] h-6 bg-[var(--color-gray-40)] mx-1" />

          <div className="flex items-center gap-5">
            <button title="볼드체" onClick={() => editor.chain().focus().toggleBold().run()}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8903 4C15.4147 4 17.308 4.33305 18.5702 5.11016C19.9376 5.88728 20.5687 7.21947 20.5687 9.10675C20.5687 10.2169 20.2531 11.2161 19.8324 11.9932C19.5939 12.3728 19.2841 12.6967 18.9223 12.9449C18.5605 13.1932 18.1542 13.3604 17.7287 13.4364C18.33 13.5846 18.9004 13.848 19.4117 14.2135C19.8324 14.5466 20.2531 15.1016 20.5687 15.6567C20.8979 16.4609 21.042 17.3358 20.9894 18.2101C21.0266 19.0121 20.8841 19.8121 20.5734 20.5451C20.2627 21.2781 19.7926 21.9234 19.2013 22.4287C17.704 23.5574 15.8836 24.1063 14.0473 23.9829H7V4H12.8903ZM13.311 11.8822C14.468 11.8822 15.3095 11.7711 15.7302 11.3271C16.2562 10.994 16.4665 10.3279 16.4665 9.66183C16.4665 8.88472 16.151 8.32964 15.6251 7.99659C15.0991 7.66354 14.2577 7.44151 13.1006 7.44151H10.997V11.8822H13.311ZM10.997 15.2127V20.6525H13.6266C14.7836 20.6525 15.7302 20.3194 16.151 19.8753C16.6769 19.3203 16.8873 18.7652 16.8873 17.877C16.8998 17.5415 16.84 17.2073 16.7125 16.8996C16.585 16.5919 16.393 16.3188 16.151 16.1008C15.6251 15.6567 14.7836 15.4347 13.5214 15.4347H10.8918L10.997 15.2127Z" fill="black"/>
              </svg>
            </button>
            <button title="이탈릭체" onClick={() => editor.chain().focus().toggleItalic().run()}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.7143 4L10.2857 23M6 23H14.5714M12.4286 4H21" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round"/>
              </svg>

            </button>
            <button title="언더라인"onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.57143 5V11.4286C7.57143 13.1335 8.24872 14.7687 9.45431 15.9743C10.6599 17.1798 12.295 17.8571 14 17.8571C15.705 17.8571 17.3401 17.1798 18.5457 15.9743C19.7513 14.7687 20.4286 13.1335 20.4286 11.4286V5M5 23H23" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </button>
            <button title="중간 줄 긋기" onClick={() => editor.chain().focus().toggleStrike().run()}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 6H6V9M14.5 6H23V9M14.5 6V23M10 23H19" stroke="black" stroke-width="1.5" stroke-miterlimit="10"/>
                <path d="M2 15H27" stroke="black" stroke-width="1.5"/>
              </svg>
            </button>
          </div>
          <div className="w-[0.05rem] h-6 bg-[var(--color-gray-40)] mx-1" />

          <div className="flex items-center gap-5">
            <button
              title="오른쪽 정렬"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <AlignLeft size={23} />
            </button>
            <button
              title="줄바꿈" onClick={() => editor.chain().focus().setHardBreak().run()}
            >
              <ArrowsUpFromLine size={23} />
            </button>
          </div>
        </div>
      </div>

      {/* 에디터 */}
      <div className="mt-2 border-t border-gray-200">
        <EditorContent
          editor={editor}
          className="min-h-[60rem] p-6 bg-[var(--color-gray-20)] outline-none body-b0-rg"
        />
      </div>

      {/* hidden input */}
      <input
        title="파일 삽입"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ProductDescriptionEditor;
