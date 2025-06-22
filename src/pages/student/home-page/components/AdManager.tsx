import React from 'react';
import { useAdManager } from '../hooks/useAdManager';
import { getAdConfigs } from '../services/home-page.service';
import { AdMarquee } from './AdMarquee';
import AdModal from './AdModal';
import { 
  topMarqueeTexts, 
  bottomMarqueeTexts, 
  marqueeStyles, 
  popupAdConfig,
  AdTextConfig 
} from '../data/adTexts';

const AdManager: React.FC = () => {
  const adConfigs = getAdConfigs();
  const adManager = useAdManager(adConfigs);

  // 通用點擊事件處理函數
  const handleAdTextClick = (config: AdTextConfig) => {
    switch (config.action) {
      case 'scroll':
        if (config.elementId) {
          const element = document.getElementById(config.elementId) || 
                         document.querySelector(`.${config.elementId}`);
          element?.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case 'navigate':
        if (config.target) {
          window.open(config.target, "_blank");
        }
        break;
      case 'external':
        if (config.target) {
          window.open(config.target, "_blank");
        }
        break;
      default:
        // 預設行為：無操作
    }
  };

  // 頂部跑馬燈點擊事件處理
  const handleTopMarqueeClick = (_text: string, index: number) => {
    const config = topMarqueeTexts[index];
    if (config) {
      handleAdTextClick(config);
    }
  };

  // 底部跑馬燈點擊事件處理
  const handleBottomMarqueeClick = (_text: string, index: number) => {
    const config = bottomMarqueeTexts[index];
    if (config) {
      handleAdTextClick(config);
    }
  };

  return (
    <>
      {/* 頂部跑馬燈 */}
      {adManager.isVisible("topMarquee") && (
        <AdMarquee
          adTexts={topMarqueeTexts.map(item => item.text)}
          position="top"
          scrollSpeed={marqueeStyles.top.scrollSpeed}
          textInterval={marqueeStyles.top.textInterval}
          backgroundColor={marqueeStyles.top.backgroundColor}
          textColor={marqueeStyles.top.textColor}
          height={marqueeStyles.top.height}
          onClick={handleTopMarqueeClick}
          onClose={() => adManager.closeAd("topMarquee")}
          storageKey={marqueeStyles.top.storageKey}
        />
      )}

      {/* 促銷彈窗 */}
      {adManager.isVisible("popupAd") && (
        <AdModal
          title={popupAdConfig.title}
          message={popupAdConfig.message}
          buttonText={popupAdConfig.buttonText}
          onClose={() => adManager.closeAd("popupAd")}
          onAction={() => {
            window.open(popupAdConfig.target, '_blank');
            adManager.closeAd("popupAd");
          }}
        >
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="space-y-2 text-sm">
              {popupAdConfig.details.map((detail, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </AdModal>
      )}

      {/* 底部跑馬燈 */}
      {adManager.isVisible("bottomMarquee") && (
        <AdMarquee
          adTexts={bottomMarqueeTexts.map(item => item.text)}
          position="bottom"
          scrollSpeed={marqueeStyles.bottom.scrollSpeed}
          textInterval={marqueeStyles.bottom.textInterval}
          backgroundColor={marqueeStyles.bottom.backgroundColor}
          textColor={marqueeStyles.bottom.textColor}
          height={marqueeStyles.bottom.height}
          onClick={handleBottomMarqueeClick}
          onClose={() => adManager.closeAd("bottomMarquee")}
          storageKey={marqueeStyles.bottom.storageKey}
        />
      )}
    </>
  );
};

export default AdManager;