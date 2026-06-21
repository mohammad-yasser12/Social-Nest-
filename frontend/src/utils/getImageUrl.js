const BASE_URL = "https://social-nest-1-flyx.onrender.com";

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};