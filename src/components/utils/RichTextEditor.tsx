import React, { useRef, useMemo, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useToast } from "@/hooks/use-toast";

// 編輯器類型定義
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  id?: string;
  className?: string;
  maxImageSize?: number; // 圖片最大大小（MB），預設 2MB
  maxContentSize?: number; // 內容最大大小（GB），預設 1GB
}

// 設定 undo/redo 圖示
const icons = Quill.import("ui/icons") as Record<string, string>;
icons["undo"] = `<svg viewbox="0 0 18 18">
  <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
  <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
</svg>`;
icons["redo"] = `<svg viewbox="0 0 18 18">
  <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
  <path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path>
</svg>`;

// 工具函數：計算內容大小（bytes）
const getContentSize = (content: string): number => {
  return new Blob([content]).size;
};

// 工具函數：格式化檔案大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 工具函數：將檔案轉換為 base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 工具函數：檢查內容是否為空
const isContentEmpty = (content: string): boolean => {
  if (!content) return true;

  // 檢查是否包含圖片
  if (content.includes("<img")) return false;

  // 移除 HTML 標籤並檢查是否有實際文字內容
  const textContent = content.replace(/<[^>]*>/g, "").trim();
  return textContent.length === 0;
};

/**
 * Enhanced Rich Text Editor 組件
 * 基於 ReactQuill 的富文本編輯器，支持還原與重作功能和豐富的格式選項
 * 包含檔案大小限制功能
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "請輸入內容...",
  minHeight = 200,
  maxHeight = 400,
  id,
  maxImageSize = 0.05, // 預設 50KB
  maxContentSize = 1, // 預設 1GB
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  // 檢查內容總大小
  const checkContentSize = useCallback(
    (content: string): void => {
      const contentSizeBytes = getContentSize(content);
      const maxContentSizeBytes = maxContentSize * 1024 * 1024 * 1024; // GB 轉 bytes

      if (contentSizeBytes > maxContentSizeBytes) {
        toast({
          title: "內容大小超出限制",
          description: `內容大小 ${formatFileSize(
            contentSizeBytes
          )} 超過限制 ${maxContentSize}GB，請減少內容或圖片數量。`,
          variant: "destructive",
        });
      }
    },
    [maxContentSize, toast]
  );

  // 自定義圖片處理器
  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // 檢查檔案大小
      const fileSizeBytes = file.size;
      const maxImageSizeBytes = maxImageSize * 1024 * 1024; // MB 轉 bytes

      if (fileSizeBytes > maxImageSizeBytes) {
        toast({
          title: "圖片大小超出限制",
          description: `圖片大小 ${formatFileSize(
            fileSizeBytes
          )} 超過限制 ${maxImageSize}MB，請選擇較小的圖片。`,
          variant: "destructive",
        });
        return;
      }

      try {
        // 將圖片轉換為 base64
        const base64 = await fileToBase64(file);

        // 獲取編輯器實例並插入圖片
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection();
          const index = range ? range.index : editor.getLength();
          editor.insertEmbed(index, "image", base64);
          editor.setSelection(index + 1, 0);
        }
      } catch {
        toast({
          title: "圖片上傳失敗",
          description: "圖片處理時發生錯誤，請重試。",
          variant: "destructive",
        });
      }
    };
  }, [maxImageSize, toast]);

  const handleChange = (content: string) => {
    // 如果內容為空的 HTML，傳遞空字串
    if (content === "<p><br></p>" || isContentEmpty(content)) {
      onChange("");
      return;
    }

    // 檢查內容大小（checkContentSize 內部會處理 toast 提示）
    checkContentSize(content);

    // 無論內容大小如何，都更新內容，讓用戶能夠編輯
    onChange(content);
  };

  const modules = useMemo(
    () => ({
      history: {
        delay: 200,
        maxStack: 500,
        userOnly: true,
      },
      toolbar: {
        container: [
          ["undo", "redo"],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "underline", "strike", "blockquote"],
          [{ align: ["", "center", "right", "justify"] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          [{ color: [] }],
          [{ background: [] }],
          ["clean"],
        ],
        handlers: {
          undo: () => {
            const editor = quillRef.current?.getEditor();
            editor?.history?.undo();
          },
          redo: () => {
            const editor = quillRef.current?.getEditor();
            editor?.history?.redo();
          },
          image: imageHandler, // 自定義圖片處理器
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "background",
    "align",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        id={id}
        value={value || ""}
        onChange={(content) => {
          try {
            handleChange(content);
          } catch (error) {
            console.error("RichTextEditor handleChange error:", error);
            // 如果發生錯誤，仍然嘗試更新內容
            onChange(content);
          }
        }}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder={placeholder}
        style={
          {
            "--editor-min-height": `${minHeight}px`,
            "--editor-max-height": `${maxHeight}px`,
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default React.memo(RichTextEditor);
