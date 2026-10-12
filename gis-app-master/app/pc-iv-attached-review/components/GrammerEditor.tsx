// "use client";

// import { useState, useRef, useEffect } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";

// export default function GrammarEditor() {
//   const [text, setText] = useState<string>("");
//   const editorRef = useRef<ReactQuill | null>(null);
//   const [isClient, setClient] = useState(false);
//   useEffect(() => {
//     setClient(true);
//   }, []);

//   const checkGrammar = async () => {
//     try {
//       const response = await fetch("https://api.languagetool.org/v2/check", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           text,
//           language: "en-US",
//         }).toString(),
//       });

//       const result = await response.json();

//       if (editorRef.current) {
//         const quill = editorRef.current.getEditor();

//         // Clear old highlights
//         quill.formatText(0, quill.getLength(), { background: "transparent" });

//         // Apply highlights
//         result.matches.forEach((match: any) => {
//           const { offset, length } = match;
//           quill.formatText(offset, length, { background: "#ffcccc" }); // red highlight
//         });
//       }
//     } catch (err) {
//       console.error("Grammar check failed:", err);
//     }
//   };

//   return (
//     <div>
//       {isClient && (
//         <ReactQuill
//           ref={editorRef}
//           theme="snow"
//           value={text}
//           onChange={setText}
//           placeholder="Type something with mistakes... e.g. 'This are bad sentence.'"
//           className="mb-4"
//         />
//       )}

//       <button
//         onClick={checkGrammar}
//         className="px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         Check Grammar
//       </button>
//     </div>
//   );
// }
