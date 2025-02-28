export function convertRFC1123(
    dateString: string,
    format: 'ISO' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' | 'timestamp' = 'YYYY-MM-DD HH:mm:ss',
    locale: string = 'vi-VN'
  ): string | number | null {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Kiểm tra nếu chuỗi không hợp lệ
  
    switch (format) {
      case 'ISO':
        return date.toISOString(); // Chuẩn ISO 8601
      case 'YYYY-MM-DD':
        return date.toISOString().split('T')[0]; // Chỉ lấy ngày
      case 'YYYY-MM-DD HH:mm:ss':
        return date.toLocaleString(locale, { 
          year: 'numeric', month: '2-digit', day: '2-digit', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }).replace(',', ''); // Chuyển về múi giờ local
      case 'timestamp':
        return date.getTime(); // Trả về timestamp (ms)
      default:
        return date.toLocaleString(); // Mặc định: chuỗi theo múi giờ local
    }
  }