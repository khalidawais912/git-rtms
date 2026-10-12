// "use client";
// import React, { useState } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";

// // Import spell checker
// import SpellChecker from "react-quill-spell-checker";

// // Register it (with Quill from react-quill v2)
// Quill.register("modules/spellChecker", SpellChecker);

// export default function SpellCheckEditor() {
//   const [value, setValue] = useState("");

//   const modules = {
//     toolbar: [["bold", "italic", "underline"], ["clean"]],
//     spellChecker: true,
//   };

//   return (
//     <ReactQuill
//       theme="snow"
//       value={value}
//       onChange={setValue}
//       modules={modules}
//     />
//   );
// }
