import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center font-mono text-neutral-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 font-mono">
      <div className="max-w-xl w-full p-8 rounded-xl shadow-2xl bg-neutral-900/95 border-2 border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-neutral-100 text-center font-mono">
          Shared Text
        </h2>
        <pre className="p-5 rounded-lg shadow-inner bg-neutral-800 text-blue-200 border-2 border-dashed border-blue-400 min-h-[120px] whitespace-pre-wrap break-words font-mono">
          {text}
        </pre>
      </div>
    </div>
  );
};

export default TextView;