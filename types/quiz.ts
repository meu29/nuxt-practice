export type Answer = string | number;

export type Question = {
    id: string;
    content: string;
    answer: Answer;
    candidates: Answer[];
}