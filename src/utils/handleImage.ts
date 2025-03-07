export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToBlobUrl = (base64: string): string => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"; // Lấy loại MIME
  const bstr = atob(arr[1]); // Giải mã Base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const blob = new Blob([u8arr], { type: mime });
  return URL.createObjectURL(blob);
};

export const getImageFromFile = (file: File): string => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File không phải là hình ảnh");
    }
    return URL.createObjectURL(file);
  };
