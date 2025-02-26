/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string; // Thêm tất cả biến môi trường bạn dùng
    // Thêm các biến khác nếu cần
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  