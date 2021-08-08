<template>
    <v-container>
        <v-row justify="center" class="mb-8">
            <v-col cols="2">
                <h2>結果</h2>
            </v-col>
        </v-row>
        <v-simple-table class="mb-8">
            <thead>
                <tr>
                    <th>問題</th>
                    <th>あなたの回答</th>
                    <th>正解</th>
                    <th>正誤</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="result in $store.getters['quiz/results']" v-bind:key="result.id">
                    <td>{{result.content}}</td>
                    <td>{{result.user_answer}}</td>
                    <td>{{result.correct_answer}}</td>
                    <td>{{result.correction === true ? "○" : "✕"}}</td>
                </tr>
            </tbody>
        </v-simple-table>
        <v-row justify="center">
            <v-col cols="2">
                <v-btn color="primary" v-on:click="$router.push('/')">再挑戦</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">

import Vue from "vue";

export default Vue.extend<{}, {}, {}, {}>({

    beforeCreate() {
        if (this.$store.getters["quiz/questions"].length === 0) {
            this.$router.push("/");
        }
    },

});

</script>