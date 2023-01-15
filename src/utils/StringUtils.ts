export const removeSpaces = (string: string) => {
  return string.replace(/[- ]+/g, "-");
};

export const removeSpecialChars = (string: string) => {
  return string.replace(/[^\w\s.-]/gi, "_");
};
