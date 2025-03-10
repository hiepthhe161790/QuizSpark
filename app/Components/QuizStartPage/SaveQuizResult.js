'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function SaveQuizResult({ userId, quizId, score, answers }) {
  const router = useRouter();
  const hasSaved = useRef(false); 

  useEffect(() => {
    if (hasSaved.current) return; 
    hasSaved.current = true;

    const saveQuizResult = async () => {
      try {
        const response = await fetch('/api/user-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            quizId,
            score,
            answers,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Quiz result saved successfully:', data);
          toast.success('Quiz result saved successfully!');
          router.push(`/profile/history/${data.userQuiz._id}`);
        } else {
          console.error('Failed to save quiz result:', data.message);
          toast.error('Failed to save quiz result.');
        }
      } catch (error) {
        console.error('Error saving quiz result:', error);
        toast.error('Error saving quiz result.');
      }
    };

    saveQuizResult();
  }, [userId, quizId, score, answers]); 

  return null;
}

export default SaveQuizResult;
