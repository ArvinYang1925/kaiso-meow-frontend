import React, { useRef, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

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

/**
 * Enhanced Rich Text Editor 組件
 * 基於 ReactQuill 的富文本編輯器，支持還原與重作功能和豐富的格式選項
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "請輸入內容...",
  minHeight = 200,
  maxHeight = 400,
  id,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const handleChange = (content: string) => {
    // 如果內容為空，傳遞空字串
    if (content === "<p><br></p>") {
      onChange("");
      return;
    }
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
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
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
        value={value}
        onChange={(content) => {
          handleChange(content);
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
