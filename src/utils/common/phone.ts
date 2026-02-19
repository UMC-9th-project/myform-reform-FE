/**
 * 전화번호를 정리하고 검증하는 유틸 함수
 */

/**
 * 전화번호에서 하이픈을 제거하고 숫자만 추출
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/-/g, '').replace(/\s/g, '');
};

/**
 * 전화번호 형식 검증 (한국 전화번호)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = cleanPhoneNumber(phone);
  // 한국 전화번호: 010으로 시작하는 11자리 또는 02, 031 등으로 시작하는 9-10자리
  const phoneRegex = /^(010|011|016|017|018|019)\d{8}$|^(02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)\d{7,8}$/;
  return phoneRegex.test(cleaned);
};

/**
 * 전화번호를 표준 형식으로 변환 (010-1234-5678)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  
  if (cleaned.length === 0) return '';
  
  // 010으로 시작하는 경우 (11자리)
  if (cleaned.startsWith('010') && cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // 011, 016, 017, 018, 019로 시작하는 경우 (11자리)
  if (cleaned.match(/^(011|016|017|018|019)/) && cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // 02로 시작하는 경우 (9-10자리)
  if (cleaned.startsWith('02')) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
  }
  
  // 기타 지역번호 (031, 032 등)로 시작하는 경우 (10-11자리)
  if (cleaned.match(/^(031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)/)) {
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
  }
  
  // 형식에 맞지 않으면 원본 반환
  return phone;
};

/**
 * 전화번호를 API에 전송하기 전에 정리하고 검증
 * @returns 정리된 전화번호 또는 null (유효하지 않은 경우)
 */
export const sanitizePhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return null;
  }
  
  const cleaned = cleanPhoneNumber(phone);
  
  // 빈 문자열이거나 숫자가 아닌 경우
  if (cleaned.length === 0 || !/^\d+$/.test(cleaned)) {
    return null;
  }
  
  // 형식 검증
  if (!validatePhoneNumber(cleaned)) {
    return null;
  }
  
  // 표준 형식으로 변환
  return formatPhoneNumber(cleaned);
};
