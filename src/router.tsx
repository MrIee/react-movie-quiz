import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { LayoutContainer } from './containers/LayoutContainer';
import { HomeContainer } from './containers/HomeContainer';
import { QuizContainer } from './containers/QuizContainer';
import { getQuizData, getMissingCastMemberQuizData } from './util/movie-api';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<LayoutContainer />}>
      <Route path="/" element={<HomeContainer />} />
      <Route
        path="/quiz"
        loader={getQuizData}
        element={<QuizContainer loadQuizData={getQuizData} />}
      />
      <Route
        path="/castmemberquiz"
        loader={getMissingCastMemberQuizData}
        element={<QuizContainer loadQuizData={getMissingCastMemberQuizData} />}
      />
    </Route>
  )
);
