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
  profile_path: string,
}

interface Credit {
  id: number,
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
const posterSizes = { w92: 0, w154: 1, w185: 2, w342: 3, w500: 4, w780: 5, original: 6 };
const castCount: number = 4;
const posterCount: number = 4;

let config: Config | null = null;

console.log('I SEE YOU!');
console.log('NO CHEATING!!!');
console.log("These logs are totally [still] only here for legitimate, non-cheaty, debugging purposes... ^_^'")

const getRandomNumberFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

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

const generateMovieTitle = (title: string, releaseDate: string): string => {
  const dateLength: number = 4;
  return `${title} (${releaseDate.slice(0, dateLength)})`;
};

const generatePosterURL = (posterPath: string, posterSize: string): string => {
  return `${config?.base_url}${posterSize}${posterPath}`
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
  const releaseYear = getRandomNumberFromRange(minYear, maxYear);

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
    const title = generateMovieTitle(randomMovie.title, randomMovie.release_date);
    console.log('==================================');
    console.log('Movie name:', title);

    return {
      id: randomMovie.id,
      poster_path: randomMovie.poster_path,
      title,
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
  const posters: Array<Poster> = [];

  credits.forEach((credit: Credit) => {
    if (credit.poster_path && posters.length < posterCount) {
      const url: string = credit.poster_path
        ? generatePosterURL(credit.poster_path, config?.poster_sizes[posterSizes.w342] as string)
        : '';

      const title = generateMovieTitle(credit.title, credit.release_date);

      posters.push({ url, title });
    }
  });

  const randomPosterIndex = Math.floor(Math.random() * posterCount);
  const isChosenMovieInPosters = posters.some((poster: Poster) => poster.title.indexOf(chosenMovie?.title as string) > -1);


  if (!isChosenMovieInPosters) {
    posters[randomPosterIndex] = {
      url: generatePosterURL(chosenMovie?.poster_path as string, config?.poster_sizes[posterSizes.w342] as string),
      title: chosenMovie?.title as string,
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

  const movieCast: Array<Actor> = await getMovieCast(movieData.id);

  if (movieCast.length === 0) {
    return null;
  }

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
    console.log('==================================');

    return {
      answer: randomCast.name,
      options: shuffle(options),
      posters,
    };
  }
}

const getRandomCastMember = async (actorId: number, movieId: number, cast: Array<Actor>): Promise<Actor> => {
  const actorCredits: Array<Credit> = await getActorCreditsSorted(actorId);
  let movieDetails: Credit | null = null;

  if (movieId) {
    const credits = actorCredits.filter((credit: Credit) => credit.id !== movieId);
    const randomCreditIndex = getRandomNumberFromRange(0, credits.length - 1);
    movieDetails = credits[randomCreditIndex];
  } else {
    const randomCreditIndex = getRandomNumberFromRange(0, actorCredits.length - 1);
    movieDetails = actorCredits[randomCreditIndex];
  }

  const movieCast: Array<Actor> = await getMovieCast(movieDetails.id);
  const actorIds: Array<number> = cast.map((actor: Actor) => actor.id);
  const movieCastFiltered: Array<Actor> = movieCast.filter((actor: Actor) => actorIds.indexOf(actor.id) === -1);
  const randomCastIndex = getRandomNumberFromRange(0, movieCastFiltered.length - 1);
  const randomCast: Actor = movieCastFiltered[randomCastIndex];
  return randomCast;
};

export const getMissingCastMemberQuizData = async (): Promise<QuizData> => {
  config = await getConfig();
  const movieData: Movie = await getDetailsOfRandomMovie();

  if (!movieData) {
    return null;
  }

  const movieCast: Array<Actor> = await getMovieCast(movieData.id);
  const actors: Array<Actor> = movieCast.slice(0, castCount + 1)
  const randomCastIndex: number = Math.floor(Math.random() * castCount);
  const answer: Actor = actors[randomCastIndex];
  actors.splice(randomCastIndex, 1);
  const options = new Array<Actor>;
  for (let i = 0; i < castCount - 1; i++) {
    const randomCast: Actor = await getRandomCastMember(actors[i].id, movieData.id, actors);
    options.push(randomCast);
  }
  options.push(answer);
  const posters = actors.map((actor: Actor) => ({
    url: generatePosterURL(actor.profile_path, config?.poster_sizes[posterSizes.w342] as string),
    title: actor.name,
  }));
  const formattedOptions = options.map((actor: Actor) => actor.name);

  console.log('options:', options);
  console.log('answer:', answer.name);
  console.log('==================================');

  return {
    title: movieData.title,
    answer: answer.name,
    options: shuffle(formattedOptions),
    posters,
  };
};
