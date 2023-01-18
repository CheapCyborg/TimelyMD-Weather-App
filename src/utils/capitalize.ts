export const capitalize = (str: string) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};
