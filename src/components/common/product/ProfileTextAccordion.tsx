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
}

const ProfileTextAccordion = ({ className = '' }: ProfileTextAccordionProps) => {
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

  const accordionData = [
    {
      id: 'item-1',
      fullText: `- 2019년부터 리폼 공방 운영 시작 ✨
- 6년차 스포츠 의류 리폼 전문 공방

고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어 있던 옷에 새로운 가치와 트렌디한 디자인을 더하는 리폼을 선보이고 있어요. 1:1 맞춤 리폼 제작부터 완성 제품까지 모두 주문 가능합니다.`,
    },
  ];

  return (
    <div className={`w-full space-y-0 ${className}`}>
      {accordionData.map((item) => (
        <AccordionItem
          key={item.id}
          fullText={item.fullText}
          isExpanded={expandedItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
};

export default ProfileTextAccordion;
