import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import clsx from 'clsx';
import '../assets/css/scoreBox.css';

export const ScoreBox = (): JSX.Element => {
  const score = useSelector((state: RootState) => state.quiz.score);
  const highScore = useSelector((state: RootState) => state.quiz.highScore);

  return (
    <div
      className={
        clsx(
          'score-box__text',
          score > highScore && highScore > 0 &&'tw-text-green-600'
        )}
    >
      Score: {score}
    </div>
  );
};
