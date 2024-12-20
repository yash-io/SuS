import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const Short = () => {
  const [url, setUrl] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const originalUrl=url.toLowerCase();
  const generateShortUrl = (originalUrl) => {
    let hash = 5381;
    for (let i = 0; i < originalUrl.length; i++) {
      hash = (hash * 33) ^ originalUrl.charCodeAt(i);
    }
    return (hash >>> 0).toString(36).substring(0, 6);
  };


  const checkUrlExists = async (originalUrl) => {
    const q = query(collection(db, "urls"), where("url", "==", originalUrl));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().shortUrl;
    }
    const shortcode=originalUrl.slice(-6);
    const qShort = query(collection(db, "urls"), where("shortUrl", "==", shortcode));
    const queryShortSnapshot = await getDocs(qShort);
    if (!queryShortSnapshot.empty) {
      alert("This url is already shortened with code: "+shortcode);
      return queryShortSnapshot.docs[0].data().shortUrl;
    }
    return null;
  };

  const addUrl = async () => {
    const exists = await checkUrlExists(originalUrl);
    if (exists) {
      setNewUrl(exists);
      console.log("found");
      return;
    }

    const newShortUrl =generateShortUrl(originalUrl);
    try {
      await addDoc(collection(db, "urls"), {
        url: originalUrl,
        shortUrl: newShortUrl,
        timestamp: serverTimestamp(),
      });
      setUrl("");
      setNewUrl(newShortUrl);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUrl();
  };
  const handleCopy = () => {
    navigator.clipboard.writeText('https://s-us.vercel.app/'+newUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((error) => {
      console.error("Failed to copy: ", error);
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black p-4">
      <div className="border-2 border-white rounded-md bg-gray-200 p-6 w-full max-w-md min-h-1/3 mx-2">
        <h1 className="mb-4 text-center text-2xl text-red-600 font-bold">Url-Shortener</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            placeholder="Enter URL"
            onChange={(e) => setUrl(e.target.value)}
            className="border-2 border-gray-300 p-2 mb-4 w-full"
            required
          />
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 border-2 rounded-md px-4 py-2 text-white mb-6">Short me</button>
          </div>
        </form>
        {newUrl && (
          <div className="mt-4 text-center">
          <p>
            Short URL: <a href={newUrl} className="text-blue-700 underline">{`https://s-us.vercel.app/`+newUrl}</a>
          </p>
          <button onClick={handleCopy} className="mt-2 bg-green-500 border-2 rounded-md px-4 py-2 text-white">
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default Short;