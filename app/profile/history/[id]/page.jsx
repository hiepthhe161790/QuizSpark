'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useGlobalContextProvider from '@/app/ContextApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

function QuizDetailPage() {
  const { userObject } = useGlobalContextProvider();
  const { user } = userObject;
  const [quizDetail, setQuizDetail] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        const response = await fetch(`/api/user-quiz/${id}`, {
          headers: { 'user-id': user._id },
        });

        const data = await response.json();
        if (response.ok) {
          setQuizDetail(data.userQuiz);
        } else {
          console.error('Failed to fetch quiz detail:', data.message);
        }
      } catch (error) {
        console.error('Error fetching quiz detail:', error);
      }
    };

    if (user) {
      fetchQuizDetail();
    }
  }, [user, id]);

  if (!quizDetail) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="poppins mx-auto max-w-screen-lg p-4 sm:px-8 sm:py-5 lg:px-10">
      <button
        onClick={() => router.push('/profile/history')}
        className="flex items-center text-green-500 hover:underline mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Quay lại
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">{quizDetail.quiz.quizTitle}</h2>
        <p className="text-center text-gray-600">
          Điểm: <span className="font-semibold">{quizDetail.score}</span>
        </p>
        <p className="text-center text-gray-500 text-sm">
          Hoàn thành lúc: {moment(quizDetail.completedAt).format('DD/MM/YYYY HH:mm')}
        </p>

        {/* Hiển thị danh sách câu hỏi */}
        <div className="mt-6 space-y-6">
          {quizDetail.answers.map((answer, index) => {
            const question = quizDetail.quiz.quizQuestions.find(q => q.id === answer.questionId);

            if (!question) {
              return (
                <div key={index} className="border p-4 rounded-md shadow-sm bg-red-50">
                  <p className="text-red-500 font-semibold">Câu hỏi không tồn tại hoặc đã bị xóa.</p>
                </div>
              );
            }

            return (
              <div key={index} className="border p-4 rounded-md shadow-md">
                {/* Câu hỏi */}
                <div className="flex items-center gap-2">
                  <div className="bg-green-700 flex justify-center items-center rounded-md w-11 h-11 text-white p-3">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-lg">{question.mainQuestion}</p>
                </div>

                {/* Hiển thị các lựa chọn */}
                <div className="mt-4 flex flex-col gap-2">
                  {question.choices.map((choice, choiceIndex) => {
                    const isSelected = choiceIndex === answer.selectedAnswer;
                    const isCorrect = choiceIndex === question.correctAnswer;
                    return (
                      <div
                        key={choiceIndex}
                        className={`p-3 ml-11 w-10/12 border rounded-md transition-all select-none flex justify-between items-center
                          ${isSelected ? (answer.isCorrect ? 'bg-green-700 text-white' : 'bg-red-500 text-white') : 'bg-white border-green-700'}
                          hover:bg-green-700 hover:text-white`}
                      >
                        {choice}
                        {isSelected && (
                          <FontAwesomeIcon
                            icon={answer.isCorrect ? faCheckCircle : faTimesCircle}
                            className={`ml-2 ${answer.isCorrect ? 'text-white' : 'text-white'}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuizDetailPage;
