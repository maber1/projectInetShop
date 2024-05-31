export const priceFormat = (number: number | string, thousandsSeparator = ' ') => {
  if (!number) return;

  number = number.toString().replace(/\D/g, '');

  return number.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
};

export const truncateText = (text: string, maxLength = 100): string => {
  if (!text) return;

  if (text.length <= maxLength) {
    return text;
  } else {
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, Math.min(truncated.length, truncated.lastIndexOf(' '))) + '...';
  }
};
