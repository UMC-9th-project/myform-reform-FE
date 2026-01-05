import { useState } from 'react';
import UpIcon from '../../../assets/icons/up.svg?react';
import DownIcon from '../../../assets/icons/down.svg?react';

interface AccordionItemProps {
  id: string;
  fullText: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const AccordionItem = ({
  fullText,
  isExpanded,
  onToggle,
}: AccordionItemProps) => {
  const lines = fullText.split('\n');
  const firstTwoLines = lines.slice(0, 2);
  const remainingLines = lines.slice(2);

  return (
    <div className="border-b  last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:opacity-80 transition-opacity"
      >
        <div className={isExpanded ? 'w-[634px]' : 'flex-1'}>
          {!isExpanded ? (
            <div className="space-y-1">
              {firstTwoLines.map((line, index) => (
                <p
                  key={index}
                  className={`body-b1-rg text-gray-900 ${
                    index === 1 ? 'truncate' : ''
                  }`}
                >
                  {line}
                  {index === 1 && remainingLines.length > 0 && ' ...'}
                </p>
              ))}
            </div>
          ) : (
            <div className="space-y-1 break-words">
              {lines.map((line, index) => (
                <p key={index} className="body-b1-rg text-gray-900 break-words">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <UpIcon className="w-8 h-8 text-black" />
          ) : (
            <DownIcon className="w-8 h-8 text-black" />
          )}
        </div>
      </button>
    </div>
  );
};

const ProfileTextAccordion = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['item-2'])
  );

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
    <div className="w-[752px] space-y-0">
      {accordionData.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          fullText={item.fullText}
          isExpanded={expandedItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
};

export default ProfileTextAccordion;
