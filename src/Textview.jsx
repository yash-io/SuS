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

  if (loading) return <div>Loading...</div>;
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Shared Text:</h2>
      <pre className="bg-gray-100 p-4 rounded">{text}</pre>
    </div>
  );
};

export default TextView;
