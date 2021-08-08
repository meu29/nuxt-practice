type State = {
    question_num: number;
}

export const state = () => {
    return {
        question_num: 0,
    }
}

export const getters = {
    question_num: (state: State): number => {
        return state.question_num;
    },
}

export const mutations = {
    changeSetting(state: State, payload: State) {
        /* payloadをそのまま代入({...payload}でも)だと値が書き換えられなかった */
        state.question_num = payload.question_num;
    }
}
