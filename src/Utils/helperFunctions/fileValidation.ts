export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxFileSize: number
): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`;
  }

  if (file.size > maxFileSize) {
    return `File size exceeds the ${(maxFileSize / (1024 * 1024)).toFixed(2)}MB limit.`;
  }

  return null; // File is valid
};
