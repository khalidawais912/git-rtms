// import CharacterCount from "@tiptap/extension-character-count";
// import Highlight from "@tiptap/extension-highlight";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import { Table } from "@tiptap/extension-table";
// import TableCell from "@tiptap/extension-table-cell";
// import TableHeader from "@tiptap/extension-table-header";
// import TableRow from "@tiptap/extension-table-row";
// import TextAlign from "@tiptap/extension-text-align";
// import Underline from "@tiptap/extension-underline";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { useCallback } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";

// const limit = 280;

// const MenuBar = ({ editor }: { editor: any }) => {
//   if (!editor) {
//     return null;
//   }

//   const addImage = useCallback(() => {
//     const url = window.prompt("URL");

//     if (url) {
//       editor
//         .chain()
//         .focus()
//         .setImage({
//           src: url,
//         })
//         .run();
//     }
//   }, [editor]);

//   return (
//     <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300">
//       <button
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         disabled={!editor.can().chain().focus().toggleBold().run()}
//         className={editor.isActive("bold") ? "is-active" : ""}
//       >
//         <span className="font-bold">B</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         disabled={!editor.can().chain().focus().toggleItalic().run()}
//         className={editor.isActive("italic") ? "is-active" : ""}
//       >
//         <span className="italic">I</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleUnderline().run()}
//         disabled={!editor.can().chain().focus().toggleUnderline().run()}
//         className={editor.isActive("underline") ? "is-active" : ""}
//       >
//         <span className="underline">U</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//         disabled={!editor.can().chain().focus().toggleStrike().run()}
//         className={editor.isActive("strike") ? "is-active" : ""}
//       >
//         <span className="line-through">S</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().setParagraph().run()}
//         className={editor.isActive("paragraph") ? "is-active" : ""}
//       >
//         <span>پيراگراف</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//         className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
//       >
//         <span>H1</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//         className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
//       >
//         <span>H2</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//         className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
//       >
//         <span>H3</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         className={editor.isActive("bulletList") ? "is-active" : ""}
//       >
//         <span>بلٹ لسٹ</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         className={editor.isActive("orderedList") ? "is-active" : ""}
//       >
//         <span>نمبر لسٹ</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//         className={editor.isActive("codeBlock") ? "is-active" : ""}
//       >
//         <span>کوڈ بلاک</span>
//       </button>
//       <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
//         <span>لائن</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().undo().run()}
//         disabled={!editor.can().chain().focus().undo().run()}
//       >
//         <span>واپس</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().redo().run()}
//         disabled={!editor.can().chain().focus().redo().run()}
//       >
//         <span>آگے</span>
//       </button>
//       <button
//         onClick={() =>
//           editor
//             .chain()
//             .focus()
//             .setLink({ href: "https://www.google.com" })
//             .run()
//         }
//         className={editor.isActive("link") ? "is-active" : ""}
//       >
//         <span>لنک</span>
//       </button>
//       <button onClick={addImage}>
//         <span>تصویر</span>
//       </button>
//       <button
//         onClick={() =>
//           editor
//             .chain()
//             .focus()
//             .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
//             .run()
//         }
//       >
//         <span>ٹیبل</span>
//       </button>
//       <button
//         onClick={() =>
//           editor.chain().focus().toggleHighlight({ color: "yellow" }).run()
//         }
//         className={
//           editor.isActive("highlight", { color: "yellow" }) ? "is-active" : ""
//         }
//       >
//         <span style={{ backgroundColor: "yellow" }}>ہائی لائٹ</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().setTextAlign("left").run()}
//         className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
//       >
//         <span>بائیں</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().setTextAlign("center").run()}
//         className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
//       >
//         <span>درمیان</span>
//       </button>
//       <button
//         onClick={() => editor.chain().focus().setTextAlign("right").run()}
//         className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
//       >
//         <span>دائیں</span>
//       </button>
//     </div>
//   );
// };

// const Tiptap = () => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bulletList: {
//           keepMarks: true,
//           keepAttributes: false,
//         },
//         orderedList: {
//           keepMarks: true,
//           keepAttributes: false,
//         },
//       }),
//       Underline,
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),
//       Highlight.configure({
//         multicolor: true,
//       }),
//       Link.configure({
//         openOnClick: true,
//       }),
//       Image,
//       Table.configure({
//         resizable: true,
//       }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       Placeholder.configure({
//         placeholder: "اپنی کہانی یہاں لکھیں...",
//       }),
//       CharacterCount.configure({
//         limit,
//       }),
//     ],
//     content: `
//       <h2>
//         ہیلو، یہ ایک سادہ ریچ ٹیکسٹ ایڈیٹر ہے
//       </h2>
//       <p>یہ ایک ڈیمو ہے اور تمام بنیادی فیچرز شامل ہیں، جیسے کہ:
//         <strong>بولڈ</strong>، <em>اٹالک</em>، <span style="text-decoration: underline">انڈر لائن</span>، اور <s>سٹرائیک تھرو</s>۔
//       </p>
//       <p style="text-align: center">آپ یہاں متن کو سیدھا بھی کر سکتے ہیں۔</p>
//       <ul>
//         <li>ایک بلٹ لسٹ</li>
//         <li>دوسرا آئٹم</li>
//       </ul>
//       <ol>
//         <li>ایک نمبر لسٹ</li>
//         <li>دوسرا آئٹم</li>
//       </ol>
//       <p>یہ ایک ٹیبل ہے:</p>
//       <table>
//         <tbody>
//           <tr>
//             <th>نام</th>
//             <th>عمر</th>
//           </tr>
//           <tr>
//             <td>علی</td>
//             <td>30</td>
//           </tr>
//         </tbody>
//       </table>
//       <p>آپ تصاویر بھی شامل کر سکتے ہیں:</p>
//       <img src="https://images.unsplash.com/photo-1623475143003-9c8642a8b3e1" />
//     `,
//   });

//   const getWordCount = () => {
//     if (!editor) return 0;
//     const content = editor.getText();
//     const words = content.trim().split(/\s+/).filter(Boolean);
//     return words.length;
//   };

//   const remainingWords = limit - getWordCount();

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">ریچ ٹیکسٹ ایڈیٹر</h1>
//       <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden flex-grow">
//         <div className="p-4 border-b border-gray-300">
//           {editor && <MenuBar editor={editor} />}
//         </div>
//         <div className="flex-grow p-4 overflow-y-auto">
//           <EditorContent
//             editor={editor}
//             className="prose max-w-none focus:outline-none"
//           />
//         </div>
//         <div className="p-4 border-t border-gray-300 text-sm text-gray-500">
//           <p>باقی الفاظ: {remainingWords}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles for the component
// const style = document.createElement("style");
// style.innerHTML = `
// body {
//   font-family: "Inter", sans-serif;
// }
// .prose img {
//   border-radius: 0.5rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
// }
// .prose table {
//   width: 100%;
//   border-collapse: collapse;
// }
// .prose th,
// .prose td {
//   border: 1px solid #ccc;
//   padding: 8px;
//   text-align: left;
// }
// .prose th {
//   background-color: #f3f4f6;
// }
// .is-active {
//   background-color: #e5e7eb;
//   color: #1f2937;
// }
// .tiptap p.is-editor-empty:first-child::before {
//   content: attr(data-placeholder);
//   float: left;
//   color: #adb5bd;
//   pointer-events: none;
//   height: 0;
// }
// `;
// document.head.appendChild(style);

// const root = createRoot(document.getElementById("root"));
// root.render(<Tiptap />);
