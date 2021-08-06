<template>
    <v-container>
        <v-container>
            <p class="font-weight-bold">新規登録 / ログイン</p>
        </v-container>
        <v-container>
            <v-form ref="form" lazy-validation>
                <!-- outlinedで四角いテキストエリア -->
                <v-text-field v-model="email" label="メールアドレス" :rules="[email_rules.noInput, email_rules.formatError]"></v-text-field>
                <v-text-field v-model="name" label="ユーザー名" :rules="[name_rules.noInput]" v-if="new_user === true"></v-text-field>
                <v-text-field v-model="password" label="パスワード" :rules="[password_rules.noInput]" :type="'password'"></v-text-field>
                <v-container>
                    <v-checkbox v-model="new_user" :label="'新規登録'"></v-checkbox>
                    <v-btn color="primary" @click="startQuiz(true)">{{new_user === true ? "入力内容を登録" : "ログイン"}}</v-btn>
                    <v-btn @click="startQuiz(false)">新規登録・ログインをせずに開始</v-btn>
                </v-container>
                <p>登録するとスコアを記録できます</p>
            </v-form>
        </v-container>
    </v-container>
</template>

<script lang="ts">

import Vue from "vue";

/* バリデーションルール */
/* 条件に一致していればtrueを返し、そうでなければエラーメッセージを返す(falseは返すのか不明)。*/
type Rule = {
    (value: string): boolean | string
}

type Rules = {[name: string]: Rule}

const baseRules: Rules = {
    noInput: (value: string) => value.length > 0 || "未入力です"
}

interface Vform extends Vue {
    validate: () => boolean;
}

type Datas = {
    name: string;
    email: string;
    password: string;
    name_rules: Rules;
    email_rules: Rules;
    password_rules: Rules;
    new_user: boolean;
}

type Methods = {
    startQuiz(account: boolean): void;
}

export default Vue.extend<{}, Methods, {}, {}>({
    
    data(): Datas {
        return {
            name: "", 
            email: "", 
            password: "", 
            name_rules: baseRules,
            email_rules: {...baseRules, formatError: (value: string) => value.match(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/) !== null || "メールアドレスの形式が不正です"},
            password_rules: baseRules,
            new_user: true
        }
    },

    methods: {

        async startQuiz(login: boolean) {
            if (login === true) {
                if ((this.$refs.form as Vform).validate() === true) {
                    try {
                        const res = await this.$axios.post("http://localhost:3000/api/user", {name: this.$data.name, email: this.$data.email, password: this.$data.password, new_user: this.$data.new_user});
                        this.$store.commit("user/login", res.data);
                        this.$router.push("/quiz");
                    } catch (e) {
                        console.log(e.response.status);
                    }
                }
            } else {
                this.$router.push("/quiz");
            }
        }
    }

});

</script>