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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] to-[#333] font-sans">
      <div className="max-w-lg w-full p-8 rounded-xl shadow-2xl bg-[#19191c]/95 border-2 border-[#444]">
        <h2 className="text-3xl font-bold mb-4 text-center font-handwriting">✍️ Text Shortener</h2>
        <button
          className="w-full mb-6 py-3 rounded-lg shadow font-handwriting bg-gradient-to-r from-orange-300 to-orange-600 text-black text-lg border-2 border-orange-400 hover:scale-105 active:scale-95 duration-150"
          onClick={() => navigate("/")}
        >
          🔗 Go to URL Shortener
        </button>
        <textarea
          className="w-full p-3 mb-4 rounded-md shadow-sm resize-vertical bg-[#2e2e2e] text-[#f3f3f3] border-2 border-[#656565] font-handwriting placeholder:italic placeholder:text-gray-400 min-h-[120px]"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
        />
        <button
          onClick={createShortText}
          disabled={loading || !text}
          className={`w-full py-3 rounded-lg mt-2 font-handwriting text-lg border-2 border-orange-400 bg-gradient-to-r from-orange-300 to-orange-500 text-black shadow hover:scale-105 active:scale-95 duration-150 ${
            loading || !text ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Generate Short Link"}
        </button>
        {shortCode && (
          <div className="mt-8 flex flex-col items-center bg-[#242628] border-2 border-dashed border-orange-300 rounded-xl p-5 font-handwriting text-orange-300">
            <span>Your share link:</span>
            <a
              href={`/text/${shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline break-all my-2 text-base"
            >
              {window.location.origin}/text/{shortCode}
            </a>
            <button
              onClick={handleCopy}
              className={`mt-2 px-6 py-2 rounded-lg border-2 border-orange-400 bg-gradient-to-r from-orange-200 to-orange-300 text-black shadow font-handwriting hover:scale-105 active:scale-95 duration-150 ${
                copied ? "bg-gradient-to-r from-green-300 to-green-500 border-green-700 text-green-900" : ""
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