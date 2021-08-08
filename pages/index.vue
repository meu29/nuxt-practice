<template>
    <v-container>
        <v-row justify="center" class="mb-8">
            <v-col cols="2">
                <v-img height="200" src="./top1.png"></v-img>
            </v-col>
            <v-col cols="2">
                <v-img height="200" src="./top2.png"></v-img>
            </v-col>
        </v-row>
        <v-row justify="center" class="mb-8">
            <h1>雑学クイズ</h1>
        </v-row>
        <v-row justify="center" class="mb-8">
            <v-col cols="5">
                <v-btn-toggle v-model="question_num">
                    <v-btn value="5">5問出題</v-btn>
                    <v-btn value="10">10問出題</v-btn>
                    <v-btn value="20">20問出題</v-btn>
                    <v-btn value="30">30問出題</v-btn>
                    <v-btn value="50">50問出題</v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        <v-row justify="center" class="mb-8">
            <v-col cols="2">
                <v-btn @click="startQuiz()" color="primary">クイズを始める</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">

import Vue from "vue";

type Datas = {
    question_num: number
}

type Methods = {
    startQuiz(): void;
}

export default Vue.extend<Datas, Methods ,{} , {}>({

    data() {
        return {
            question_num: 5,
        }
    },

    methods: {
        startQuiz() {
            this.$store.commit("setting/changeSetting", {question_num: Number(this.$data.question_num), time_limit: this.$data.time_limit});
            this.$router.push("/quiz");
        }
    }

});

</script>