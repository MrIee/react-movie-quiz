import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import clsx from 'clsx';
import '../assets/css/scoreBox.css';

export const ScoreBox = (): JSX.Element => {
  const score = useSelector((state: RootState) => state.quiz.score);
  const previousHighScore = useSelector((state: RootState) => state.quiz.previousHighScore);

  return (
    <div
      className={
        clsx(
          'score-box__text',
          score > previousHighScore && previousHighScore > 0 &&'tw-text-green-500'
        )}
    >
      Score: {score}
    </div>
  );
};
