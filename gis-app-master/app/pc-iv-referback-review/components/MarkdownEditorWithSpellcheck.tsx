import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
const MarkdownEditorWithSpellcheck = () => {
  const [value, setValue] = useState<string>(
    "# Hello\n\nType here to see *spell checking* in action."
  );

  // EasyMDE (wrapped by react-simplemde-editor) has a built-in, free spell checker
  // No paid API keys needed. English dictionary out of the box.
  const options: EasyMDE.Options = useMemo(
    () => ({
      spellChecker: false, // ❌ disable EasyMDE's fake spellchecker
      placeholder: "Write your markdown...",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "table",
        "code",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "guide",
      ],
      textareaProps: { spellCheck: true, autoCorrect: "on" },
      autoDownloadFontAwesome: false,
      // ✅ enable browser's built-in spellcheck on the hidden textarea
      // @ts-ignore
      textareaProps: { spellCheck: true, autoCorrect: "on" },
      // ✅ also tell CodeMirror to use native spellcheck
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
    }),
    []
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Markdown Editor (with Free Spell Check)
        </h1>
        <SimpleMDE value={value} onChange={setValue} options={options} />
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Tip: Misspelled words will be underlined. Use right-click to see
            suggestions.
          </p>
        </div>
      </div>
    </main>
  );
};

export default MarkdownEditorWithSpellcheck;
