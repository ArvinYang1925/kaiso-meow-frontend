// 跑馬燈廣告文字配置
export interface AdTextConfig {
  text: string;
  action?: "scroll" | "navigate" | "external";
  target?: string;
  elementId?: string;
}

// 頂部跑馬燈廣告文字
export const topMarqueeTexts: AdTextConfig[] = [
  {
    text: "🎉 年中大促銷！全站課程最低6折起，限時7/14活動當天搶購中！",
  },
  {
    text: "💎 新會員專享：註冊立即獲得100元課程購買金！",
  },
  {
    text: "🚀 最新課程上線：React 前端開發實戰班現正招生中！",
  },
];

// 底部跑馬燈廣告文字
export const bottomMarqueeTexts: AdTextConfig[] = [
  // {
  //   text: "📱 下載專屬 APP 享有獨家課程優惠券",
  //   action: 'external',
  //   target: '/app-download'
  // },
  {
    text: "🔔 訂閱電子報獲得第一手課程資訊與優惠通知",
  },
];

// 跑馬燈樣式配置
export const marqueeStyles = {
  top: {
    scrollSpeed: 25,
    textInterval: 3000,
    backgroundColor:
      "linear-gradient(90deg, #7C3AED 0%, #8B5CF6 20%, #A855F7 40%, #EC4899 60%, #F97316 80%, #EA580C 100%)",
    textColor: "#ffffff",
    height: 45,
    storageKey: "homeMarqueeAdClosed",
  },
  bottom: {
    scrollSpeed: 20,
    textInterval: 5000,
    backgroundColor: "#2c3e50",
    textColor: "#ecf0f1",
    height: 35,
    storageKey: "bottomMarqueeAdClosed",
  },
};

// 彈窗廣告配置
export const popupAdConfig = {
  title: "程式喵 714 開課祭優惠",
  message: "把握機會！限時優惠活動進行中",
  buttonText: "立即了解",
  target: "/courses",
  details: [
    "全站課程最低6折",
    "輸入優惠碼：MEOW714 再享10%折扣",
    "活動時間：7/14整天 00:00 ~ 23:59",
  ],
};
