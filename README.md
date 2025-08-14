# 寵物問卷調查活動 2025

## 專案簡介

「寵物問卷調查活動 2025」是聯合新聞網舉辦的互動式問卷活動，讓用戶透過填寫寵物相關問卷參與活動，並有機會獲得專屬折扣代碼及參與抽獎。

## 網站網址

- **正式環境**: [https://event.udn.com/bd_petsqa_2025/](https://event.udn.com/bd_petsqa_2025/)
- **測試環境**: [https://lab-event.udn.com/bd_petsqa_2025/](https://lab-event.udn.com/bd_petsqa_2025/)

## 技術架構

### 前端技術

- **Framework**: Nuxt.js 3
- **UI Library**: Vue 3 + Composition API
- **樣式**: SCSS (BEM 命名規範)
- **HTTP Client**: Axios
- **彈窗組件**: SweetAlert2
- **響應式設計**: 支援桌面版與行動版

### 後端技術

- **語言**: PHP 7.4+
- **資料庫**: MySQL (PDO)
- **安全驗證**: Cloudflare Turnstile
- **會員系統**: 聯合新聞網會員 API

### 安全機制

- **CSRF 防護**: 自定義 CSRF Token 驗證
- **流程安全**: 一次性安全令牌機制
- **機器人防護**: Cloudflare Turnstile 驗證
- **輸入過濾**: XSS 和 SQL Injection 防護
- **自動化檢測**: 防止機器人和腳本攻擊
- **IP 限制**: 防止短時間內重複提交

## 核心功能

### 問卷系統

- 15 題問卷調查
- 每人限填一次
- 問卷答案驗證
- 提交狀態追蹤

### 會員整合

- UDN 會員登入系統
- 會員資料驗證
- 問卷記錄追蹤
- 非正常流程檢測

### 獎勵機制

- 完成問卷獲得專屬折扣代碼
- 抽獎活動參與資格
- 獎項公佈機制

### 管理功能

- 管理員後台
- 用戶資料統計
- 資料庫管理工具
- 開發調試工具

## 安全流程

1. **流程驗證**: 用戶必須透過正確流程（點擊開始填問卷 → 登入 → 驗證 → 填寫問卷）
2. **令牌管理**:
   - 流程安全令牌（10分鐘有效期）
   - CSRF 令牌驗證
   - Turnstile 驗證令牌
3. **重複檢查**: 資料庫層級的填寫限制
4. **IP 限制**: 防止短時間內重複請求（120秒間隔）
5. **活動時間檢查**: 確保只能在活動期間內參與

## 開發環境設置

### 安裝依賴

```bash
# npm
npm install
```

### 開發伺服器

```bash
# npm
npm run dev
```

### 生產建置

```bash
# npm
npm run build
```

### 預覽生產版本

```bash
# npm
npm run preview
```

## 環境變數設置

```env
NUXT_PUBLIC_BASE_URL=你的基礎網址
NUXT_PUBLIC_DOMAIN=你的域名
NUXT_PUBLIC_BASE=基礎路徑
NUXT_PUBLIC_TURNSTILE_SITE_KEY=Cloudflare_Turnstile_網站金鑰
```

## 資料庫結構

### act2025_bd_petsqa_2025 表格

- `id`: 主鍵
- `email`: 用戶信箱
- `username`: 用戶名稱
- `ip`: 用戶 IP
- `created_at`: 創建時間
- `answer1` ~ `answer15`: 問卷答案（15題）

## API 端點

- `auth_token.php`: 生成流程安全令牌
- `saveUserData.php`: 保存問卷資料
- `checkPlayStatus.php`: 檢查問卷狀態
- `resetPet2025Database.php`: 重置資料庫（開發用）
- `checkDiscountStatus.php`: 檢查折扣狀態

## 開發工具

### 調試模式

按下 `Shift + D` 顯示開發工具面板，包含：

- 清除問卷記錄
- 重置資料庫
- 登出功能
- 資料庫狀態檢查

### 管理後台

訪問 `/admin` 頁面可查看：

- 用戶填寫統計
- 每日填寫數據
- 活動期間統計
- 用戶資料管理

## 部署說明

1. 確保 PHP 7.4+ 和 MySQL 環境
2. 配置 Cloudflare Turnstile
3. 設置正確的 CORS 域名
4. 配置 UDN 會員 API 金鑰
5. 建立資料庫表格
6. 設置適當的檔案權限
7. 配置 `.env` 環境變數

## 注意事項

- **活動期間**: 2025/08/14 10:00 ~ 2025/09/15 10:00
- **獎項公佈**: 2025/09/30 10:00
- 每人限填一次問卷
- 需要 UDN 會員帳號才能參與
- 支援桌面版和行動版瀏覽器
- 不支援 Facebook 內建瀏覽器（會提示切換）

## 瀏覽器相容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- 行動版瀏覽器

## 聯絡資訊

如有技術問題或需要支援，請聯繫開發團隊。

---

更多詳細資訊請參考 [Nuxt.js 官方文件](https://nuxt.com/docs/getting-started/introduction)
