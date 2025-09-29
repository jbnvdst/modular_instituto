/**
 * Utility function to handle image URLs correctly
 * @param {string} imageUrl - The image URL (can be relative or absolute)
 * @returns {string} - The properly formatted URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If the URL is already complete (starts with http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // For relative URLs, prepend the API base URL
  return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
};

/**
 * Get profile picture URL from token
 * @returns {string|null} - The profile picture URL or null
 */
export const getProfilePictureFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return getImageUrl(payload.profilePicture);
  } catch {
    return null;
  }
};