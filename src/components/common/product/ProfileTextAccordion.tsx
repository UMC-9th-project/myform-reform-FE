import { useState } from 'react';
import UpIcon from '../../../assets/icons/up.svg?react';
import DownIcon from '../../../assets/icons/down.svg?react';

interface AccordionItemProps {
  fullText: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const AccordionItem = ({
  fullText,
  isExpanded,
  onToggle,
}: AccordionItemProps) => {
  const lines = fullText.split('\n').filter((line) => line.trim() !== '');
  const firstTwoLines = lines.slice(0, 2);
  const hasMoreLines = lines.length > 2;

  return (
    <div className="flex gap-2">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 text-left hover:opacity-80 transition-opacity"
      >
        <div className="flex-1">
          {!isExpanded ? (
            <div className="flex flex-col gap-1">
              {firstTwoLines.map((line, index) => (
                <p
                  key={index}
                  className="body-b1-rg text-[var(--color-black)]"
                >
                  {line}
                  {index === 1 && hasMoreLines && '...'}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {lines.map((line, index) => (
                <p key={index} className="body-b1-rg text-[var(--color-black)]">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        {hasMoreLines && (
          <div className="flex-shrink-0 pt-0.5">
            {isExpanded ? (
              <UpIcon className="w-10 h-10 text-[var(--color-gray-60)] hover:text-[var(--color-black)]" />
            ) : (
              <DownIcon className="w-10 h-10 text-[var(--color-gray-60)] hover:text-[var(--color-black)]" />
            )}
          </div>
        )}
      </button>
    </div>
  );
};

interface ProfileTextAccordionProps {
  className?: string;
  /** 리폼러 프로필 소개글 (GET /profile 응답의 bio). 없으면 기본 문구 표시 */
  bio?: string | null;
}

const DEFAULT_BIO = `리폼러 소개가 등록되지 않았어요.`;

const ProfileTextAccordion = ({ className = '', bio }: ProfileTextAccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const fullText = (bio != null && bio.trim() !== '') ? bio.trim() : DEFAULT_BIO;

  return (
    <div className={`w-full space-y-0 ${className}`}>
      <AccordionItem
        key="bio"
        fullText={fullText}
        isExpanded={expandedItems.has('bio')}
        onToggle={() => toggleItem('bio')}
      />
    </div>
  );
};

export default ProfileTextAccordion;
