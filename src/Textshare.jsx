import React, { useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const generateShortCode = (text) => {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(36).substring(0, 6);
};

const TextShare = () => {
  const [text, setText] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createShortText = async () => {
    setLoading(true);
    const code = generateShortCode(text);
    const q = query(collection(db, "texts"), where("shortCode", "==", code));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setShortCode(code);
      setLoading(false);
      return;
    }
    await addDoc(collection(db, "texts"), {
      text,
      shortCode: code,
      timestamp: serverTimestamp(),
    });
    setShortCode(code);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/text/${shortCode}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 font-mono">
      <div className="max-w-lg w-full p-8 rounded-xl shadow-2xl bg-neutral-900/95 border-2 border-neutral-700">
        {/* Back Button */}
        <button
          className="mb-6 px-4 py-2 rounded-lg border-2 border-blue-500 bg-neutral-800 text-blue-400 font-mono shadow hover:bg-neutral-700 hover:text-blue-300 transition duration-150"
          onClick={() => navigate("/")}
        >
          ← Back to URL Shortener
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-neutral-100 font-mono">
          Text Shortener
        </h2>
        <textarea
          className="w-full p-3 mb-4 rounded-md shadow-sm bg-neutral-800 text-neutral-100 border-2 border-neutral-600 font-mono placeholder:text-neutral-400 min-h-[120px] resize-vertical focus:outline-none focus:border-blue-500"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
        />
        <button
          onClick={createShortText}
          disabled={loading || !text}
          className={`w-full py-3 rounded-lg mt-2 font-mono text-base border-2 border-blue-400 bg-blue-600 text-white shadow hover:bg-blue-500 hover:border-blue-300 transition duration-150 ${
            loading || !text ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Generate Short Link"}
        </button>
        {shortCode && (
          <div className="mt-8 flex flex-col items-center bg-neutral-800 border-2 border-dashed border-blue-300 rounded-xl p-5 font-mono text-blue-200">
            <span>Your share link:</span>
            <a
              href={`/text/${shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all my-2 text-base"
            >
              {window.location.origin}/text/{shortCode}
            </a>
            <button
              onClick={handleCopy}
              className={`mt-2 px-6 py-2 rounded-lg border-2 border-blue-400 bg-blue-200 text-blue-900 shadow font-mono hover:bg-blue-300 hover:border-blue-500 transition duration-150 ${
                copied ? "bg-green-300 border-green-500 text-green-900" : ""
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextShare;