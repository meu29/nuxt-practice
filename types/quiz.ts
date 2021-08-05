export type Answer = string | number;

export type Question = {
    qid: string;
    content: string;
    answer: Answer;
    candidates: Answer[];
}