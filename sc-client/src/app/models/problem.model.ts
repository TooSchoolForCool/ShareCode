export class Problem {
  id: number;
  name: string;
  desc: string;
  difficulty: string;
}

export const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: "",
  desc: "",
  difficulty: "Easy"
});