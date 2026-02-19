import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AgreementTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export default function AgreementTermsModal({
  isOpen,
  onClose,
  title,
  content,
}: AgreementTermsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const parseContent = (text: string) => {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    const sections: Array<{ type: 'title' | 'content'; text: string }> = [];
    let currentContent: string[] = [];

    lines.forEach((line) => {
      if (/^제\d+조/.test(line.trim())) {
        if (currentContent.length > 0) {
          sections.push({
            type: 'content',
            text: currentContent.join('\n'),
          });
          currentContent = [];
        }
        sections.push({
          type: 'title',
          text: line.trim(),
        });
      } else {
        currentContent.push(line);
      }
    });

    if (currentContent.length > 0) {
      sections.push({
        type: 'content',
        text: currentContent.join('\n'),
      });
    }

    return sections;
  };

  const contentSections = parseContent(content);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--color-white)] rounded-[1.875rem] shadow-lg w-[790px]  mx-4 max-h-[90vh] flex flex-col "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 py-[0.625rem]">
          <div className="body-b0-bd pl-[1.25rem] py-[1.25rem]">
            <h2>{title}</h2>
          </div>
        </div>

        <div className="flex px-[1.25rem] overflow-y-auto scrollbar-custom">
          <div className="w-full">
            {contentSections.map((section, index) => (
              <div key={index} className="mt-2">
                {section.type === 'title' ? (
                  <h3 className="body-b3-sb text-[var(--color-gray-60)]">
                    {section.text}
                  </h3>
                ) : (
                  <div
                    className="body-b3-sb text-[var(--color-gray-60)] whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 flex justify-center ">
          <button
            onClick={onClose}
            className="body-b1-sb text-[var(--color-mint-1)] cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
