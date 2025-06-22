import React from 'react';
import coupon_0714 from "@/assets/homepage/coupon_0714.png";

interface AdModalProps {
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  onAction?: () => void;
  children?: React.ReactNode;
  useImageDisplay?: boolean;
}

const AdModal: React.FC<AdModalProps> = ({
  title,
  message,
  buttonText = '確定',
  onClose,
  onAction,
  children,
  useImageDisplay = true
}) => {
  if (useImageDisplay) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <img 
              src={coupon_0714} 
              alt={title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            
            <button 
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={onClose}
              aria-label="關閉"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 text-2xl p-1 transition-colors duration-200"
            onClick={onClose}
            aria-label="關閉"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
          {children}
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          {onAction && (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={onAction}
            >
              {buttonText}
            </button>
          )}
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdModal;