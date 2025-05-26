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
import validator from "validator";

const Short = () => {
  const [url, setUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [validating, setValidating] = useState(false);

  const generateShortUrl = (originalUrl) => {
    let hash = 5381;
    for (let i = 0; i < originalUrl.length; i++) {
      hash = (hash * 33) ^ originalUrl.charCodeAt(i);
    }
    return (hash >>> 0).toString(36).substring(0, 6);
  };

  const normalizeUrl = (inputUrl) => {
    let finalUrl = inputUrl.trim();

    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    if (validator.isURL(finalUrl, { require_protocol: true })) {
      return finalUrl.toLowerCase();
    } else {
      return null;
    }
  };

  const checkUrlExists = async (originalUrl, shortUrl) => {
    const q = query(collection(db, "urls"), where("url", "==", originalUrl));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().shortUrl;
    }

    if (shortUrl) {
      const qShort = query(
        collection(db, "urls"),
        where("shortUrl", "==", shortUrl)
      );
      const queryShortSnapshot = await getDocs(qShort);
      if (!queryShortSnapshot.empty) {
        alert("This custom name is already taken. Please choose another one.");
        return null;
      }
    }

    return null;
  };

  const addUrl = async (originalUrl) => {
    const shortUrl = customName || generateShortUrl(originalUrl);
    const exists = await checkUrlExists(originalUrl, customName ? customName : null);
    if (exists) {
      setNewUrl(exists);
      return;
    }

    try {
      await addDoc(collection(db, "urls"), {
        url: originalUrl,
        shortUrl,
        timestamp: serverTimestamp(),
      });
      setUrl("");
      setCustomName("");
      setNewUrl(shortUrl);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidating(true);
    const normalized = normalizeUrl(url);
    if (!normalized) {
      alert("Please enter a valid URL.");
      setValidating(false);
      return;
    }
    await addUrl(normalized);
    setValidating(false);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText("https://s-us.vercel.app/" + newUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <div className="bg-gray-850 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">🔗 Smart URL Shortener</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-300">Enter Original URL</label>
            <input
              type="text"
              value={url}
              placeholder="https://example.com"
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-lg p-3 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              required
              disabled={validating}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-300">Custom Name (Optional)</label>
            <input
              type="text"
              value={customName}
              placeholder="custom-name"
              onChange={(e) => setCustomName(e.target.value)}
              className="rounded-lg p-3 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={validating}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-2.5 font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
            disabled={validating}
          >
            {validating ? "Validating..." : "✨ Shorten It!"}
          </button>
        </form>

        {newUrl && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg text-center animate-fade-in space-y-4">
            <p className="text-lg font-semibold">Here’s your short URL:</p>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <a
                href={`https://s-us.vercel.app/${newUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline break-all hover:text-blue-400 text-center"
              >
                https://s-us.vercel.app/{newUrl}
              </a>
              <button
                onClick={handleCopy}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Short;
