import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../common/button/button1_tmp';
import successIcon from '../Modal/icons/successIcon.svg';
import cancelIcon from '../Modal/icons/cancelIcon.svg';

export type AlertType = 'success' | 'cancel';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  message,
  type = 'success',
  confirmText = '확인',
}: AlertModalProps) {
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

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[1.875rem] px-[5.125rem] py-[2.6875rem] flex flex-col items-center max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-[1.25rem]">
          <div>
            {type === 'success' ? (
              <img src={successIcon} alt="success" />
            ) : (
              <img src={cancelIcon} alt="success" />
            )}
          </div>

          <p className="body-b1-sb text-[var(--color-black)] text-center whitespace-pre-line ">
            {message}
          </p>
        </div>

        <div className="mt-[1.875rem] w-full ">
          <Button
            variant="primary"
            size="default"
            onClick={onClose}
            className="w-full body-b1-sb h-[52px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
