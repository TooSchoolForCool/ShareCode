export class Problem {
  id: number;
  name: string;
  desc: string;
  difficulty: string;
}

// 'freeze' indicates this object is a const, which cannot be change
// Thereby, DEFAULT_PROBLEM is a const variable
export const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: "",
  desc: "",
  difficulty: ""
});