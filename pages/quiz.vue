<template>
    <v-container>
        <!-- v-rowは縦並び -->
        <v-row>
            <p class="font-weight-bold">第{{index + 1}}問</p>
            <p>{{$store.getters["quiz/questions"][index].content}}</p>
        </v-row>
        <v-row>
            <!-- v-colは横並び -->
            <v-col v-for="candidate in $store.getters['quiz/questions'][index].candidates" v-bind:key="candidate">
                <v-btn color="primary" @click="checkAnswer(candidate)">{{candidate}}</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <p>{{message}}</p>
        </v-row>
        <v-row v-if="judge !== null">
            <p>{{judge}}</p>
            <p>正解は{{$store.getters["quiz/questions"][this.$data.index].answer}}でした</p>
            <v-btn @click="getNextQuestion()">次の問題</v-btn>
            <v-btn v-if="finish === true" @click="replay()">再挑戦</v-btn>
        </v-row>
        <v-row>
            <v-row>
                <p>アクション</p>
                <p>各アクションはそれぞれ1回ずつ使用できます</p>
            </v-row>
            <v-col>
                <v-btn @click="filtering()" v-bind:color="actions.filter === true ? 'error' : ''" v-bind:disabled="actions.filter === true ? false : true">絞り込み</v-btn>
                <v-btn @click="getSecondChance()" v-bind:color="actions.chance === 'unused' ? 'error' : ''" v-bind:disabled="actions.chance === 'unused' ? false : true">セカンドチャンス</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">

type Datas = {
    index: number;
    correct_answer_count: number;
    judge: null | "正解" | "不正解"
    finish: boolean;
    message: string;
    actions: {
        filter: boolean,
        chance: "unused" | "using" | "used" 
    }
}

const initDatas: Datas = {
    index: 0,
    correct_answer_count: 0,
    judge: null,
    finish: false,
    message: "",
    actions: {
        filter: true,
        chance: "unused"
    }
}

type Methods = {
    checkAnswer(user_answer: string): void;
    getNextQuestion(): void;
    replay(): void;
    filtering(): void;
    getSecondChance(): void;
}

import Vue from "vue";
import { Answer } from "./../types/quiz";

export default Vue.extend<Datas, Methods, {}, {}>({

    /* ここでthis.$data.<プロパティ>に値を入れると値が消えてしまう(公式ではできている) */
    async fetch() {
        const res = await this.$axios.get("http://localhost:3000/api/quiz");
        this.$store.commit("quiz/renewQuestions", res.data.questions);
    },

    data() {
        return initDatas;
    },

    methods: {

        checkAnswer(user_answer: Answer) {

            if (this.$data.judge !== null) {
                this.$data.message = "既に回答済みです";
            } else if (user_answer == this.$store.getters["quiz/questions"][this.$data.index].answer) {
                this.$data.judge = "正解";
                this.$data.correct_answer_count += 1;
            } else {
                if (this.$data.actions.chance === "using") {
                    this.$data.actions.chance = "used";
                    this.$data.message = "あと1回だけ回答できます";
                } else  {
                    this.$data.judge = "不正解";
                    this.$data.message = "";
                }
            }         
        },

        getNextQuestion() {

            this.$data.judge = null;
            this.$data.message = "";

            if (this.$data.index === this.$store.getters["quiz/questions"].length - 1) {
                this.$data.message = this.$store.getters["quiz/questions"].length + "問中" + this.$data.correct_answer_count + "問正解";
                this.$data.finish = true;
            } else {
                this.$data.index += 1;
            }

        },

        /* watchQueryのようなものでdata.finishtrue -> falseを監視しasyncDataを再実行できないか */
        replay() {
            /* Object.keys().forEach((key: string) => ..)で更新しようとすると型関係のエラーが出た */
            this.$data.index = initDatas.index;
            this.$data.correct_answer_count = initDatas.correct_answer_count;
            this.$data.judge = initDatas.judge;
            this.$data.finish = initDatas.finish;
            this.$data.message = initDatas.message;
            this.$data.actions = initDatas.actions;
            /* fetch()を先に実行すると残りの処理が実行されない(ライフサイクルの問題?) */
            this.$fetch();
        },

        filtering() {
            if (this.$data.judge !== null) {
                alert("既に回答済みです");
            } else { 
                this.$data.actions.filter = false;
                this.$store.commit("quiz/filtering", this.$store.getters["quiz/questions"][this.$data.index].id);
            }
        },

        getSecondChance() {
            if (this.$data.judge !== null) {
                alert("既に回答済みです");
            } else {
                this.$data.actions.chance = "using";
                this.$data.message = "この問題は2回まで回答できます";
            }
        }

    },

});

</script>