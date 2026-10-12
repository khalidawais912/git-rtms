// // components/SmartSimpleMDE.tsx
// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css";

// // Lightweight spell checker dictionary
// const commonMisspellings: { [key: string]: string[] } = {
//   teh: ["the"],
//   recieve: ["receive"],
//   occured: ["occurred"],
//   seperate: ["separate"],
//   definately: ["definitely"],
//   begining: ["beginning"],
//   acheive: ["achieve"],
//   neccessary: ["necessary"],
//   accomodate: ["accommodate"],
//   embarass: ["embarrass"],
//   existance: ["existence"],
//   independant: ["independent"],
//   maintainance: ["maintenance"],
//   occassion: ["occasion"],
//   peice: ["piece"],
//   priviledge: ["privilege"],
//   recomend: ["recommend"],
//   wierd: ["weird"],
//   beleive: ["believe"],
//   calender: ["calendar"],
//   deffinate: ["definite"],
//   enviroment: ["environment"],
//   goverment: ["government"],
//   harrass: ["harass"],
//   independance: ["independence"],
//   jewelery: ["jewelry"],
//   knowlege: ["knowledge"],
//   liason: ["liaison"],
//   mispell: ["misspell"],
//   noticable: ["noticeable"],
//   occurance: ["occurrence"],
//   persue: ["pursue"],
//   questionaire: ["questionnaire"],
//   reccomend: ["recommend"],
//   succesful: ["successful"],
//   tommorow: ["tomorrow"],
//   untill: ["until"],
//   vaccuum: ["vacuum"],
//   wellcome: ["welcome"],
//   acomodate: ["accommodate"],
//   adress: ["address"],
//   agressive: ["aggressive"],
//   alot: ["a lot"],
//   basicly: ["basically"],
//   buisness: ["business"],
//   congradulations: ["congratulations"],
//   difinitely: ["definitely"],
//   excercise: ["exercise"],
//   foward: ["forward"],
//   interupt: ["interrupt"],
//   judgement: ["judgment"],
//   kernal: ["kernel"],
//   lenght: ["length"],
//   managment: ["management"],
//   neccessery: ["necessary"],
//   ocasion: ["occasion"],
//   paralel: ["parallel"],
//   suceed: ["succeed"],
//   truely: ["truly"],
// };

// interface SmartSimpleMDEProps {
//   value?: string;
//   onChange?: (value: string) => void;
//   placeholder?: string;
//   className?: string;
//   [key: string]: any;
// }

// const SmartSimpleMDE = React.forwardRef<any, SmartSimpleMDEProps>(
//   (
//     {
//       value,
//       onChange,
//       placeholder = "Enter text...",
//       className = "custom-editor",
//       ...props
//     },
//     ref
//   ) => {
//     const editorRef = useRef<any>(null);
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
//     const [suggestionPosition, setSuggestionPosition] = useState({
//       x: 0,
//       y: 0,
//     });
//     const [selectedErrorWord, setSelectedErrorWord] = useState<string>("");
//     const [selectedRange, setSelectedRange] = useState<any>(null);

//     // Simplified editor options
//     const editorOptions: EasyMDE.Options = {
//       spellChecker: false,
//       autofocus: false,
//       placeholder,
//       status: false,
//       toolbar: [
//         "bold",
//         "italic",
//         "heading",
//         "|",
//         "quote",
//         "unordered-list",
//         "ordered-list",
//         "|",
//         "link",
//         "image",
//         "|",
//         "preview",
//         "side-by-side",
//         "fullscreen",
//         "|",
//         "guide",
//       ],
//     };

//     const checkSpelling = useCallback(() => {
//       if (!editorRef.current) return;

//       const editor = editorRef.current.simpleMDE;
//       if (!editor?.codemirror) return;

//       const cm = editor.codemirror;
//       const text = cm.getValue();

//       // Clear previous marks
//       cm.getAllMarks().forEach((mark: any) => {
//         if (mark.className?.includes("spell-error")) {
//           mark.clear();
//         }
//       });

//       const words = text.match(/\b\w+\b/g) || [];
//       let searchIndex = 0;

//       words.forEach((word: string) => {
//         const cleanWord = word.toLowerCase();

//         if (cleanWord.length > 2 && commonMisspellings[cleanWord]) {
//           const wordStart = text.indexOf(word, searchIndex);
//           if (wordStart !== -1) {
//             try {
//               const startPos = cm.posFromIndex(wordStart);
//               const endPos = cm.posFromIndex(wordStart + word.length);

//               // Mark the error
//               cm.markText(startPos, endPos, {
//                 className: "spell-error",
//                 title: `Possible spelling error: ${word}`,
//                 attributes: {
//                   "data-word": word,
//                   "data-clean-word": cleanWord,
//                   "data-suggestions": commonMisspellings[cleanWord].join(","),
//                 },
//               });

//               searchIndex = wordStart + word.length;
//             } catch (error) {
//               console.warn("Error marking text:", error);
//             }
//           }
//         }
//       });
//     }, []);

//     const handleWordClick = useCallback(
//       (event: MouseEvent, word: string, suggestions: string[], range: any) => {
//         event.preventDefault();
//         event.stopPropagation();

//         const rect = (event.target as HTMLElement).getBoundingClientRect();
//         setSuggestionPosition({
//           x: rect.left + window.scrollX,
//           y: rect.bottom + window.scrollY + 5,
//         });
//         setCurrentSuggestions(suggestions);
//         setSelectedErrorWord(word);
//         setSelectedRange(range);
//         setShowSuggestions(true);
//       },
//       []
//     );

//     const replaceSuggestion = useCallback(
//       (suggestion: string) => {
//         if (!editorRef.current?.simpleMDE?.codemirror || !selectedRange) return;

//         const cm = editorRef.current.simpleMDE.codemirror;

//         try {
//           // Replace the word
//           cm.replaceRange(suggestion, selectedRange.from, selectedRange.to);

//           // Trigger onChange
//           const newValue = cm.getValue();
//           if (onChange) {
//             onChange(newValue);
//           }

//           setShowSuggestions(false);
//           setSelectedRange(null);

//           // Re-check spelling after replacement
//           setTimeout(checkSpelling, 100);
//         } catch (error) {
//           console.warn("Error replacing suggestion:", error);
//         }
//       },
//       [onChange, selectedRange, checkSpelling]
//     );

//     const handleClickOutside = useCallback((event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest(".suggestion-popup")) {
//         setShowSuggestions(false);
//       }
//     }, []);

//     // Setup event listeners
//     useEffect(() => {
//       document.addEventListener("click", handleClickOutside);
//       return () => document.removeEventListener("click", handleClickOutside);
//     }, [handleClickOutside]);

//     // Setup editor event handlers
//     useEffect(() => {
//       if (!editorRef.current?.simpleMDE?.codemirror) return;

//       const cm = editorRef.current.simpleMDE.codemirror;

//       const handleClick = (cm: any, event: MouseEvent) => {
//         const target = event.target as HTMLElement;
//         if (target.classList.contains("spell-error")) {
//           const word = target.getAttribute("data-word") || "";
//           const suggestions =
//             target.getAttribute("data-suggestions")?.split(",") || [];

//           try {
//             const pos = cm.coordsChar({
//               left: event.clientX,
//               top: event.clientY,
//             });
//             const token = cm.getTokenAt(pos);

//             handleWordClick(event, word, suggestions, {
//               from: { line: pos.line, ch: token.start },
//               to: { line: pos.line, ch: token.end },
//             });
//           } catch (error) {
//             console.warn("Error handling word click:", error);
//           }
//         }
//       };

//       // Auto spell check on text change (debounced)
//       let spellCheckTimeout: NodeJS.Timeout;
//       const handleChange = () => {
//         clearTimeout(spellCheckTimeout);
//         spellCheckTimeout = setTimeout(checkSpelling, 2000);
//       };

//       cm.on("mousedown", handleClick);
//       cm.on("change", handleChange);

//       // Initial spell check
//       const initialTimeout = setTimeout(checkSpelling, 1000);

//       return () => {
//         try {
//           cm.off("mousedown", handleClick);
//           cm.off("change", handleChange);
//           clearTimeout(spellCheckTimeout);
//           clearTimeout(initialTimeout);
//         } catch (error) {
//           console.warn("Error cleaning up event listeners:", error);
//         }
//       };
//     }, [checkSpelling, handleWordClick]);

//     return (
//       <div className="smart-simplemde-wrapper">
//         <div className="smart-simplemde-container">
//           <SimpleMDE
//             ref={(el) => {
//               editorRef.current = el;
//               if (ref) {
//                 if (typeof ref === "function") {
//                   ref(el);
//                 } else {
//                   ref.current = el;
//                 }
//               }
//             }}
//             value={value}
//             onChange={onChange}
//             options={editorOptions}
//             className={className}
//             {...props}
//           />

//           {/* Manual Spell Check Button */}
//           <button
//             type="button"
//             onClick={checkSpelling}
//             className="spell-check-btn"
//             title="Check spelling"
//           >
//             ✓ Check Spelling
//           </button>

//           {/* Suggestion Popup */}
//           {showSuggestions && currentSuggestions.length > 0 && (
//             <div
//               className="suggestion-popup"
//               style={{
//                 position: "fixed",
//                 left: suggestionPosition.x,
//                 top: suggestionPosition.y,
//                 zIndex: 1050,
//                 backgroundColor: "white",
//                 border: "1px solid #ddd",
//                 borderRadius: "4px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                 minWidth: "150px",
//                 maxWidth: "250px",
//               }}
//             >
//               <div style={{ padding: "8px" }}>
//                 <div
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: "12px",
//                     color: "#666",
//                     marginBottom: "4px",
//                   }}
//                 >
//                   Suggestions for "{selectedErrorWord}":
//                 </div>
//                 {currentSuggestions.map((suggestion, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       padding: "4px 8px",
//                       cursor: "pointer",
//                       borderRadius: "2px",
//                       transition: "background-color 0.2s",
//                     }}
//                     onMouseEnter={(e) => {
//                       (e.target as HTMLElement).style.backgroundColor =
//                         "#f8f9fa";
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.target as HTMLElement).style.backgroundColor =
//                         "transparent";
//                     }}
//                     onClick={() => replaceSuggestion(suggestion)}
//                   >
//                     {suggestion}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <style jsx>{`
//           .smart-simplemde-wrapper {
//             position: relative;
//           }

//           .smart-simplemde-container {
//             position: relative;
//           }

//           .spell-check-btn {
//             position: absolute;
//             top: 8px;
//             right: 8px;
//             z-index: 10;
//             background: #007bff;
//             color: white;
//             border: none;
//             padding: 4px 8px;
//             border-radius: 4px;
//             font-size: 12px;
//             cursor: pointer;
//             opacity: 0.8;
//             transition: opacity 0.2s;
//           }

//           .spell-check-btn:hover {
//             opacity: 1;
//           }

//           :global(.CodeMirror .spell-error) {
//             border-bottom: 2px wavy #dc3545 !important;
//             cursor: pointer !important;
//             text-decoration: none !important;
//           }

//           :global(.CodeMirror .spell-error:hover) {
//             background-color: rgba(220, 53, 69, 0.1) !important;
//           }
//         `}</style>
//       </div>
//     );
//   }
// );

// SmartSimpleMDE.displayName = "SmartSimpleMDE";

// export default SmartSimpleMDE;
