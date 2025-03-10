'use client';

import React, { useEffect, useState } from 'react';
import useGlobalContextProvider from '@/app/ContextApi';
import toast, { Toaster } from 'react-hot-toast';
import SaveQuizResult from './SaveQuizResult';
import ScoreComponent from './ScoreComponent';

function QuizStartQuestions({ onUpdateTime }) {
  const time = 30;
  const { quizToStartObject, allQuizzes, setAllQuizzes, userObject } =
    useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const { quizQuestions } = selectQuizToStart;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [indexOfQuizSelected, setIndexOfQuizSelected] = useState(null);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const { user, setUser } = userObject;

  const [timer, setTimer] = useState(time);
  let interval;

  function startTimer() {
    clearInterval(interval);
    setTimer(time);

    interval = setInterval(() => {
      setTimer((currentTime) => {
        onUpdateTime(currentTime);
        if (currentTime === 0) {
          clearInterval(interval);
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);
  }

  async function saveDataIntoDB() {
    try {
      const id = selectQuizToStart._id;
      // Get the _id of the quiz
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/quizzes?id=${id}`, // Include the id as a query parameter
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            updateQuizQuestions: allQuizzes[indexOfQuizSelected].quizQuestions,
          }),
        },
      );
      console.log(allQuizzes[indexOfQuizSelected].quizQuestions);
      if (!res.ok) {
        toast.error('Something went wrong while saving...');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(indexOfQuizSelected);

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timer === 0 && !isQuizEnded) {
      // Updating the allQuizzes
      const currentQuizzes = [...allQuizzes];
      currentQuizzes[indexOfQuizSelected].quizQuestions[
        currentQuestionIndex
      ].statistics.totalAttempts += 1;
      currentQuizzes[indexOfQuizSelected].quizQuestions[
        currentQuestionIndex
      ].statistics.incorrectAttempts += 1;

      setAllQuizzes(currentQuizzes);
      // --------------------
      if (currentQuestionIndex !== quizQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((current) => {
            return current + 1;
          });
        }, 1000);
      } else {
        setIsQuizEnded(true);
        clearInterval(interval);
      }
    }
  }, [ timer,
    isQuizEnded,
    allQuizzes,
    currentQuestionIndex,
    indexOfQuizSelected,
    interval,
    quizQuestions.length,
    setAllQuizzes,]);

  // With the useEffect every time the component is loaded up
  //we need to get the index of the quiz we selected inside
  // the allquizzes array to update it when we choose tne answer
  //
  useEffect(() => {
    const quizIndexFound = allQuizzes.findIndex(
      (quiz) => quiz._id === selectQuizToStart._id,
    );
    setIndexOfQuizSelected(quizIndexFound);
  }, []);

  useEffect(() => {
    if (isQuizEnded) {
      // renitialize all answers to -1
      quizQuestions.forEach((quizQuestion) => {
        quizQuestion.answeredResult = -1;
      });
      saveDataIntoDB();
    }
  }, [isQuizEnded, quizQuestions, saveDataIntoDB]);

  function selectChoiceFunction(choiceIndexClicked) {
    // update the selectedChoice variable state
    setSelectedChoice(choiceIndexClicked);
    //---------------------------------------

    //We update the answerResult proprety in the allQuizzes array
    const currentAllQuizzes = [...allQuizzes];

    currentAllQuizzes[indexOfQuizSelected].quizQuestions[
      currentQuestionIndex
    ].answeredResult = choiceIndexClicked;

    setAllQuizzes(currentAllQuizzes);
    //------------------------------------
  }

  function moveToTheNextQuestion() {
    // Check if the we did select the an answer by using the answerResult proprety if
    //it's still equal to -1
    if (
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .answeredResult === -1
    ) {
      toast.error('please select an answer');
      return;
    }

    // Update the statistics of the question
    // ======================================
    // update the total Attemptes:
    allQuizzes[indexOfQuizSelected].quizQuestions[
      currentQuestionIndex
    ].statistics.totalAttempts += 1;

    // if the answer is incorrect
    if (
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .answeredResult !==
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .correctAnswer
    ) {
      // update the incorrect attemptes
      allQuizzes[indexOfQuizSelected].quizQuestions[
        currentQuestionIndex
      ].statistics.incorrectAttempts += 1;
      toast.error('Incorrect Answer!');

      // if the answer is incorrect, go to the next question only
      // if we are not at the last question
      if (currentQuestionIndex != quizQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((current) => current + 1);
          // initialize the choice after going to the next question
          setSelectedChoice(null);
        }, 1200);
      } else {
        // if we select the wrong choice and we are at the end of the question
        // end the quiz
        setTimer(0);
        clearInterval(interval);
        setIsQuizEnded(true);
      }

      return;
    }

    // update the correct attemptes
    allQuizzes[indexOfQuizSelected].quizQuestions[
      currentQuestionIndex
    ].statistics.correctAttempts += 1;
    // Increment the score by 1
    setScore((prevState) => prevState + 1);

    toast.success('Awesome!');
    addExperience();

    // This will stop the timer and end the quiz when currentQuestionIndex is the last
    // and only if we select the correct otherwise the timer is still running
    if (
      currentQuestionIndex === quizQuestions.length - 1 &&
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .answeredResult ===
        allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
          .correctAnswer
    ) {
      setTimer(0);
      clearInterval(interval);
      setIsQuizEnded(true);
      return;
    }

    // increment the currentQuestionIndex by 1 to go to the next question
    setTimeout(() => {
      setCurrentQuestionIndex((current) => current + 1);
      // initialize the choice after going to the next question
      setSelectedChoice(null);
    }, 2000);
  }

  async function addExperience() {
    const userCopy = user;
    console.log(userCopy);
    userCopy.experience += 1;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/user?id=${userCopy._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ updateUser: userCopy }),
        },
      );

      if (!response.ok) {
        toast.error('Something went wrong...');
        throw new Error('fetching failed...');
      }

      setUser(userCopy);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative poppins rounded-sm m-9 w-9/12  ">
      <Toaster
        toastOptions={{
          // Define default options
          className: '',
          duration: 1500,
          style: {
            padding: '12px',
          },
        }}
      />
      {/* The Question Part */}
      <div className="flex   items-center gap-2">
        <div className="bg-green-700 flex  justify-center items-center rounded-md w-11 h-11 text-white p-3">
          {currentQuestionIndex + 1}
        </div>
        <p>{quizQuestions[currentQuestionIndex].mainQuestion}</p>
      </div>
      {/* The Answers Part */}
      <div className="mt-7 flex flex-col gap-2">
        {quizQuestions[currentQuestionIndex].choices.map(
          (choice, indexChoice) => (
            <div
              key={indexChoice}
              onClick={() => {
                selectChoiceFunction(indexChoice);
              }}
              className={`p-3 ml-11 w-10/12 border border-green-700 rounded-md
               hover:bg-green-700 hover:text-white transition-all select-none ${
                 selectedChoice === indexChoice
                   ? 'bg-green-700 text-white'
                   : 'bg-white'
               }`}
            >
              {choice}
            </div>
          ),
        )}
      </div>
      {/* Submit Button */}
      <div className="flex justify-end mt-7  ">
        <button
          onClick={() => {
            moveToTheNextQuestion();
          }}
          disabled={isQuizEnded ? true : false}
          className={`p-2 px-5 text-[15px] text-white rounded-md bg-green-700 mr-[70px] ${
            isQuizEnded ? 'opacity-60' : 'opacity-100'
          }`}
        >
          Submit
        </button>
      </div>
      {isQuizEnded && (
        <>
          <SaveQuizResult
            userId={user._id}
            quizId={selectQuizToStart._id}
            score={score}
            answers={quizQuestions.map((question) => ({
              questionId: question.id,
              selectedAnswer: question.answeredResult,
              isCorrect: question.answeredResult === question.correctAnswer,
            }))}
          />
          <ScoreComponent
            quizStartParentProps={{
              setIsQuizEnded,
              setIndexOfQuizSelected,
              setCurrentQuestionIndex,
              setSelectedChoice,
              score,
              setScore,
            }}
          />
        </>
      )}
    </div>
  );
}

export default QuizStartQuestions;

