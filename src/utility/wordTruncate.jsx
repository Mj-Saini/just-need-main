export const truncateText = (text = "", wordLimit = 20) => {
  if (!text) return "";
  const words = text.split("");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join("") + "..."
    : text;
};
