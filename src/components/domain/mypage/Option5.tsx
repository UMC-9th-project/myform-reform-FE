import React from 'react';
import { X, Plus, GripVertical } from 'lucide-react';

export type SubOption = {
  id: number;
  apiId?: string;
  name: string;
  price: string;
  quantity: string;
};

export type OptionGroup = {
  id: number;
  apiId?: string;
  name: string;
  subOptions: SubOption[];
};

type Option5Props = {
  optionGroups: OptionGroup[];
  setOptionGroups: React.Dispatch<React.SetStateAction<OptionGroup[]>>;
  optionGroupIdRef: React.MutableRefObject<number>;
  subOptionIdRef: React.MutableRefObject<number>;
};

const Option5 = ({ optionGroups, setOptionGroups, optionGroupIdRef, subOptionIdRef }: Option5Props) => {

  const handleAddOptionGroup = () => {
    setOptionGroups(prev => [
      ...prev,
      {
        id: optionGroupIdRef.current++,
        name: '',
        subOptions: [
          {
            id: subOptionIdRef.current++,
            name: '선택 안 함',
            price: '0',
            quantity: '0',
          },
        ],
      },
    ]);
  };

  const handleRemoveOptionGroup = (groupId: number) => {
    setOptionGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const handleAddSubOption = (groupId: number) => {
    setOptionGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              subOptions: [
                ...group.subOptions,
                { id: subOptionIdRef.current++, name: '', price: '0', quantity: '0' },
              ],
            }
          : group
      )
    );
  };

  const handleRemoveSubOption = (groupId: number, subId: number) => {
    setOptionGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, subOptions: group.subOptions.filter(s => s.id !== subId) }
          : group
      )
    );
  };

  return (
    <div className="space-y-6">
      {optionGroups.map(group => (
        <div key={group.id} className="space-y-3">

          {/* 옵션 그룹 이름 */}
          <div className="relative flex items-center">
            <GripVertical className="absolute -left-8 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="옵션 이름을 입력해주세요."
              value={group.name}
              onChange={e =>
                setOptionGroups(prev =>
                  prev.map(g => (g.id === group.id ? { ...g, name: e.target.value } : g))
                )
              }
              className="w-full border border-[var(--color-gray-50)] p-5 body-b1-rg outline-none"
            />
            <X
              onClick={() => handleRemoveOptionGroup(group.id)}
              className="absolute -right-8 text-gray-400 cursor-pointer"
              size={20}
            />
          </div>

          {/* 세부 옵션 */}
          {group.subOptions.map(sub => (
            <div key={sub.id} className="relative flex items-center gap-3 ml-6">
              <GripVertical className="text-gray-400 shrink-0" size={20} />
              <input
                title="세부 이름"
                value={sub.name}
                onChange={e =>
                  setOptionGroups(prev =>
                    prev.map(g =>
                      g.id === group.id
                        ? {
                            ...g,
                            subOptions: g.subOptions.map(s =>
                              s.id === sub.id ? { ...s, name: e.target.value } : s
                            ),
                          }
                        : g
                    )
                  )
                }
                className="flex-1 border-b border-[var(--color-line-gray-40)] p-2 body-b1-rg outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <input
                  title="세부 옵션 가격"
                  value={sub.price}
                  onChange={e =>
                    setOptionGroups(prev =>
                      prev.map(g =>
                        g.id === group.id
                          ? {
                              ...g,
                              subOptions: g.subOptions.map(s =>
                                s.id === sub.id ? { ...s, price: e.target.value } : s
                              ),
                            }
                          : g
                      )
                    )
                  }
                  className="w-20 border-b border-[var(--color-line-gray-40)] p-2 text-left"
                />
                <span>원</span>
                <input
                  title="세부 옵션 수량"
                  value={sub.quantity}
                  onChange={e =>
                    setOptionGroups(prev =>
                      prev.map(g =>
                        g.id === group.id
                          ? {
                              ...g,
                              subOptions: g.subOptions.map(s =>
                                s.id === sub.id ? { ...s, quantity: e.target.value } : s
                              ),
                            }
                          : g
                      )
                    )
                  }
                  className="w-20 border-b border-[var(--color-line-gray-40)] p-2 text-left"
                />
                <span>개</span>
              </div>
              <X
                onClick={() => handleRemoveSubOption(group.id, sub.id)}
                className="absolute -right-8 text-gray-400 cursor-pointer"
                size={20}
              />
            </div>
          ))}

          <button
            onClick={() => handleAddSubOption(group.id)}
            className="flex items-center gap-1 body-b1-rg text-[var(--color-mint-1)] ml-6 cursor-pointer"
          >
            <Plus size={16} /> 세부 옵션 추가하기
          </button>
        </div>
      ))}

      <button
        onClick={handleAddOptionGroup}
        className="flex items-center gap-1 body-b1-rg text-[var(--color-mint-1)] font-medium cursor-pointer"
      >
        <Plus size={18} /> 옵션 추가하기
      </button>
    </div>
  );
};

export default Option5;
