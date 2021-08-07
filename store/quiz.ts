import { Question, Answer } from "./../types/quiz";

type State = {
    questions: Question[],
    user_answers: {[id: string]: Answer}
}

type Result = {
    id: string, 
    content: string;
    correct_answer: Answer, 
    user_answer: Answer
    correction: boolean
}

export const state = (): State => {
    return {
        questions: [],
        user_answers: {}
    }
}

const SECOND_ANSWERING_CHANCE = "-second-answering-chance";

/* ステートの値もしくはステートの値から算出された新しい値を参照するのに用いる(ステートの値を書き換えるのはダメ) */
export const getters = {
    questions: (state: State): Question[] => {
        return state.questions;
    },
    results: (state: State): Result[] => {
        let correction: boolean;
        return state.questions.map((question: Question) => {
            if (state.user_answers[question.id] === question.answer || state.user_answers[question.id + SECOND_ANSWERING_CHANCE] === question.answer) {
                correction = true;
            } else {
                correction = false;
            }
            return {id: question.id, content: question.content, correct_answer: question.answer, user_answer: state.user_answers[question.id], correction: correction}
        });
    }
}

/* ステートの値を書き換えるのに用いる(同期処理 非同期処理はアクションで扱う) */
export const mutations = {
    init: (state: State, questions: Question[]) => {
        state.questions = questions;
        state.user_answers = {}
    },
    answering: (state: State, payload: {id: string, user_answer: Answer}) => {
        if (state.user_answers[payload.id] === undefined) {
            state.user_answers[payload.id] = payload.user_answer;
        } else {
            state.user_answers[payload.id + SECOND_ANSWERING_CHANCE] = payload.user_answer;
        }
    },
    filtering: (state: State, id: string) => {
        state.questions = state.questions.map((question: Question) => {
            if (question.id == id) {
                question.candidates = question.candidates.filter((candidate: Answer, index: number) => candidate === question.answer || index % 2 == 0);
            }
            return question;
        });
    },
}

