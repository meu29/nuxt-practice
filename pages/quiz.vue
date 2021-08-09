<template>
    <v-container v-if="$store.getters['quiz/questions'].length - 1 >= index">
        <!-- v-rowは行 v-colは列 -->
        <v-row class="mb-6">
            <v-col>
                <p class="font-weight-bold">第{{index + 1}}問</p>
                <p>{{$store.getters["quiz/questions"][index].content}}</p>
                <p>
                    <v-btn @click="filtering()" @mouseover="message.length === 0 || message == '回答を2つ提出することができます' ? message = '選択肢を半分に絞り込むことができます': message = message" @mouseleave="onMouseLeaveButton()" rounded v-bind:color="actions.filter === true ? 'error' : ''" v-bind:disabled="actions.filter === true ? false : true">絞り込み</v-btn>
                    <v-btn @click="useSecondChance()" @mouseover="message.length === 0 || message == '選択肢を半分に絞り込むことができます' ? message = '回答を2つ提出することができます': message = message" @mouseleave="onMouseLeaveButton()" rounded v-bind:color="actions.chance === 'unused' ? 'error' : ''" v-bind:disabled="actions.chance === 'unused' ? false : true">セカンドチャンス</v-btn>
                    <span>{{message}}</span>
                </p>
            </v-col>
        </v-row>
        <v-row class="mb-6">
            <v-col cols="3" v-for="candidate in $store.getters['quiz/questions'][index].candidates" v-bind:key="candidate">
                <v-card @click="getNextQuestion(candidate)" width="300" align="center">
                    <v-card-title class="justify-center">{{candidate}}</v-card-title>
                </v-card>
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
    }
}

type Methods = {
    onMouseLeaveButton(): void;
    getNextQuestion(user_answer: Answer): void;
    filtering(): void;
    useSecondChance(): void;
}

import Vue from "vue";
import { Answer } from "../types/quiz";

export default Vue.extend<Datas, Methods, {}, {}>({

    /* nuxtjs固有のライフサイクルに属するメソッド vueのライフサイクルメソッドよりも先に実行される */
    async fetch() {
        if (this.$store.getters["setting/question_num"] === 0) {
            this.$router.push("/");
        } else {
            const res = await this.$axios.get(`http://localhost:3000/api/quiz?num=${this.$store.getters["setting/question_num"]}`);
            this.$store.commit("quiz/init", res.data.questions);
        }
    },

    data() {
        return {
            index: 0,
            message: "",
            actions: {
                filter: true,
                chance: "unused",
            }
        }
    },

    methods: {

        onMouseLeaveButton() {
            if (this.$data.message === "選択肢を半分に絞り込むことができます" || this.$data.message === "回答を2つ提出することができます") {
                this.$data.message = "";
            }
        },

        getNextQuestion(user_answer: Answer) {
            if (this.$data.actions.chance === "using") {
                this.$data.message = "あと1回回答できます";
                this.$data.actions.chance = "used";
            } else {
                this.$store.commit("quiz/answering", {id: this.$store.getters["quiz/questions"][this.$data.index].id, user_answer: user_answer})
                this.$data.message = "";
                this.$data.index += 1;
            }
        },

        filtering() {
            this.$data.actions.filter = false;
            this.$store.commit("quiz/filtering", this.$store.getters["quiz/questions"][this.$data.index].id);
        },

        useSecondChance() {
            this.$data.actions.chance = "using";
            this.$data.message = "この問題は2回まで回答できます";
        },

    },

    /* 値の変更を検知 */
    watch: {
        /* アロー関数はダメ */
        index: function () {
            if (this.$data.index === this.$store.getters["quiz/questions"].length) {
                this.$router.push("/result");
            }
        },
    }

});

</script>