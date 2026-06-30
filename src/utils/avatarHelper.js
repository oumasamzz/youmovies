// utils/avatarHelper.js

// Generates a deterministic color based on the string
export const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
  ];
  return colors[Math.abs(hash) % colors.length];
};

// Gets the character to display
export const getAvatarInitials = (user) => {
  if (user.displayName) return user.displayName.charAt(0).toUpperCase();
  if (user.email) return user.email.charAt(0).toUpperCase();
  return 'U'; // Default fallback
};