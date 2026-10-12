// "use client";

// import dynamic from "next/dynamic";
// import { useEffect, useRef, useState } from "react";

// // Dynamically import ReactQuill (no SSR)
// const ReactQuillNoSSR = dynamic(
//   async () => {
//     const { default: RQ } = await import("react-quill");
//     return ({ forwardedRef, ...props }: any) => (
//       <RQ ref={forwardedRef} {...props} />
//     );
//   },
//   { ssr: false }
// );

// export default function SaplingEditorWithHighlight() {
//   const editorRef = useRef<any>(null);
//   const [isClient, setClient] = useState(false);

//   useEffect(() => {
//     // Only run in client
//     if (!editorRef.current) return;

//     import("@saplingai/sapling-js/observer").then(({ Sapling }) => {
//       const container = editorRef.current.getEditor().root;
//       if (container) {
//         Sapling.init({
//           key: process.env.NEXT_PUBLIC_SAPLING_KEY,
//           endpointHostname: "https://api.sapling.ai",
//           editPathname: "/api/v1/edits",
//           statusBadge: true,
//           mode: "dev",
//         });
//         const editor = document.getElementById("editor");
//         Sapling.observe(container);
//       }
//     });

//     setClient(true);
//   }, []);

//   return (
//     <>
//       {isClient && (
//         <ReactQuillNoSSR
//           forwardedRef={editorRef}
//           theme="snow"
//           placeholder="Type something..."
//           style={{ height: 300, marginBottom: 20 }}
//         />
//       )}
//       <div id="editor" sapling-ignore="true" contentEditable="true">
//         Lets get started!
//       </div>
//     </>
//   );
// }
