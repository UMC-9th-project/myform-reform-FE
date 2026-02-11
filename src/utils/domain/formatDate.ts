// 날짜 포맷 함수
export const formatDateToKorean = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작
  const day = date.getDate();

  return `${year}년 ${month.toString().padStart(2, '0')}월 ${day.toString().padStart(2, '0')}일`;
};
