import { useState, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { incrementScoreCorrect, incrementScoreWrong } from '../redux/features/quiz/quizSlice';
import { ScoreBox } from '../components/ScoreBox';
import { getQuizData, blankQuizData } from '../util/movie-api';
import { Poster, QuizData } from '../util/interfaces';
import clsx from 'clsx';
import '../assets/css/quiz.css';

export const QuizContainer = (): JSX.Element => {
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizData, setQuizData] = useState(useLoaderData() as QuizData);
  const [isQuizDataLoading, setIsQuizDataLoading] = useState(false);
  const [nextQuestionBtnText, setNextQuestionBtnText] = useState('Next Question');
  const nextQuestionData = useRef(blankQuizData);
  const dispatch = useDispatch();

  const checkAnswer = (answer: string): void => {
    if (answer === quizData?.answer) {
      setIsAnswerCorrect(() => true);
      dispatch(incrementScoreCorrect());
    } else {
      setIsAnswerCorrect(() => false);
      dispatch(incrementScoreWrong());
    }

    setNextQuestionBtnText(() => 'Preparing next Question...');
  };

  const onClickAnswer = async (answer: string): Promise<void> => {
    if (!selectedAnswer) {
      setSelectedAnswer(() => answer);
      checkAnswer(answer);
      setIsQuizDataLoading(() => true);
      const data: QuizData = await getQuizData();
      nextQuestionData.current = data;
      setNextQuestionBtnText('Next Question');
      setIsQuizDataLoading(() => false);
    }
  };

  const getClassForSelectedAnswer = (actor: string): string => {
    if (selectedAnswer) {
      if (selectedAnswer === actor) {
        return isAnswerCorrect ? 'is-correct' : 'is-wrong';
      } else if (actor === quizData?.answer) {
        return 'is-correct';
      }
    }

    return '';
  }

  const generateNewQuestion = (): void => {
    if (isQuizDataLoading || !selectedAnswer) {
      return;
    }

    setSelectedAnswer(() => '');
    setQuizData(() => nextQuestionData.current);
  }

  return (
    <div className="tw-h-full tw-flex tw-flex-col tw-justify-center tw-relative">
      <ScoreBox />
      <div className="tw-flex tw-flex-wrap tw-my-auto">
        {quizData?.posters.map((poster: Poster, index: number) => {
          if (poster.url) {
            return (
              <img
                key={index}
                className="quiz__poster"
                src={poster.url}
                alt={poster.title}
              />
            )
          }

          return (
            <div key={index} className="quiz__poster quiz__poster--loading">
              <span className="tw-inline-block tw-mb-4">{poster.title}</span>
              <span>Poster Unavailable</span>
            </div>
          )
        })}
      </div>
      <div className={ clsx('quiz__options-container', isQuizDataLoading && 'is-loading')}>
        <div className="tw-h-2/3 tw-w-full tw-flex tw-flex-wrap">
          {
            quizData?.options.map((actor: string, index: number) => {
            return (
              <a
                key={index}
                className={clsx('quiz__option', getClassForSelectedAnswer(actor))}
                onClick={() => onClickAnswer(actor)}
              >
                {actor}
              </a>
            )})
          }
        </div>
        <button
          className={
            clsx(
              'quiz__button',
              !selectedAnswer && 'is-disabled',
            )}
          onClick={() => generateNewQuestion()}
        >
          {nextQuestionBtnText}
        </button>
      </div>
    </div>
  );
};
