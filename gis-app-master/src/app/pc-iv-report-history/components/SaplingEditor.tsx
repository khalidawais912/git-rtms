"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const SAPLING_API_KEY = process.env.NEXT_PUBLIC_SAPLING_KEY; // <-- replace with your Sapling key

export default function SaplingEditor() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<any[]>([]);

  // Call Sapling grammar check
  const checkGrammar = async () => {
    try {
      const response = await axios.post("https://api.sapling.ai/api/v1/edits", {
        key: SAPLING_API_KEY,
        text: content,
      });

      setErrors(response.data.edits || []);
    } catch (error) {
      console.error("Sapling API error:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Rich Text Editor with Sapling</h2>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="mb-4 bg-white"
        placeholder="Type here..."
      />

      <button
        onClick={checkGrammar}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Check Grammar
      </button>

      {errors.length > 0 && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <h3 className="font-semibold">Suggestions:</h3>
          <ul className="list-disc ml-5">
            {errors.map((err, idx) => (
              <li key={idx}>
                <strong>{err.error_type}</strong>: {err.suggestion}
                <br />
                <em>Context:</em> {err.context.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
