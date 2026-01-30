import React from 'react';

interface ProgressIndicatorProps {
  /** 전체 단계 수 */
  totalSteps: number;
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 단계 간 연결 막대 너비 */
  barWidth?: string;
  /** 왼쪽 바 너비 (첫 번째 단계 앞) */
  leftBarWidth?: string;
  /** 오른쪽 바 너비 (마지막 단계 뒤) */
  rightBarWidth?: string;
  /** 커스텀 클래스명 */
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  barWidth = 'w-[3.21875rem]',
  leftBarWidth = 'w-[3.21875rem]',
  rightBarWidth = 'w-[3.21875rem]',
  className = '',
}) => {
  const isStepActive = (step: number) => currentStep >= step;
  const isStepCompleted = (step: number) => currentStep > step;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center">
        {/* 첫 번째 단계 왼쪽 바 */}
        <div
          className={`h-[0.25rem] ${leftBarWidth} ${
            isStepActive(1)
              ? 'bg-[var(--color-mint-0)]'
              : 'bg-[var(--color-gray-30)]'
          }`}
        />

        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = isStepActive(step);
          const isLast = step === totalSteps;

          return (
            <div key={step} className="flex items-center">
              {/* 원형 숫자 */}
              <div
                className={`w-[2.25rem] h-[2.25rem] rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-[var(--color-mint-0)]'
                    : 'bg-[var(--color-gray-30)]'
                }`}
              >
                <span className="heading-h5-sb text-white">{step}</span>
              </div>

              {/* 연결 막대 (마지막 단계가 아닐 때만 표시) */}
              {!isLast && (
                <div
                  className={`h-[0.25rem]  ${barWidth} ${
                    isStepCompleted(step)
                      ? 'bg-[var(--color-mint-0)]'
                      : 'bg-[var(--color-gray-30)]'
                  }`}
                />
              )}
            </div>
          );
        })}

        {/* 마지막 단계 오른쪽 바 - 항상 회색 */}
        <div
          className={`h-[0.25rem] ${rightBarWidth} bg-[var(--color-gray-30)]`}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
