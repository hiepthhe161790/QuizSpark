'use client';
import React from 'react';
import QuizCard from './QuizCard';
import PlaceHolder from './PlaceHolder';
import useGlobalContextProvider from '../ContextApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DropDown from './DropDown';

function QuizzesArea({ props }) {
  const { allQuizzes, userObject, isLoadingObject } = useGlobalContextProvider();
  const router = useRouter();
  const { user, setUser } = userObject;
  const { isLoading } = isLoadingObject;
  console.log(isLoading);

  return (
    <div className="poppins mx-12 mt-10">
      <div>
        {isLoading ? (
          <div></div>
        ) : user && user.isLogged ? (
          <>
            {allQuizzes.length === 0 ? (
              <PlaceHolder />
            ) : (
              <div>
                {user.role === 'admin' && <DropDown />}
                <h2 className="text-xl font-bold">Quiz của bạn</h2>
                <div className="mt-6 flex gap-2 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {allQuizzes.map((singleQuiz, quizIndex) => (
                      <div key={quizIndex}>
                        <QuizCard singleQuiz={singleQuiz} />
                      </div>
                    ))}
                  </div>
                  {user.role === 'admin' && (
                    <div
                      onClick={() => router.push('/quiz-build')}
                      className=" cursor-pointer justify-center items-center rounded-[10px]
                     w-[230px] flex flex-col gap-2 border border-gray-100 bg-white p-4"
                    >
                      <Image
                        src={'/add-quiz.png'}
                        width={160}
                        height={160}
                        alt=""
                      />
                      <span className="select-none opacity-40">
                        Thêm mới Quiz
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="  h-96 flex flex-col gap-4 justify-center items-center">
            <h2 className="font-bold text-5xl">
              Learn 10x <span className="text-green-700">Faster!</span>
            </h2>
            <span className="text-xl font-light">
              Unlock Your Potential with Personalized Quizzes
            </span>
            <button
              onClick={() => {
                setUser((prevUser) => ({ ...prevUser, isLogged: true }));
              }}
              className="p-4 bg-green-700 text-white rounded-md"
            >
              Get Started Now!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizzesArea;