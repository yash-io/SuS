import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const Short = () => {
  const [url, setUrl] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const originalUrl=url.toLowerCase();
  const generateShortUrl = () => {
    return Math.random().toString(36).substring(2, 8).toLowerCase();
  };


  const checkUrlExists = async (url) => {
    const q = query(collection(db, "urls"), where("url", "==", originalUrl));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().shortUrl;
    }
    const shortcode=originalUrl.slice(-6);
    const qShort = query(collection(db, "urls"), where("shortUrl", "==", shortcode));
    const queryShortSnapshot = await getDocs(qShort);
    if (!queryShortSnapshot.empty) {
      alert("Short URL already exists");
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

    const newShortUrl =generateShortUrl();
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

  return (
    <div className="flex justify-center items-center h-screen bg-black p-4">
      <div className="border-2 border-white rounded-md bg-gray-200 p-6 w-full max-w-md h-1/3 mx-2">
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
            <button type="submit" className="bg-blue-500 border-2 rounded-md px-4 py-2 text-white">Short me</button>
          </div>
        </form>
        {newUrl && (
          <p className="mt-4 text-center">
            Short URL: <a href={newUrl} className="text-blue-700 underline">{`https://s-sus.vercel.app/`+newUrl}</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Short;