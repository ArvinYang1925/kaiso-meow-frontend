import React from 'react';
import coupon_0714 from "@/assets/homepage/coupon_0714.png";

interface AdBannerProps {
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  onAction?: () => void;
  className?: string;
  useImageDisplay?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({
  title,
  message,
  buttonText = '了解更多',
  onClose,
  onAction,
  className = '',
  useImageDisplay = true
}) => {
  const getBannerStyles = () => {
    if (className.includes('promotion')) {
      return 'bg-gradient-to-br from-pink-400 to-red-500';
    }
    if (className.includes('dev-notice')) {
      return 'bg-gradient-to-br from-blue-400 to-cyan-400';
    }
    return 'bg-gradient-to-br from-indigo-500 to-purple-600';
  };

  if (useImageDisplay) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="max-w-6xl mx-auto relative">
          <div className="relative">
            <img 
              src={coupon_0714} 
              alt={title}
              className="w-full h-auto object-cover max-h-32 md:max-h-40"
            />
            
            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-2">
              {onAction && (
                <button 
                  className="bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={onAction}
                >
                  {buttonText}
                </button>
              )}
              <button 
                className="bg-white/90 hover:bg-white text-gray-800 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={onClose}
                aria-label="關閉廣告"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 text-white p-4 shadow-lg ${getBannerStyles()}`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {onAction && (
            <button 
              className="bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              onClick={onAction}
            >
              {buttonText}
            </button>
          )}
          <button 
            className="hover:opacity-100 opacity-80 text-xl p-1 transition-opacity duration-200"
            onClick={onClose}
            aria-label="關閉廣告"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;