export const BASE_URL = "https://event.udn.com/bd_petsqa_2025";

const CONFIG = {
  usePGW: true,
};

export const pgwWrap = (path) => {
  if (CONFIG.usePGW) {
    return `https://pgw.udn.com.tw/gw/photo.php?u=${BASE_URL}${path}&nt=1&v=20250103`;
  } else {
    return `${BASE_URL}${path}`;
  }
};

// 便利函數，自動處理 /imgs/ 路徑
export const usePgwImage = (imageName) => {
  return pgwWrap(`/imgs/${imageName}`);
};
