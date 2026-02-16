// 숫자만 필터링 후 콤마 적용
export const formatCurrencyInput = (value: string) => {
  // 숫자만 추출
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  // 콤마 추가
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 콤마 제거하고 숫자 반환
export const parseCurrency = (value: string) => {
  return Number(value.replace(/,/g, '')) || 0;
};
