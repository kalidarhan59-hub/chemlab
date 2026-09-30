export type ArticleTopic = 'kitchen' | 'home' | 'nature' | 'health' | 'industry' | 'kazakhstan';

export interface ArticleQuizQuestion {
  question: { kk: string; ru: string; en: string };
  options: { kk: string[]; ru: string[]; en: string[] };
  correctAnswer: number;
  explanation: { kk: string; ru: string; en: string };
}

export interface ArticleData {
  slug: string;
  topic: ArticleTopic;
  readingTime: number; // in minutes
  date: string;
  title: { kk: string; ru: string; en: string };
  summary: { kk: string; ru: string; en: string };
  coverSvgKey: string;
  body: { kk: string[]; ru: string[]; en: string[] };
  reaction?: {
    equation: string;
    type: { kk: string; ru: string; en: string };
    explanation: { kk: string[]; ru: string[]; en: string[] };
    balancerEquation?: string;
  };
  tryIt?: {
    title: { kk: string; ru: string; en: string };
    itemsNeeded: { kk: string[]; ru: string[]; en: string[] };
    steps: { kk: string[]; ru: string[]; en: string[] };
    result: { kk: string; ru: string; en: string };
    explanation: { kk: string; ru: string; en: string };
    safetyWarning: { kk: string; ru: string; en: string };
  };
  didYouKnow: { kk: string; ru: string; en: string };
  quiz: ArticleQuizQuestion[];
  relatedElements?: string[];
  relatedSection?: string;
}
