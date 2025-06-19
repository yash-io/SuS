import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Redirect = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const fetchUrl = async () => {
      const q = query(collection(db, 'urls'), where('shortUrl', '==', shortCode));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const originalUrl = querySnapshot.docs[0].data().url;
        window.location.href = originalUrl.startsWith('http') ? originalUrl : `http://${originalUrl}`;
        console.log('Redirecting to:', originalUrl);
      } else {
        console.error('Short URL not found');
      }
    };

    fetchUrl();
  }, [shortCode]);

  return (
    <div
      className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-center p-4"
    >
      <div className="animate-bounce">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 9.172a4 4 0 010 5.656M9.172 14.828a4 4 0 010-5.656m5.656 5.656a4 4 0 01-5.656 0m5.656-5.656a4 4 0 00-5.656 0"
          />
        </svg>
        <h1 className="text-2xl font-bold">Hang Tight!</h1>
        <p className="mt-2">We're redirecting you to the original URL...</p>
      </div>
    </div>
  );
};

export default Redirect;