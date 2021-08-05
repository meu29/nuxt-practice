<template>
    <v-container>
        <v-text-field v-model="email" label="メールアドレス" :rules="nameRules"></v-text-field>
        <v-text-field v-model="name" label="ユーザー名" :rules="emailRules"></v-text-field>
        <v-text-field v-model="password" label="パスワード" :rules="passwordRules"></v-text-field>
        <v-btn color="primary" @click="transition(true)">サインイン</v-btn>
        <v-btn @click="transition(false)">ログインせずに始める</v-btn>
    </v-container>
</template>

<script lang="ts">

/* バリデーションルール */
/* 条件に一致していればtrueを返し、そうでなければエラーメッセージを返す。*/
type Rule = {
    (value: string): true | string
}

type Rules = {[name: string]: Rule}

const baseRules: Rules = {
    noInput: (value: string) => value.length > 0 || "未入力です"
}

export default {

    data():{name: string, email: string, password: string, nameRules: Rules, emailRules: Rules, passwordRules: Rules} {
        return {
            name: "", 
            email: "", 
            password: "", 
            nameRules: baseRules,
            emailRules: baseRules,
            passwordRules: baseRules
        }
    },

    methods: {
        transition(account: boolean) {
            if (account === true) {
                return;
            }
            this.$router.push("/quiz");
        }
    }

}

</script>