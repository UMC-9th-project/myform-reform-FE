import { useState } from 'react';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  onClose?: () => void;
}

const Calendar = ({
  selected,
  onSelect,
  disabled = false,
  className = '',
  onClose,
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);

  const handleSelect = (value: unknown) => {
    const date = value instanceof Date ? value : undefined;
    setSelectedDate(date);
    onSelect?.(date);
  };

  return (
    <div
      className={`relative bg-[var(--color-white)] rounded-[0.625rem] p-6 shadow-lg w-[29.125rem] ${className}`}
    >
      <style>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: var(--font-family-pretendard);
        }

        .react-calendar__navigation {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0;
          margin-bottom: 1rem;
          position: relative;
          height: 2rem;
          padding-left: 5rem; /* 왼쪽 마진 추가 */
          padding-right: 3rem; /* X 버튼 공간 확보 */
        }

        /* ===== 네비게이션 화살표 (이전/다음 월) ===== */
        .react-calendar__navigation__arrow {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: none;
          background: transparent !important;
          cursor: pointer;
          color: var(--color-gray-60);
          flex-shrink: 0;
          outline: none !important;
          box-shadow: none !important;
        }

        /* 왼쪽 화살표 (<) - 이전 월 */
        .react-calendar__navigation__arrow:first-of-type {
          order: 1;
        }

        /* 오른쪽 화살표 (>) - 다음 월 */
        .react-calendar__navigation__arrow:last-of-type {
          margin-left: 0.5rem; /* 년월과의 간격 */
          margin-right: 4.5rem; /* X 버튼과의 간격 확보 */
          order: 3;
        }

        .react-calendar__navigation__arrow:focus,
        .react-calendar__navigation__arrow:active,
        .react-calendar__navigation__arrow:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .react-calendar__navigation__label {
          flex: 1;
          text-align: center;
          font-size: 1.25rem; /* body-b0-sb (20px) */
          font-weight: 600; /* body-b0-sb */
          line-height: 150%; /* body-b0-sb */
          color: var(--color-black);
          background: transparent;
          border: none;
          pointer-events: none;
          cursor: default;
          order: 2;
        }

      
        .react-calendar__month-view__weekdays {
          display: flex;
          margin-bottom: 0.5rem;
        }

        .react-calendar__month-view__weekdays__weekday {
          flex: 1;
          text-align: center;
          font-size: 0.9375rem; /* body-b3-rg */
          font-weight: 400; /* body-b3-rg */
          line-height: 150%; /* body-b3-rg */
          color: var(--color-black);
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .react-calendar__month-view__days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .react-calendar__month-view__days > button {
          height: 3.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .react-calendar__tile {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          background: transparent;
          color: var(--color-black);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .react-calendar__tile:hover:not(.react-calendar__tile--active):not(:disabled) {
          background: var(--color-gray-20);
        }

        .react-calendar__tile--active {
          width: 3.375rem !important;
          height: 3.375rem !important;
          background: var(--color-mint-1) !important;
          color: white !important;
     
        }

        .react-calendar__tile--active:hover {
          background: var(--color-mint-0) !important;
        }

        .react-calendar__tile--now:not(.react-calendar__tile--active) {
          /* 오늘 날짜 스타일 제거 */
        }

        .react-calendar__tile:disabled {
          color: var(--color-gray-40);
          cursor: not-allowed;
        }

        /* 현재 달 일요일 / 토요일 */
        .react-calendar__month-view__days > button:nth-child(7n+1):not(.react-calendar__month-view__days__day--neighboringMonth):not(.react-calendar__tile--active) {
          color: rgba(255, 68, 68, 1);
        }

        .react-calendar__month-view__days > button:nth-child(7n):not(.react-calendar__month-view__days__day--neighboringMonth):not(.react-calendar__tile--active) {
          color: rgba(80, 92, 255, 1);
        }

        /* 이전/다음 달 평일 */
        .react-calendar__month-view__days__day--neighboringMonth {
          color: var(--color-gray-50);
        }

        /* 이전/다음 달 일요일 */
        .react-calendar__month-view__days
          > button:nth-child(7n+1).react-calendar__month-view__days__day--neighboringMonth {
          color: rgba(255, 172, 172, 1);
        }

        /* 이전/다음 달 토요일 */
        .react-calendar__month-view__days
          > button:nth-child(7n).react-calendar__month-view__days__day--neighboringMonth {
          color: rgba(148, 155, 255, 1);
        }
      `}</style>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute w-6 h-6 flex items-center justify-center hover:bg-[var(--color-gray-20)] rounded z-10"
          style={{
            top: '1.5rem',
            height: '2rem',
            right: '1.5rem',
            marginRight: '1rem',
          }}
        >
          <X className="w-4 h-4 text-[var(--color-black)]" />
        </button>
      )}

      <CalendarLib
        value={selectedDate}
        onChange={handleSelect}
        locale="ko-KR"
        calendarType="gregory"
        view="month"
        onViewChange={() => {}}
        formatMonthYear={(_, date) =>
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`
        }
        formatDay={(_, date) => date.getDate().toString()}
        prevLabel={<ChevronLeft className="w-4 h-4" />}
        nextLabel={<ChevronRight className="w-4 h-4" />}
        prev2Label={null}
        next2Label={null}
        tileDisabled={disabled ? () => true : undefined}
      />
    </div>
  );
};

export default Calendar;
