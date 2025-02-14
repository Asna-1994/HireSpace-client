export function getCompanyInitials(name: string) {
  if (!name) return 'NA';
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else {
    return name.slice(0, 2).toUpperCase();
  }
}

export const generateRoomId = (
  senderId: string,
  receiverId: string
): string => {
  return [senderId, receiverId].sort().join('_');
};


export const truncateMessage = (message: string, wordLimit: number) => {
  const words = message.split(' ');
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : message;
};
