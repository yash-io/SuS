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
        const originalUrl = querySnapshot.docs[0].data().originalUrl;
        window.location.href = originalUrl;
      } else {
        console.error('Short URL not found');
      }
    };

    fetchUrl();
  }, [shortCode]);

  return <p>Redirecting...</p>;
};

export default Redirect;