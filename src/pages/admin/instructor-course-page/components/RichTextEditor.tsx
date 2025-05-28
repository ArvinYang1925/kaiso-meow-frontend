import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { Card } from "@/components/ui/card";
import 'react-quill/dist/quill.snow.css';
import '@/pages/admin/instructor-course-page/components/RichTextEditor.css';

// 編輯器類型定義
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  id?: string;
  className?: string;
}

/**
 * Enhanced Rich Text Editor 組件
 * 基於 ReactQuill 的富文本編輯器，支持還原與重作功能和豐富的格式選項
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "請輸入內容...",
  minHeight = 200,
  maxHeight = 398,
  id,
  className = "",
}) => {
  // 使用 ref 來保持 Quill 編輯器實例
  const quillRef = useRef<ReactQuill>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // 定義豐富的工具欄配置
  const modules = {
    toolbar: [
      ['undo', 'redo'],                                   // 還原與重作按鈕
      [{ header: [1, 2, 3, 4, 5, 6, false] }],           // 標題格式
      ['bold', 'underline', 'strike', 'blockquote'],      // 文字樣式
      [{ align: ['', 'center', 'right', 'justify'] }],    // 對齊方式
      [{ list: 'ordered' }, { list: 'bullet' }],          // 列表類型
      ['link', 'image'],                                  // 連結和圖片
      [{ color: [] }],                                    // 文字顏色
      [{ background: [] }]                                // 背景顏色
    ],
    history: {                                            // 啟用歷史記錄模組
      delay: 1000,
      maxStack: 100,
      userOnly: true
    }
  };

  // 允許的格式定義
  const formats = [
    'header',
    'bold', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image',
    'color', 'background',
    'align'
  ];

  // 內容變更處理
  const handleChange = (content: string) => {
    onChange(content);
  };

  // 定義全局變數保存最後使用的連結
  const [lastUsedLink, setLastUsedLink] = useState<string>('');

  // 保存最後使用的連結
  const saveLastLink = (link: string) => {
    try {
      localStorage.setItem('rich_editor_last_link', link);
      setLastUsedLink(link);
      console.log('儲存連結:', link);
    } catch (err) {
      console.error('無法儲存連結:', err);
    }
  };

  // 在組件初始化時從localStorage載入上次使用的連結
  useEffect(() => {
    try {
      const savedLink = localStorage.getItem('rich_editor_last_link');
      if (savedLink) {
        setLastUsedLink(savedLink);
        console.log('初始化載入連結:', savedLink);
      }
    } catch (e) {
      console.error('無法從localStorage載入連結', e);
    }
  }, []);

  // 設置 tooltip 和事件監聽
  useEffect(() => {
    const setupTooltip = () => {
      const checkAndSetupTooltip = () => {
        const tooltip = document.querySelector('.ql-tooltip') as HTMLElement;
        if (!tooltip) {
          setTimeout(checkAndSetupTooltip, 100);
          return;
        }

        const handleTooltipChange = () => {
          if (tooltip.classList.contains('ql-editing')) {
            const previewText = tooltip.querySelector('.ql-preview');
            if (previewText) {
              previewText.textContent = '';
              (previewText as HTMLElement).style.display = 'none';
            }

            if (tooltip.parentNode !== document.body) {
              document.body.appendChild(tooltip);
            }

            const container = containerRef.current;
            const toolbar = toolbarRef.current;
            if (container && toolbar) {
              const toolbarRect = toolbar.getBoundingClientRect();
              
              // 只保留定位相關的樣式
              tooltip.style.position = 'fixed';
              tooltip.style.left = `${toolbarRect.left}px`;
              tooltip.style.top = `${toolbarRect.bottom + 5}px`;
              tooltip.style.maxWidth = `${toolbarRect.width - 20}px`;

              let label = tooltip.querySelector('.ql-tooltip-label') as HTMLElement;
              if (!label) {
                label = document.createElement('div');
                label.className = 'ql-tooltip-label';
                label.textContent = '輸入連結:';
                const input = tooltip.querySelector('input[type="text"]');
                if (input) {
                  tooltip.insertBefore(label, input);
                }
              }

              const input = tooltip.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                if (lastUsedLink && (!input.value || input.value.trim() === '')) {
                  input.value = lastUsedLink;
                  console.log('填入儲存的連結:', lastUsedLink);
                }

                setTimeout(() => {
                  input.focus();
                  if (input.value) {
                    input.selectionStart = 0;
                    input.selectionEnd = input.value.length;
                  }
                }, 10);
              }

              let btnContainer = tooltip.querySelector('.ql-tooltip-buttons') as HTMLElement;
              if (!btnContainer) {
                btnContainer = document.createElement('div');
                btnContainer.className = 'ql-tooltip-buttons';
                tooltip.appendChild(btnContainer);
              }

              const saveBtn = tooltip.querySelector('a.ql-action') as HTMLAnchorElement;
              if (saveBtn) {
                btnContainer.appendChild(saveBtn);

                if (saveBtn.textContent === "" || !saveBtn.textContent) {
                  saveBtn.textContent = '存檔';
                }

                saveBtn.onclick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();

                  const input = tooltip.querySelector('input[type="text"]') as HTMLInputElement;
                  if (input && input.value) {
                    const linkValue = input.value;
                    saveLastLink(linkValue);

                    const quill = quillRef.current?.getEditor();
                    if (quill) {
                      const range = quill.getSelection();
                      if (range) {
                        quill.format('link', linkValue);
                        tooltip.classList.remove('ql-editing');
                        tooltip.style.display = 'none';
                      }
                    }
                  }
                  return false;
                };
              }

              let cancelBtn = tooltip.querySelector('.ql-tooltip-cancel') as HTMLButtonElement;
              if (!cancelBtn) {
                cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'ql-tooltip-cancel';
                cancelBtn.textContent = '取消';
                cancelBtn.onclick = () => {
                  tooltip.classList.remove('ql-editing');
                  tooltip.style.display = 'none';
                };
                btnContainer.appendChild(cancelBtn);
              } else {
                if (cancelBtn.textContent === "" || !cancelBtn.textContent) {
                  cancelBtn.textContent = '取消';
                }

                cancelBtn.onclick = () => {
                  tooltip.classList.remove('ql-editing');
                  tooltip.style.display = 'none';
                };
              }
            }
          } else {
            tooltip.style.display = 'none';
          }
        };

        handleTooltipChange();
        const observer = new MutationObserver(handleTooltipChange);
        observer.observe(tooltip, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
      };

      checkAndSetupTooltip();
    };

    setupTooltip();

    const toolbar = toolbarRef.current;
    const linkButton = toolbar?.querySelector('.ql-link');
    if (linkButton) {
      linkButton.addEventListener('click', setupTooltip);
      return () => {
        linkButton.removeEventListener('click', setupTooltip);
      };
    }
  }, [lastUsedLink]);

  // 傳遞高度設定給CSS變數
  const containerStyle = {
    '--editor-min-height': `${minHeight}px`,
    '--editor-max-height': `${maxHeight}px`,
  } as React.CSSProperties;

  return (
    <Card className={`rich-text-editor-card border border-gray-300 ${className}`} style={containerStyle}>
      <div className="rich-text-container" ref={editorRef}>
        <div ref={containerRef} />
        <div ref={toolbarRef} />
        <ReactQuill
          ref={quillRef}
          id={id}
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder={placeholder}
        />
      </div>
    </Card>
  );
};

export default React.memo(RichTextEditor);