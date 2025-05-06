// place files you want to import through the `$lib` alias in this folder.

// Format a date string to a more readable format
export function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

// Truncate text with ellipsis if it's longer than maxLength
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
