// "use client";

// import { useEffect, useRef } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css";
// import WProofreader from "@webspellchecker/wproofreader-sdk-js";

// const MarkdownEditor = () => {
//   const editorRef = useRef<HTMLTextAreaElement | null>(null);

//   useEffect(() => {
//     if (!editorRef.current) return;

//     // Attach WProofreader to the SimpleMDE textarea
//     const proofreader = new WProofreader({
//       container: editorRef.current,
//       serviceId: "your-service-id", // Get free trial ID from https://webspellchecker.com/signup/
//       lang: "en_US",
//       autoSearch: true,
//       theme: "gray",
//     });

//     proofreader.init();

//     return () => {
//       proofreader.destroy();
//     };
//   }, []);

//   return (
//     <div>
//       <h2 className="mb-2 font-bold text-lg">
//         Rich Text Editor with Grammar Check
//       </h2>
//       <SimpleMDE
//         options={{
//           spellChecker: false, // disable built-in spellchecker
//           placeholder: "Start writing here...",
//         }}
//         getCodemirrorInstance={(codemirror) => {
//           // get the textarea element from CodeMirror
//           setTimeout(() => {
//             const textarea = codemirror.getInputField() as HTMLTextAreaElement;
//             editorRef.current = textarea;
//           }, 0);
//         }}
//       />
//     </div>
//   );
// };

// export default MarkdownEditor;
