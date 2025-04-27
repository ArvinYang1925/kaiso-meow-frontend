/src
 └── components
      ├── ui/         ← 放「直接從 shadcn」來的基礎組件 (按鈕、輸入框、彈窗等)
      │    ├── button.tsx
      │    ├── input.tsx
      │    ├── dialog.tsx
      │    └── ...
      │
      ├── common/     ← 較通用、自己包過的組件 (比如 CustomizedButton, FormFieldGroup 等)
      │    ├── CustomizedButton.tsx
      │    ├── FormFieldGroup.tsx
      │    └── ...
      │
      ├── layout/     ← 跟排版或版面有關的 (Header, Footer, Sidebar)
      │    ├── Header.tsx
      │    ├── Footer.tsx
      │    └── Sidebar.tsx
      │
      ├── features/   ← 專案功能相關的組件（分功能域，例如 Blog、User、Dashboard）
      │    ├── blog/
      │    │    ├── BlogCard.tsx
      │    │    └── BlogList.tsx
      │    ├── user/
      │    │    ├── UserProfile.tsx
      │    │    └── UserSettingsForm.tsx
      │    └── dashboard/
      │         ├── DashboardWidget.tsx
      │         └── DashboardChart.tsx
      │
      └── dialogs/    ← 跳窗相關 (彈出式 Dialogs/Modals 統一管理)
           ├── ConfirmDeleteDialog.tsx
           ├── EditUserDialog.tsx
           └── ...

📌 說明
ui/
直接從 shadcn copy 過來的原生組件，不做大改，只做小幅自訂。以官方設計為主，像 Button、Input、Popover 等。

common/
如果有些 shadcn 的基礎組件你常常需要加一點通用樣式（比如一個 always uppercase 的 CustomizedButton），可以包起來放這裡。

layout/
這邊放整頁結構有關的元件，比如 Header、Footer、Sidebar、Breadcrumbs。

features/
跟你的實際業務邏輯有關的組件，每個 feature（Blog、User、Admin Panel 等）一個資料夾，保持清楚。

dialogs/
很多時候 Dialog 會有自己的 form 或自己的流程，單獨拉一層會比較好找。

🛠 補充小技巧
ui/底下可以再分大分類：如果 Button 很多種型態，可以放 /ui/button/PrimaryButton.tsx、SecondaryButton.tsx。

shadcn 更新時更好同步：因為 ui/ 和 common/分開，所以萬一 shadcn 更新 Button，你只需要動 ui/ 的，不會誤動你自己包過的。

型別 (types) 分開管理：如果每個組件型別多，可以放 Button.types.ts 或統一 /types/ 資料夾。

hooks、utils 可再拉獨立資料夾，不要塞到 components。