const formatPhoneNumber = (value: string): string => {
  const numbersOnly = value.replace(/\D/g, '');

  if (numbersOnly.length <= 3) return numbersOnly;
  if (numbersOnly.length <= 7) {
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
  }

  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
};

export default formatPhoneNumber;
