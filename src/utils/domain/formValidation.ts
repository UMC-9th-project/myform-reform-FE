import { z } from 'zod';

export const validateField = (
  value: string,
  schema: z.ZodString,
  setError: (error: string | null) => void,
  required = false
): boolean => {
  if (value.trim() === '') {
    if (required) {
      setError('필수 입력 항목입니다.');
      return false;
    }
    setError(null);
    return true;
  }

  const result = schema.safeParse(value);
  if (!result.success) {
    setError(result.error.errors[0].message);
    return false;
  } else {
    setError(null);
    return true;
  }
};
