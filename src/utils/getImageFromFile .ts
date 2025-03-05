export const getImageFromFile = (file: File): string => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File không phải là hình ảnh");
    }
    return URL.createObjectURL(file);
  };
  