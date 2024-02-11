import { useState, useEffect, MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { setPreviousHighScore, resetScore } from '../redux/features/quiz/quizSlice';
import '../assets/css/home.css';

export const HomeContainer = (): JSX.Element => {
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const highScore = useSelector((state: RootState) => state.quiz.previousHighScore);
  const dispatch = useDispatch();

  useEffect(() => {
    const score: string | 0 = localStorage.getItem('HIGH_SCORE') || 0;
    dispatch(setPreviousHighScore(JSON.parse(score as string)));
    dispatch(resetScore());
  });

  const onClickStartQuiz = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (isLoadingQuiz) {
      e.preventDefault();
    }

    setIsLoadingQuiz(() => true);
  };

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-mt-10">
      <h1 className="tw-mb-8">Movie Quiz</h1>
      <div className="home__quiz-description">
        <p className="tw-mb-3">Can you tell which actor starred in all 5 movies?</p>
        <p className="tw-mb-3">
          Each question has 5 random movie posters and 4 actors to chose from.
        </p>
        <p className="tw-mb-3">
          Unlike most quizzes, this one doesn't end. Keep going and score the highest points you can!
          For each question you get right, you will score 2 points. Each incorrect guess will simply
          deduct 1 point from your score and you cannot go below 0. Have fun!
        </p>
        <strong className="tw-self-center tw-mb-3 tw-text-lg">High Score: {highScore}</strong>
        <NavLink className="home__button" to="/quiz" onClick={(e) => onClickStartQuiz(e)}>
          { isLoadingQuiz ? 'Loading Quiz...' : 'Start' }
        </NavLink>
      </div>
    </div>
  );
};
