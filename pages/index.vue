<template>
    <v-container>
        <v-container>
            <p class="font-weight-bold">サインイン / サインアップ</p>
        </v-container>
        <v-container>
            <v-form ref="form" lazy-validation>
                <!-- outlinedで四角いテキストエリア -->
                <v-text-field v-model="email" label="メールアドレス" :rules="[emailRules.noInput, emailRules.formatError]"></v-text-field>
                <v-text-field v-model="name" label="ユーザー名"></v-text-field>
                <v-text-field v-model="password" label="パスワード" :rules="[passwordRules.noInput]"></v-text-field>
                <v-container>
                    <v-btn color="primary" @click="transition(true)">サインイン</v-btn>
                    <v-btn @click="transition(false)">ログインせずに始める</v-btn>
                </v-container>
            </v-form>
        </v-container>
    </v-container>
</template>

<script lang="ts">

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

export default {
    
    data():{name: string, email: string, password: string, nameRules: Rules, emailRules: Rules, passwordRules: Rules} {
        return {
            name: "", 
            email: "", 
            password: "", 
            nameRules: baseRules,
            emailRules: {...baseRules, formatError: (value: string) => value.match(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/) !== null || "メールアドレスの形式が不正です"},
            passwordRules: baseRules
        }
    },

    methods: {
        async transition(account: boolean) {
            if (account === true) {
                if ((this.$refs.form as Vform).validate() === true) {
                    try {
                        const res = await this.$axios.post("http://localhost:3000/api/user", {name: this.$data.name, email: this.$data.email, password: this.$data.password});
                        this.$store.commit("user/login", res.data);
                        this.$router.push("/quiz");
                    } catch (e) {
                        alert("サーバエラー");
                        console.log(e);
                    }
                }
            } else {
                this.$router.push("/quiz");
            }
        }
    }

}

</script>