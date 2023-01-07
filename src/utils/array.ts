export const createArrayLength = (length: number) => {
  return Array.from(Array(Math.ceil(length)).keys());
};

export const range = (length: number, from = 1) => {
  return Array.from({ length }, (_, i) => i + from);
};
