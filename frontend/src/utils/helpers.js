// Example: Format date
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Example: Limit string length (for post previews)
  export const truncateText = (text, limit = 150) => {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };
  