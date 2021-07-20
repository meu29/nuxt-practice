export type App = {
    id: string
    name: string
    created: Date
}

type State = {
    app: App | null
}

export const state = (): State => {
    return {
        app: null
    }
};

export const getters = {

    app(state: State): App {
        return state.app as App;
    }

}

export const mutations = {

    /* Reduxと異なり既存のステートを直接編集する */
    setApp(state: State, app: App) {
        state.app = app;
    },
    releaseApp(state: State) {
        state.app = null
    }

}