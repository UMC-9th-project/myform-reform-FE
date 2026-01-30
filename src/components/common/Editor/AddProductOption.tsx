import { useState } from 'react';
import { X } from 'lucide-react';
import GripVerticalIcon from '../../../assets/icons/gripvertical.svg?react';
import PlusIcon from '../../../assets/icons/mintPlus.svg?react';
import Button from '../button_tmp/button1';

interface SubOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

interface Option {
  id: string;
  name: string;
  subOptions: SubOption[];
}

const AddProductOption = () => {
  const [options, setOptions] = useState<Option[]>([
    {
      id: '1',
      name: '',
      subOptions: [
        {
          id: '1-1',
          name: '선택 안함',
          price: 0,
          isDefault: true,
        },
      ],
    },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleAddOption = () => {
    const now = Date.now();
    const newOption: Option = {
      id: now.toString(),
      name: '',
      subOptions: [
        {
          id: `${now}-1`,
          name: '선택 안함',
          price: 0,
          isDefault: true,
        },
      ],
    };
    setOptions([...options, newOption]);
  };

  const handleDeleteOption = (optionId: string) => {
    if (options.length === 1) {
      setShowModal(true);
      return;
    }
    setOptions(options.filter((option) => option.id !== optionId));
  };

  const handleOptionNameChange = (optionId: string, name: string) => {
    setOptions(
      options.map((option) =>
        option.id === optionId ? { ...option, name } : option
      )
    );
  };

  const handleAddSubOption = (optionId: string) => {
    const newSubOption: SubOption = {
      id: `${optionId}-${Date.now()}`,
      name: '',
      price: 0,
      isDefault: false,
    };
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? { ...option, subOptions: [...option.subOptions, newSubOption] }
          : option
      )
    );
  };

  const handleDeleteSubOption = (optionId: string, subOptionId: string) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              subOptions: option.subOptions.filter(
                (sub) => sub.id !== subOptionId
              ),
            }
          : option
      )
    );
  };

  const handleSubOptionNameChange = (
    optionId: string,
    subOptionId: string,
    name: string
  ) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              subOptions: option.subOptions.map((sub) =>
                sub.id === subOptionId ? { ...sub, name } : sub
              ),
            }
          : option
      )
    );
  };

  const handleSubOptionPriceChange = (
    optionId: string,
    subOptionId: string,
    price: number
  ) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              subOptions: option.subOptions.map((sub) => {
                if (sub.id === subOptionId) {
                  // 선택 안함(isDefault)인 경우 항상 0원으로 고정
                  return {
                    ...sub,
                    price: sub.isDefault ? 0 : price,
                  };
                }
                return sub;
              }),
            }
          : option
      )
    );
  };

  return (
    <div className="flex flex-col gap-4 w-[830px]">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <GripVerticalIcon className="w-10 h-10" />
            <input
              type="text"
              placeholder="옵션 이름을 입력해주세요."
              value={option.name}
              onChange={(e) =>
                handleOptionNameChange(option.id, e.target.value)
              }
              className="px-4 text-body-b1-rg  border border-[var(--color-gray-60)] bg-[var(--color-white)] focus:outline-none focus:ring-0 focus:border-[var(--color-gray-60)]"
              style={{ width: '730px', height: '58px' }}
            />
            <button
              type="button"
              onClick={() => handleDeleteOption(option.id)}
              className="w-6 h-6 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {option.subOptions.length > 0 && (
            <div className="flex flex-col gap-2" style={{ marginLeft: '64px' }}>
              {option.subOptions.map((subOption, subIndex) => (
                <div
                  key={subOption.id}
                  className={`flex items-center ${subIndex > 0 ? 'pt-2' : ''}`}
                  style={{ height: '52px', gap: '10px' }}
                >
                  <GripVerticalIcon className="w-10 h-10" />

                  {subOption.isDefault ? (
                    <span
                      className="px-4 py-2 text-body-b1-rg border-b border-[var(--color-line-gray-40)]"
                      style={{ width: '460px', marginRight: '20px' }}
                    >
                      {subOption.name}
                    </span>
                  ) : (
                    <input
                      type="text"
                      placeholder="옵션을 입력해주세요."
                      value={subOption.name}
                      onChange={(e) =>
                        handleSubOptionNameChange(
                          option.id,
                          subOption.id,
                          e.target.value
                        )
                      }
                      className="px-4 text-body-b1-rg  py-2 border-b border-[var(--color-line-gray-40)] focus:outline-none focus:ring-0"
                      style={{ width: '460px', marginRight: '20px' }}
                    />
                  )}

                  <div className="flex w-[192px] items-center border-b border-[var(--color-line-gray-40)] py-2 px-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        subOption.isDefault
                          ? subOption.price
                          : subOption.price === 0
                            ? ''
                            : subOption.price
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          if (!subOption.isDefault) {
                            handleSubOptionPriceChange(
                              option.id,
                              subOption.id,
                              0
                            );
                          }
                        } else {
                          const numValue = parseInt(
                            value.replace(/[^0-9]/g, ''),
                            10
                          );
                          if (!isNaN(numValue)) {
                            handleSubOptionPriceChange(
                              option.id,
                              subOption.id,
                              numValue
                            );
                          }
                        }
                      }}
                      onFocus={(e) => {
                        if (subOption.price === 0 && !subOption.isDefault) {
                          e.target.select();
                        }
                      }}
                      disabled={subOption.isDefault}
                      className="border-0 p-0 text-body-b1-rg focus:outline-none focus:ring-0 w-[140px] disabled:bg-transparent disabled:cursor-not-allowed"
                    />
                    <span className="text-body-b1-rg ml-2">원</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteSubOption(option.id, subOption.id)
                    }
                    className="w-6 h-6 flex items-center justify-center"
                    style={{ marginLeft: '5px', marginRight: '18px' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleAddSubOption(option.id)}
            className="flex items-center gap-2 text-[var(--color-mint-1)] mb-4"
            style={{ marginLeft: '64px' }}
          >
            <PlusIcon className="w-10 h-10" />
            <span className="text-body-b1-rg">세부 옵션 추가하기</span>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddOption}
        className="flex items-center gap-2 text-[var(--color-mint-1)]"
      >
        <PlusIcon className="w-10 h-10" />
        <span className="text-body-b1-rg">옵션 추가하기</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white flex flex-col shadow-lg"
            style={{
              width: '426px',
              borderRadius: '20px',
              paddingTop: '37px',
              paddingRight: '21px',
              paddingBottom: '22px',
              paddingLeft: '21px',
              gap: '35px',
            }}
          >
            <p className="text-body-b1-sb text-center">
              최소 하나 이상의 옵션이 필요합니다.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowModal(false)}
              className="mx-auto !text-body-b1-sb"
              style={{ width: '213px', height: '52px' }}
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductOption;
