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

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

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
      .writeText(`${window.location.origin}/text/${shortCode}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #232526 0%, #333 100%)",
        color: "#f3f3f3",
        fontFamily: "'Segoe UI', 'Shadows Into Light', cursive, sans-serif",
      }}
    >
      <div
        className="max-w-lg w-full p-8 rounded-xl shadow-2xl"
        style={{
          background: "rgba(25, 25, 28, 0.95)",
          border: "2px solid #444",
        }}
      >
        <h2
          className="text-3xl font-bold mb-4 text-center"
          style={{ fontFamily: "'Shadows Into Light', cursive" }}
        >
          ✍️ Text Shortener
        </h2>
        <textarea
          className="w-full p-3 mb-4 rounded-md shadow-sm resize-vertical"
          style={{
            background: "#2e2e2e",
            color: "#f3f3f3",
            border: "2px solid #656565",
            fontFamily: "'Segoe UI', 'Shadows Into Light', cursive",
            minHeight: "120px",
          }}
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
        />
        <button
          onClick={createShortText}
          disabled={loading || !text}
          style={{
            background:
              "linear-gradient(90deg, #f2a154 0%, #ff7b54 100%)",
            color: "#232526",
            boxShadow: "2px 3px 5px rgba(0,0,0,0.21)",
            border: "2px solid #e07a5f",
            borderRadius: "10px",
            padding: "10px 24px",
            fontWeight: "bold",
            fontFamily: "'Shadows Into Light', cursive",
            fontSize: "1.25rem",
            cursor: loading || !text ? "not-allowed" : "pointer",
            opacity: loading || !text ? 0.6 : 1,
            transition: "all 0.15s",
            marginBottom: "1.5rem",
            marginTop: "0.5rem",
            display: "block",
            width: "100%",
          }}
        >
          {loading ? "Processing..." : "Generate Short Link"}
        </button>
        {shortCode && (
          <div
            className="mt-6 flex flex-col items-center"
            style={{
              background: "#242628",
              borderRadius: "13px",
              padding: "1.2rem",
              border: "2px dashed #ffb26b",
              color: "#ffb26b",
              fontFamily: "'Shadows Into Light', cursive",
              marginTop: "2rem",
            }}
          >
            <span>Your share link:</span>
            <a
              href={`/text/${shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#f2a154",
                textDecoration: "underline",
                fontSize: "1.05rem",
                margin: "0.5rem 0",
                wordBreak: "break-all",
              }}
            >
              {window.location.origin}/text/{shortCode}
            </a>
            <button
              onClick={handleCopy}
              style={{
                marginTop: "0.5rem",
                background: copied
                  ? "linear-gradient(90deg, #a8e063 0%, #56ab2f 100%)"
                  : "linear-gradient(90deg, #ffb26b 0%, #f2a154 100%)",
                color: "#232526",
                border: "2px solid #e07a5f",
                borderRadius: "8px",
                padding: "8px 20px",
                fontWeight: "bold",
                fontFamily: "'Shadows Into Light', cursive",
                fontSize: "1.05rem",
                boxShadow: "1px 2px 5px rgba(0,0,0,0.21)",
                cursor: "pointer",
                transition: "all 0.15s",
                outline: "none",
              }}
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