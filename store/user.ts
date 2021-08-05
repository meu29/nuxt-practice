type User = {
    id: string;
}

type State = {
    user: User | null
}

export const state = (): State => {
    return {
        user: null
    }
}

export const getters = {
    user(state: State): User | null {
        return state.user;
    }
}

export const mutations = {
    login: (state: State, user: User) => {
        state.user = user;
    },
    logout: (state: State) => {
        state.user = null;
    }
}