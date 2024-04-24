export interface Poster {
  url: string;
  title: string;
}

export interface Quiz {
  title?: string;
  answer: string;
  options: Array<string>;
  posters: Array<Poster>;
}

export type QuizData = Quiz | null;
