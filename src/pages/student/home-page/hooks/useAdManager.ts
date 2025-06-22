import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface AdConfig {
  id: string;
  storageKey: string;
  onlyHomePage?: boolean;
  showDelay?: number;
  priority?: number; // 廣告優先順序，數字越小優先級越高
}

interface AdState {
  id: string;
  isVisible: boolean;
  hasBeenShown: boolean;
  hasBeenClosed: boolean;
}

export const useAdManager = (adConfigs: AdConfig[]) => {
  const location = useLocation();
  const [adStates, setAdStates] = useState<Record<string, AdState>>({});

  // 初始化廣告狀態
  useEffect(() => {
    const initialStates: Record<string, AdState> = {};
    
    adConfigs.forEach(config => {
      const hasBeenClosed = sessionStorage.getItem(config.storageKey) === 'true';
      initialStates[config.id] = {
        id: config.id,
        isVisible: false,
        hasBeenShown: false,
        hasBeenClosed
      };
    });
    
    setAdStates(initialStates);

    // 設定廣告顯示計時器
    const timers: NodeJS.Timeout[] = [];
    const sortedConfigs = [...adConfigs].sort((a, b) => 
      (a.priority || 0) - (b.priority || 0)
    );

    sortedConfigs.forEach(config => {
      const hasBeenClosed = sessionStorage.getItem(config.storageKey) === 'true';
      const shouldShow = !hasBeenClosed && (config.onlyHomePage ? location.pathname === '/' : true);
      
      if (shouldShow) {
        const timer = setTimeout(() => {
          setAdStates(prev => ({
            ...prev,
            [config.id]: {
              id: config.id,
              isVisible: true,
              hasBeenShown: true,
              hasBeenClosed: false
            }
          }));
        }, config.showDelay || 1000);
        
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []); // 只在組件掛載時執行一次

  // 顯示廣告
  const showAd = useCallback((adId: string) => {
    setAdStates(prev => ({
      ...prev,
      [adId]: {
        ...prev[adId],
        isVisible: true,
        hasBeenShown: true
      }
    }));
  }, []);

  // 關閉廣告
  const closeAd = useCallback((adId: string) => {
    const config = adConfigs.find((c: AdConfig) => c.id === adId);
    if (!config) return;

    setAdStates(prev => ({
      ...prev,
      [adId]: {
        ...prev[adId],
        isVisible: false,
        hasBeenClosed: true
      }
    }));
    
    sessionStorage.setItem(config.storageKey, 'true');
  }, [adConfigs]);

  // 獲取廣告狀態
  const getAdState = useCallback((adId: string) => {
    return adStates[adId] || {
      id: adId,
      isVisible: false,
      hasBeenShown: false,
      hasBeenClosed: false
    };
  }, [adStates]);

  // 檢查是否有任何廣告正在顯示
  const hasActiveAds = Object.values(adStates).some(state => state.isVisible);

  return {
    adStates,
    showAd,
    closeAd,
    getAdState,
    hasActiveAds,
    isVisible: (adId: string) => getAdState(adId).isVisible
  };
}; 