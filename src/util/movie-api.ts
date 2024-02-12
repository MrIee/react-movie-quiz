import axios from 'axios';
import { Poster, QuizData } from './interfaces';
import { AxiosResponse } from 'axios';
import shuffle from 'lodash.shuffle';

interface Config {
  base_url: string;
  poster_sizes: Array<string>;
}

interface Actor {
  id: number,
  name: string,
}

interface Credit {
  poster_path: string;
  title: string;
  release_date: string;
  popularity: number;
}

interface MovieDetail extends Credit {
  id: number;
}

type Movie = MovieDetail | null;

const api_key = '66fe0a2e16a8aa847afb6fcf8a9eb750';
const baseURL = 'https://api.themoviedb.org/3';
const statusSuccess = 200;
const castCount: number = 4;
const posterCount: number = 4;

let config: Config | null = null;

console.log('I SEE YOU!');
console.log('NO CHEATING!!!');
console.log("These logs are totally [still] only here for legitimate, non-cheaty, debugging purposes... ^_^'")

const getConfig = async (): Promise<Config | null> => {
  const res: AxiosResponse = await axios.get(`${baseURL}/configuration`, {
    params: { api_key },
  });

  if (res.status === statusSuccess) {
    return res.data.images;
  } else {
    return null;
  }
};

const getDetailsOfRandomMovie = async (): Promise<Movie> => {
  const maxPageCount = 5;
  const pageSize = 20;
  const randomPage = Math.floor(Math.random() * maxPageCount) + 1;
  const randomMovieIndex = Math.floor(Math.random() * pageSize);
  const voteAverage = 6;
  const language = 'en-us';
  const releaseType = '1|2|3|4|5';
  const runTime = 60;
  const minYear = 1990;
  const maxYear = new Date().getFullYear() - 1;
  const releaseYear = Math.floor(Math.random() * (maxYear - minYear + 1) + minYear);

  const res: AxiosResponse = await axios.get(`${baseURL}/discover/movie`, {
    params: {
      include_adult: false,
      include_video: false,
      language,
      page: randomPage,
      primary_release_year: releaseYear,
      with_original_language: 'en',
      with_release_type: releaseType,
      'vote_average.gte': voteAverage,
      'with_runtime.gte': runTime,
      api_key,
    },
  });

  const { status, data } = res;

  if (status === statusSuccess) {
    const randomMovie = data.results[randomMovieIndex];
    console.log('==================================');
    console.log('Movie name:', `${randomMovie.title} (${randomMovie.release_date.slice(0, 4)})`);

    return {
      id: randomMovie.id,
      poster_path: randomMovie.poster_path,
      title: randomMovie.title,
      release_date: randomMovie.release_date,
      popularity: randomMovie.popularity,
    };
  }

  return null;
};

const getMovieCast = async (id: number | undefined): Promise<Array<Actor>> => {
  const minCastCount = 4;
  const res: AxiosResponse = await axios.get(`${baseURL}/movie/${id}/credits`, {
    params: { api_key },
  });

  const { status, data } = res;

  if (status === 200) {
    if (data.cast.length >= minCastCount) {
      return data.cast;
    } else {
      getQuizData();
    }
  }

  return [];
};

const getActorCreditsSorted = async (id: number): Promise<Array<Credit>> => {
  const res: AxiosResponse = await axios.get(`${baseURL}/person/${id}/movie_credits`, {
    params: { api_key },
  });

  const { status, data } = res;

  if (status === 200) {
    const creditsSorted = data.cast.sort((a: Credit, b: Credit) => {
      if (a.popularity > b.popularity) {
        return -1;
      } else if (b.popularity > a.popularity) {
        return 1;
      }

      return 0;
    });

    return creditsSorted;
  }

  return [];
};

const generatePosterArray = (chosenMovie: Movie, credits: Array<Credit>): Array<Poster> => {
  const posterSizes = { w92: 0, w154: 1, w185: 2, w342: 3, w500: 4, w780: 5, original: 6 };
  const dateLength: number = 4;
  const posters: Array<Poster> = [];

  const generatePosterURL = (posterPath: string): string => {
    return `${config?.base_url}${config?.poster_sizes[posterSizes.w342]}${posterPath}`
  };

  const generateMovieTitle = (title: string, releaseDate: string): string => {
    return `${title} (${releaseDate.slice(0, dateLength)})`;
  };

  credits.forEach((credit: Credit) => {
    if (credit.poster_path && posters.length < posterCount) {
      const url: string = credit.poster_path
        ? generatePosterURL(credit.poster_path)
        : '';

      const title = generateMovieTitle(credit.title, credit.release_date);

      posters.push({ url, title });
    }
  });

  const randomPosterIndex = Math.floor(Math.random() * posterCount);
  const isChosenMovieInPosters = posters.some((poster: Poster) => poster.title.indexOf(chosenMovie?.title as string) > -1);


  if (!isChosenMovieInPosters) {
    posters[randomPosterIndex] = {
      url: generatePosterURL(chosenMovie?.poster_path as string),
      title: generateMovieTitle(chosenMovie?.title as string, chosenMovie?.release_date as string),
    };
  }

  return posters;
};

export const getQuizData = async (): Promise<QuizData> => {
  config = await getConfig();
  const movieData: Movie = await getDetailsOfRandomMovie();

  if (!movieData) {
    return null;
  }

  const movieCast: Array<Actor> = await getMovieCast(movieData?.id);
  const randomCastIndex: number = Math.floor(Math.random() * castCount);
  const randomCast: Actor = movieCast[randomCastIndex];
  const options: Array<string> = movieCast.slice(0, castCount).map((actor: Actor) => actor.name);
  const actorCredits: Array<Credit> = await getActorCreditsSorted(randomCast.id);

  if (actorCredits.length < posterCount) {
    return await getQuizData();
  } else {
    const posters: Array<Poster> = generatePosterArray(movieData, actorCredits);

    console.log('Answer:', randomCast.name);
    console.log('Options:', options);
    console.log('Posters:', posters);
    console.log('==================================');

    return {
      answer: randomCast.name,
      options: shuffle(options),
      posters,
    };
  }
}

const getBlankQuizData = (): QuizData => {
  const options: Array<string> = [];
  const posters: Array<Poster> = [];

  for (let i = 0; i < castCount; i++) {
    options.push('');
  }

  for (let i = 0; i < posterCount; i++) {
    posters.push({ url: '', title: '' });
  }

  return { answer: '', options, posters };
};

export const blankQuizData: QuizData = getBlankQuizData();
