<template>
    <v-container>
        <v-simple-table>
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
        <v-btn color="primary" v-on:click="$router.push('/')">再挑戦</v-btn>
        <p>ヒントを投稿する</p>
        <!-- <option v-bind:value="item.id">item.content</>と同じ -->
        <v-select :items="$store.getters['quiz/results']" item-text="content" item-value="id" v-model="selected_id"></v-select>
        <v-text-field v-model="content"></v-text-field>
        <v-btn color="primary" v-on:click="sendHint()">送信</v-btn>
        <p>{{message}}</p>
    </v-container>
</template>

<script lang="ts">

import Vue from "vue";

type Datas = {
    selected_id: string;
    content: string;
    message: string;
}

type Methods = {
    sendHint(): void;
}

export default Vue.extend<Datas, Methods, {}, {}>({

    data() {
        return {
            selected_id: this.$store.getters["quiz/results"][0].id,
            content: "",
            message: ""
        }
    },

    beforeCreate() {
        if (this.$store.getters["quiz/questions"].length === 0) {
            this.$router.push("/");
        }
    },

    methods: {
        async sendHint() {
            try {
                await this.$axios.post("http://localhost:3000/api/quiz/hint", {question_id: this.$data.selected_id, content: this.$data.content});
                this.$data.message = "ヒントを送信しました";
            } catch (e) {
                console.log(e);
                this.$data.message = "サーバエラー";
            }
        }
    }

});

</script>