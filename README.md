# kaiso-meow-frontend

> 影音課程販售平台前端專案

**影音課程販售平台 – 前端應用**  
提供現代化、響應式的使用者介面。
支援課程內容瀏覽、影片播放、串接金流支付與個人資料管理等功能。

---

## 🚀 線上服務

| 環境       | URL        |
| ---------- | ---------- |
| Production | `<待補充>` |
| Staging    | `<待補充>` |

---

## ✨ 特色

- React 18 + TypeScript
- Vite 6 建構工具
- Tailwind CSS + Radix UI 元件庫
- Zustand 狀態管理
- React Router v6 路由管理
- Zod 表單驗證
- Video.js 影片播放器
- React Quill 富文本編輯器
- Framer Motion 動畫效果
- ESLint + TypeScript 程式碼品質控制

---

## 🏗️ 專案結構

```text
src/
├── app/          # 應用程式核心設定
├── assets/       # 靜態資源
├── components/   # 共用元件
├── hooks/        # 自定義 React Hooks
├── lib/          # 工具函式與設定
├── pages/        # 頁面元件
├── services/     # API 服務
├── stores/       # Zustand 狀態管理
├── styles/       # 全域樣式
└── types/        # TypeScript 型別定義
```

---

## 🛠️ 開發環境需求

- Node.js 20.x
- npm 或 yarn

---

## 🚀 快速開始

1. 安裝依賴

```bash
npm install
```

2. 啟動開發伺服器

```bash
npm run dev
```

3. 建置生產版本

```bash
npm run build
```

4. 預覽生產版本

```bash
npm run preview
```

---

## 📝 可用指令

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run preview` - 預覽生產版本
- `npm run lint` - 執行 ESLint 檢查
- `npm run compress:images` - 壓縮圖片資源

---

## 🎨 技術棧

- **前端框架**: React 18
- **建構工具**: Vite 6
- **程式語言**: TypeScript
- **樣式解決方案**:
  - Tailwind CSS
  - SASS
  - Radix UI
  - Swiper
- **狀態管理**: Zustand
- **路由**: React Router v6
- **表單處理**:
  - React Hook Form
  - Zod
- **UI 元件**:
  - Radix UI
  - Lucide React Icons
- **動畫**: Framer Motion
- **影片播放**: Video.js
- **圖表**: Recharts
- **富文本編輯**: React Quill
- **拖曳排序**: SortableJS
- **圖片上傳**: react-dropzone

---

## 🔧 環境變數

建立 `.env` 檔案並設定以下變數：

```env
VITE_API_BASE_URL=<API 基礎 URL>
```

---

## 📦 部署

專案使用 Vite 建構，可部署至任何靜態網站託管服務：

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

---

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 👨‍💻 貢獻者與工作分配

本專案由以下四位前端開發人員共同完成：

### 貢獻者 Karen

- 負責範圍：

  - `環境建置`
  - `圖片壓縮、PR模板置`
  - `全站訊息提示視窗`
  - `學生前台`
    - 學生\_登入登出
    - 首頁、會員資料群組、課程購買群組
  - `後台頁面`
    - 講師\_登入登出
    - 折扣碼群組、訂單管理群組、課程管理群組

- 主要開發頁面及 API 串接：

  - `學生前台`
    - 首頁: 頁首、強打課程區域、訂閱電子報
    - 忘記密碼&重設定
    - 個人資料
    - 購買紀錄
    - 課程瀏覽與學習(課程詳細資訊)
    - 課程訂單預覽、建立、顯示、折扣碼驗證、結帳、綠界付款完成
  - `講師後台`
    - 側邊 Sidebar
    - 章節管理(創建、查詢、更新章節內容、發布/取消發布章節、刪除章節)
    - AI 章節管理
    - 訂單管理
    - 學生列表
    - 折扣碼列表

- 手機版 RWD：
  - `全站訊息提示`
  - `學生前台:`
    - 首頁: 頁首、優化頁尾
    - 首頁: 強打課程區域、訂閱電子報
    - 購買課程頁面、課程詳細頁、個人資料頁面、訂單購買頁、checkout 那一頁按鈕的 RWD
- GitHub: [Karen 的 GitHub](https://github.com/CodingSnorlax)

### 貢獻者 Him

- 負責範圍：
  - `學生前台`
    - 首頁、課程播放群組
- 主要開發頁面及 API 串接：
  - `學生前台`
    - 首頁: 專家推薦
    - 我的學習(學習中心)
    - 我的學習\_學習清單、學習進度、章節進度、課程播放
- 手機版 RWD：
  - `學生前台:` 我的學習、課程影片播放頁面
- GitHub: [Him 的 GitHub](https://github.com/shchiu810)

### 貢獻者 鬧鬧

- 負責範圍：
  - `全螢幕 Loading`
  - `學生前台`
    - 首頁、TOP 元件
  - `講師後台`
    - 講師登入與銷售報表群組、課程管理群組
- 主要開發頁面及 API 串接：
  - `學生前台`
    - 首頁:頁尾、Banner、燈箱廣告、跑馬燈廣告、講師介紹、學員推薦
    - 課程列表
  - `講師後台`
    - 麵包屑
    - 側邊 Sidebar 樣式優化、路由調整
    - 課程管理(創建、獲取課程列表、獲取課程詳細資訊、更新課程資訊、發佈/下架、刪除課程)
    - 講師個人資料(姓名更新、上傳大頭照、更新密碼)
    - 數據儀表板
    - AI 折扣碼管理
- 手機版 RWD：
  - `學生前台:`
    - 首頁: 頁尾、優化頁首
    - 首頁: 講師介紹區塊、學員推薦區塊
    - 課程瀏覽與學習(課程列表)、購買紀錄
  - `講師後台:` 後台全站 RWD
- GitHub: [鬧鬧 的 GitHub](https://github.com/Abicat)

### 貢獻者 Janet

- 負責範圍：
  - `學生前台`
    - 訂單支付
  - `圖片壓縮、PR模板置`
- 主要開發頁面：
  - `學生前台`
    - 綠界回傳頁面、課程詳細資訊編輯器回傳樣式調整
- GitHub: [Janet 的 GitHub](https://github.com/CHING-WENLAI1031)

---

## 📄 授權

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

```

```
