import { Question, Answer } from "./../types/quiz";

type State = {
    questions: Question[]
}

export const state = (): State => {
    return {
        questions: []
    }
}

export const getters = {
    questions: (state: State): Question[] => {
        return state.questions;
    }
}

export const mutations = {
    renewQuestions: (state: State, questions: Question[]) => {
        state.questions = questions;
    },
    filtering: (state: State, id: string) => {
        state.questions = state.questions.map((question: Question) => {
            if (question.id == id) {
                question.candidates = question.candidates.filter((candidate: Answer, index: number) => candidate === question.answer || index % 2 == 0);
            }
            return question;
        });
    }
}

