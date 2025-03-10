'use client';

import React, { useState, useEffect } from 'react';
import QuizBuildNav from '../Components/QuizBuildPage/QuizBuildNav';
import QuizBuildTitle from '../Components/QuizBuildPage/QuizBuildTitle';
import QuizBuildQuestions from '../Components/QuizBuildPage/QuizBuildQuestions';
import { v4 as uuidv4 } from 'uuid';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';
import IconsComponents from '../Components/QuizBuildPage/IconsComponents';
import useGlobalContextProvider from '../ContextApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
function Page(props) {
  const prefixes = ['A', 'B', 'C', 'D'];
  const { selectedIconObject, selectedQuizObject } = useGlobalContextProvider();
  const { selectedIcon } = selectedIconObject;
  const { selectedQuiz } = selectedQuizObject;
  const [focusFirst, setFocusFirst] = useState(true);
  const router = useRouter();
  const [quizQuestions, setQuizQuestions] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz.quizQuestions;
    } else {
      return [
        {
          id: uuidv4(),
          mainQuestion: '',
          choices: prefixes.slice(0, 2).map((prefix) => prefix + '. '),
          correctAnswer: '',
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
      ];
    }
  });

  const [newQuiz, setNewQuiz] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz;
    } else {
      return {
        _id: '',
        icon: selectedIcon.faIcon,
        quizTitle: '',
        quizQuestions: quizQuestions,
      };
    }
  });

  console.log(newQuiz);

  useEffect(() => {
    setNewQuiz((prevQuiz) => ({
      ...prevQuiz,
      icon: selectedIcon.faIcon,
      quizQuestions: quizQuestions,
    }));
  }, [quizQuestions, selectedIcon.faIcon]);

  function onChangeQuizTitle(text) {
    setNewQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle: text }));
  }

  const quizNavBarProps = {
    quizQuestions,
    newQuiz,
    setNewQuiz,
  };

  const quizTitleProps = {
    focusProp: { focus: focusFirst, setFocusFirst },
    onChangeQuizTitle,
  };

  const quizQuestionsProps = {
    focusProp: { focus: !focusFirst, setFocusFirst },
    quizQuestions,
    setQuizQuestions,
  };

  return (
    <div className=" relative mx-16 poppins">
      <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-green-700 hover:underline mb-4"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Quay lại
                  </button>
      <IconsComponents />
      <QuizBuildNav {...quizNavBarProps} />
      <QuizBuildTitle {...quizTitleProps} />
      <QuizBuildQuestions {...quizQuestionsProps} />
    </div>
  );
}

export default Page;
