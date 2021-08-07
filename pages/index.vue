<template>
    <v-container v-if="$store.getters['quiz/questions'].length > 0">
        <!-- v-rowは行 v-colは列 -->
        <v-row>
            <v-col>
                <p class="font-weight-bold">第{{index + 1}}問</p>
                <p>{{$store.getters["quiz/questions"][index].content}}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3" v-for="candidate in $store.getters['quiz/questions'][index].candidates" v-bind:key="candidate">
                <v-card @click="getNextQuestion(candidate)" width="300" align="center">
                    <v-card-title class="justify-center">{{candidate}}</v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <p>{{message}}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <p>アクション</p>
                <p>各アクションはそれぞれ1回ずつ使用できます</p>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col>
                <v-btn @click="filtering()" v-bind:color="actions.filter === true ? 'error' : ''" v-bind:disabled="actions.filter === true ? false : true">絞り込み</v-btn>
            </v-col>
            <v-col>
                <v-btn @click="getSecondChance()" v-bind:color="actions.chance === 'unused' ? 'error' : ''" v-bind:disabled="actions.chance === 'unused' ? false : true">セカンドチャンス</v-btn>
            </v-col>
            <v-col>
                <v-btn @click="getHints()" v-bind:color="actions.hint === true ? 'error' : ''" v-bind:disabled="actions.hint === true ? false : true">他のプレイヤーからヒントをもらう</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">

type Datas = {
    index: number;
    message: string;
    actions: {
        filter: boolean,
        chance: "unused" | "using" | "used",
        hint: boolean
    }
}

type Methods = {
    getNextQuestion(user_answer: Answer): void;
    filtering(): void;
    getSecondChance(): void;
    getHints(): void;
}

import Vue from "vue";
import { Answer } from "../types/quiz";

const initData: Datas = {
    index: 0,
    message: "",
    actions: {
        filter: true,
        chance: "unused",
        hint: true
    }
}

export default Vue.extend<Datas, Methods, {}, {}>({

    /* nuxtjs固有のライフサイクルに属するメソッド vueのライフサイクルメソッドよりも先に実行される */
    async fetch() {
        const res = await this.$axios.get("http://localhost:3000/api/quiz");
        this.$store.commit("quiz/init", res.data.questions);
    },

    /* fetchメソッドは他のページから遷移してきたときは実行されないため */
    mounted() {
        this.$data.index = initData.index;
        this.$data.message = initData.message;
        this.$data.actions = initData.actions;
        this.$fetch();
    },

    data() {
        return initData;
    },

    methods: {

        getNextQuestion(user_answer: Answer) {
            if (this.$data.actions.chance === "using") {
                this.$data.message = "あと1回回答できます";
            }
            this.$store.commit("quiz/answering", {id: this.$store.getters["quiz/questions"][this.$data.index].id, user_answer: user_answer})
            this.$data.message = "";
            this.$data.index += 1;
        },

        filtering() {
            this.$data.actions.filter = false;
            this.$store.commit("quiz/filtering", this.$store.getters["quiz/questions"][this.$data.index].id);
        },

        getSecondChance() {
            this.$data.actions.chance = "using";
            this.$data.message = "この問題は2回まで回答できます";
        },

        async getHints() {
            const res = await this.$axios.get(`http://localhost:3000/api/quiz/hint?id=${this.$store.getters["quiz/questions"][this.$data.index].id}`);
            this.$data.message = JSON.stringify(res.data.hints);
            this.$data.actions.hint = false;
        }

    },

    /* 値の変更を検知 */
    watch: {
        /* アロー関数はダメ */
        $store: function () {
            if (Object.keys(this.$store.getters["quiz/user_answeers"]).length === this.$store.getters["quiz/questions"].length) {
                this.$router.push("/result");
            }
        },
    }

});

</script>