export enum AppState {
  Welcome = "welcome",
  Loading = "loading",
  SwipingCategories = "swiping-categories",
  Matches = "matches",
  Recommendations = "recommendations",
}


export function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

