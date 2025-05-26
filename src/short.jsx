import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const Short = () => {
  const [url, setUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const originalUrl = url.toLowerCase();

  const generateShortUrl = (originalUrl) => {
    let hash = 5381;
    for (let i = 0; i < originalUrl.length; i++) {
      hash = (hash * 33) ^ originalUrl.charCodeAt(i);
    }
    return (hash >>> 0).toString(36).substring(0, 6);
  };

  const checkUrlExists = async (originalUrl, shortUrl) => {
    // Check if the original URL already exists
    const q = query(collection(db, "urls"), where("url", "==", originalUrl));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().shortUrl;
    }

    // Check if the custom short URL already exists
    if (shortUrl) {
      const qShort = query(collection(db, "urls"), where("shortUrl", "==", shortUrl));
      const queryShortSnapshot = await getDocs(qShort);
      if (!queryShortSnapshot.empty) {
        alert("This custom name is already taken. Please choose another one.");
        return null;
      }
    }

    return null;
  };

  const addUrl = async () => {
    const shortUrl = customName || generateShortUrl(originalUrl);
    const exists = await checkUrlExists(originalUrl, customName ? customName : null);
    if (exists) {
      setNewUrl(exists);
      console.log("URL already exists.");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addUrl();
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
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white p-4">
      <div className="border-2 border-gray-700 rounded-md bg-gray-800 p-6 w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl text-red-500 font-bold">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={url}
            placeholder="Enter URL"
            onChange={(e) => setUrl(e.target.value)}
            className="border border-gray-600 bg-gray-700 p-3 rounded-md w-full text-sm text-white"
            required
          />
          <input
            type="text"
            value={customName}
            placeholder="Enter Custom Name (optional)"
            onChange={(e) => setCustomName(e.target.value)}
            className="border border-gray-600 bg-gray-700 p-3 rounded-md w-full text-sm text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Shorten URL
          </button>
        </form>
        {newUrl && (
          <div className="mt-6 text-center">
            <p>
              Short URL:{" "}
              <a
                href={`https://s-us.vercel.app/${newUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                https://s-us.vercel.app/{newUrl}
              </a>
            </p>
            <button
              onClick={handleCopy}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Short;