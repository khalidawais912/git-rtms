// "use client";

// import { useEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";
// import Sapling from "@saplingai/sapling-js";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// const SAPLING_API_KEY = process.env.NEXT_PUBLIC_SAPLING_KEY!; // make sure this is set

// export default function SaplingEditor() {
//   const [content, setContent] = useState("");
//   const editorRef = useRef<any>(null);

//   useEffect(() => {
//     if (!editorRef.current) return;

//     // Get Quill editor DOM element
//     const quillEditor = editorRef.current.getEditor();
//     const editorRoot: HTMLElement = quillEditor.root;

//     // Attach Sapling
//     const sapling = new Sapling({
//       key: SAPLING_API_KEY,
//       endpointHostname: "https://api.sapling.ai", // default
//     });

//     // Connect Sapling to the Quill editor
//     sapling.addGrammarChecker(editorRoot);

//     // Cleanup on unmount
//     return () => {
//       sapling.destroy();
//     };
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="font-bold text-lg mb-2">Sapling SDK + Quill</h2>
//       <ReactQuill
//         ref={editorRef}
//         theme="snow"
//         value={content}
//         onChange={setContent}
//         className="mb-4 bg-white"
//         placeholder="Type here..."
//       />
//     </div>
//   );
// }
