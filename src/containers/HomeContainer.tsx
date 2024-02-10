import { useState, MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import '../assets/css/home.css';

export const HomeContainer = (): JSX.Element => {
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const highScore = useSelector((state: RootState) => state.quiz.highScore);


  const onClickStartQuiz = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (isLoadingQuiz) {
      e.preventDefault();
    }

    setIsLoadingQuiz(() => true);
  };

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-mt-10">
      <h1 className="tw-mb-8">Movie Quiz</h1>
      <div className="tw-flex tw-flex-col tw-items-center">
        <p className="tw-py-3">
          Each question has 5 random movie posters and 4 actors to chose from.
        </p>
        <p className="tw-pb-3">Can you tell which actor starred in all 5 movies?</p>
        <strong className="tw-inline-block tw-mb-3 tw-text-lg">High Score: {highScore}</strong>
        <NavLink className="menu__button" to="/quiz" onClick={(e) => onClickStartQuiz(e)}>
          { isLoadingQuiz ? 'Loading Quiz...' : 'Start' }
        </NavLink>
      </div>
    </div>
  );
};
