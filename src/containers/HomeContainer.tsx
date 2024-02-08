import { useState, MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/home.css';

export const HomeContainer = (): JSX.Element => {
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  const onClickStartQuiz = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (isLoadingQuiz) {
      e.preventDefault();
    }

    setIsLoadingQuiz(() => true);
  };

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-mt-10">
      <h1 className="tw-mb-8">Movie Quiz</h1>
      <div className="tw-flex tw-flex-col">
        <NavLink className="menu__button tw-mb-3" to="/quiz" onClick={(e) => onClickStartQuiz(e)}>
          { isLoadingQuiz ? 'Loading Quiz...' : 'Start' }
        </NavLink>
      </div>
    </div>
  );
};
