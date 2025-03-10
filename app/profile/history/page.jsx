'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import useGlobalContextProvider from '@/app/ContextApi';
import moment from 'moment';
function HistoryPage() {
  const { userObject } = useGlobalContextProvider();
  const { user } = userObject;
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(9);
  const router = useRouter();

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const response = await fetch('/api/user-quiz/history', {
          headers: { 'user-id': user._id },
        });

        const data = await response.json();
        if (response.ok) {
          setUserQuizzes(data.userQuizzes);
        } else {
          toast.error('Không thể lấy dữ liệu bài làm.');
        }
      } catch (error) {
        toast.error('Lỗi kết nối đến máy chủ.');
      }
    };

    if (user) {
      fetchUserQuizzes();
    }
  }, [user]);

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = userQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="poppins mx-auto max-w-screen-xl p-6 sm:px-8 lg:px-10">
          <button
              onClick={() => router.push('/')}
              className="flex items-center text-green-700 hover:underline mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Quay lại
            </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📜 Lịch sử bài làm</h2>
      
      {userQuizzes.length === 0 ? (
        <p className="text-lg text-gray-600">Không có bài làm nào.</p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentQuizzes.map((userQuiz) => (
              <li key={userQuiz._id} className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800">{userQuiz.quiz.quizTitle}</h3>
                <p className="text-gray-600">📊 Điểm: <span className="font-bold text-bgreen-600">{userQuiz.score}</span></p>
                <p className="text-sm text-gray-500">
                Hoàn thành lúc: {moment(userQuiz.completedAt).format('DD/MM/YYYY HH:mm')}
              </p>
                <button
                  className="mt-3 flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-md shadow-md hover:from-green-600 hover:to-green-800 transition-all"
                  onClick={() => router.push(`/profile/history/${userQuiz._id}`)}
                >
                  <FontAwesomeIcon icon={faCircleInfo} />
                  Xem chi tiết
                </button>
              </li>
            ))}
          </ul>
          
          <Pagination quizzesPerPage={quizzesPerPage} totalQuizzes={userQuizzes.length} paginate={paginate} currentPage={currentPage} />
        </>
      )}
    </div>
  );
}

const Pagination = ({ quizzesPerPage, totalQuizzes, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalQuizzes / quizzesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-6">
      <ul className="flex justify-center gap-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-full text-lg font-semibold shadow-md transition-all ${
                currentPage === number ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HistoryPage;
