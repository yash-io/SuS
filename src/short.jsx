import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const Short = () => {
  const [url, setUrl] = useState("");
  const [newUrl, setNewUrl] = useState("");


  const generateShortUrl = () => {
    return Math.random().toString(36).substring(2, 8);
  };


  const checkUrlExists = async (url) => {
    const q = query(collection(db, "urls"), where("url", "==", url));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().shortUrl;
    }
    return null;
  };

  const addUrl = async () => {
    const exists = await checkUrlExists(url);
    if (exists) {
      setNewUrl(exists);
      console.log("found");
      return;
    }

    const newShortUrl =generateShortUrl();
    try {
      await addDoc(collection(db, "urls"), {
        url: url,
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
    <>
      <div className="flex justify-center items-center p-10 m-10 flex-col">
        <h1 className="mb-4 block">Short</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            placeholder="Enter URL"
            onChange={(e) => setUrl(e.target.value)}
            className="border-2 border-gray-300 p-2  mb-8 block"
            required
          />
          <button type="submit" className="bg-blue-500 border-2 rounded-md">Shorten</button>
        </form>
        {newUrl && (
          <p>
            Short URL: <a href={newUrl}>{`s-us.vercel.app/`+newUrl}</a>
          </p>
        )}
      </div>
    </>
  );
};

export default Short;