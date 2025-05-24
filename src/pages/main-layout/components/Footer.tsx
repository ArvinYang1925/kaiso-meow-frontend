import kaiso_logo from "@/assets/homepage/kaiso_logo.svg";
import LOGO from "@/components/common/LOGO";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 w-full">
      <div className="container mx-auto">
        {/* 桌機版 */}
        <div className="hidden md:flex flex-col w-full">
          {/* 第一層 */}
          <div className="flex flex-row justify-between items-center h-[136px]">
            <div className="flex items-center">
              <LOGO />
              <a
                href="/faq"
                className="ml-12 text-slate-600 hover:text-orange-600 font-medium"
              >
                常見問題
              </a>
              <a
                href="/contact"
                className="ml-12 text-slate-600 hover:text-orange-600 font-medium"
              >
                聯絡我們
              </a>
            </div>
            <div className="text-right text-slate-500 text-base font-normal">
              © 2025 程式喵學院 All rights reserved
            </div>
          </div>
          {/* 分隔線 */}
          <hr className="border-t border-slate-200" />
          {/* 第二層 */}
          <div className="flex flex-col items-center justify-center h-[116px]">
            <span className="text-slate-500 text-base font-normal flex items-center">
              Powered By Kaiso
              <img src={kaiso_logo} alt="Kaiso" className="h-6 ml-2" />
            </span>
          </div>
        </div>
        {/* 手機版 */}
        <div className="flex flex-col md:hidden w-full">
          {/* 第一層 */}
          <div className="flex flex-col items-center justify-center mt-12 mb-8">
            <LOGO />
            <div className="flex items-center space-x-12 mt-4">
              <a
                href="/faq"
                className="text-slate-600 hover:text-orange-600 font-medium"
              >
                常見問題
              </a>
              <a
                href="/contact"
                className="text-slate-600 hover:text-orange-600 font-medium"
              >
                聯絡我們
              </a>
            </div>
          </div>
          {/* 分隔線 */}
          <hr className="border-t border-gray-200 w-screen relative left-1/2 right-1/2 -translate-x-1/2 md:w-auto md:relative md:left-0 md:right-0 md:translate-x-0" />
          {/* 第二層 */}
          <div className="flex flex-col items-center justify-center my-8">
            <span className="text-slate-500 text-base font-normal  mb-4">
              © 2025 程式喵學院 All rights reserved
            </span>
            <span className="text-slate-500 text-base font-normal flex items-center">
              Powered By Kaiso
              <img src={kaiso_logo} alt="Kaiso" className="h-6 ml-2" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
