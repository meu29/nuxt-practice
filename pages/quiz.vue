<template>
    <v-container>
        <v-container>
            <p class="font-weight-bold">第{{index + 1}}問</p>
            {{questions[index].content}}
        </v-container>
        <!-- forコンテナにflexを設定しても横並びにはならない -->
        <v-container class="d-flex flex-row mb-6">
            <v-container v-for="candidate in questions[index].candidates" v-bind:key="candidate">
                <v-btn color="primary" @click="answering(candidate)">{{candidate}}</v-btn>
            </v-container>
        </v-container>
        <v-container v-if="judge === '正解' || judge === '不正解'">
            <p>{{judge}}</p>
            <v-btn @click="proceed()">次の問題</v-btn>
            <v-btn v-if="finish === true" @click="replay()">再挑戦</v-btn>
        </v-container>
    </v-container>
</template>

<script lang="ts">

import { Question, Answer } from "./../types/quiz";

export default {

    async asyncData(context): Promise<{questions: Question[], index: number, correct_answer_count: number, judge: null | "正解" | "不正解", finish: boolean}> {

        const res = await context.$axios.get("http://localhost:3000/api/quiz");

        return {
            questions: res.data.questions,
            index: 0,
            correct_answer_count: 0,
            judge: null,
            finish: false
        }

    },

    methods: {

        answering(user_answer: Answer) {

            if (user_answer == this.$data.questions[this.$data.index].answer) {
                this.$data.judge = "正解";
                this.$data.correct_answer_count += 1;
            } else {
                this.$data.judge = "不正解"
            }
            
        },

        proceed() {

            this.$data.judge = null;

            if (this.$data.index == this.$data.questions.length - 1) {
                alert(this.$data.questions.length + "問中" + this.$data.correct_answer_count + "問正解");
                this.$data.finish = true;
            } else {
                this.$data.index += 1;
            }

        },

        /* watchQueryのようなものでdata.finishtrue -> falseを監視しasyncDataを再実行できないか */
        replay() {

        }

    }

}

</script>