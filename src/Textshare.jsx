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
      .writeText(`${window.location.origin}/${shortCode}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Text Shortener</h2>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
      />
      <button
        onClick={createShortText}
        disabled={loading || !text}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Generate Short Link"}
      </button>
      {shortCode && (
  <div>
    <span>Your share link: </span>
    <a
      href={`/text/${shortCode}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {window.location.origin}/text/{shortCode}
    </a>
    <button
      onClick={() =>
        navigator.clipboard.writeText(`${window.location.origin}/text/${shortCode}`)
      }
      className="ml-2 px-2 py-1 bg-gray-200 rounded"
    >
      Copy Link
    </button>
  </div>
)}
    </div>
  );
};

export default TextShare;
