import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const TextView = () => {
  const { shortCode } = useParams();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchText = async () => {
      const q = query(collection(db, "texts"), where("shortCode", "==", shortCode));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setText(snap.docs[0].data().text);
      } else {
        setText("Not found.");
      }
      setLoading(false);
    };
    fetchText();
  }, [shortCode]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #232526 0%, #333 100%)",
          color: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', 'Shadows Into Light', cursive, sans-serif",
        }}
      >
        Loading...
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #232526 0%, #333 100%)",
        color: "#f3f3f3",
        fontFamily: "'Segoe UI', 'Shadows Into Light', cursive, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div
        className="max-w-xl w-full p-8 rounded-xl shadow-2xl"
        style={{
          background: "rgba(25, 25, 28, 0.97)",
          border: "2px solid #444",
        }}
      >
        <h2
          className="text-3xl font-bold mb-4 text-center"
          style={{ fontFamily: "'Shadows Into Light', cursive" }}
        >
          📄 Shared Text
        </h2>
        <pre
          className="p-5 rounded-lg shadow-inner"
          style={{
            background: "#18191b",
            color: "#ffe0b2",
            fontSize: "1.08rem",
            border: "2px dashed #f2a154",
            minHeight: "120px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "'Segoe UI', 'Shadows Into Light', cursive",
          }}
        >
          {text}
        </pre>
      </div>
    </div>
  );
};

export default TextView;