<template>
    <div>
        <div>
            <h6>アプリを選択</h6>
            <div v-if="apps.length > 0">
                <div v-for="app in apps" v-bind:key="app.id" class="card" @click="setApp(app)">
                    <div class="card-body">
                        <h6>{{app.name}}</h6>
                        <p><small>作成日: {{app.created}}</small></p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>登録されているアプリはありません</p>
            </div>
        </div>
        <div>
            <h6>もしくは.. アプリを登録</h6>
            <div class="mb-3">
                <label>アプリ名</label>
                <input class="form-control" type="text" placeholder="SNSアプリ" v-model="newAppName" />
                <input class="btn btn-primary" type="button" value="送信" @click="setApp()" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from "vue";
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options";
import { App } from "./../store/appData";

interface Data {
    apps: App[], 
    newAppName: string
}

interface Method {
    setApp(app?: App): void;
}

interface Computed {}
interface Props {}

const endpoint: string = "http://localhost:3000/api/app";

export default Vue.extend({

    async asyncData(context): Promise<Data> {
        const res = await context.$axios.get(endpoint);
        return {
            apps: res.data.apps,
            newAppName: ""
        }
    },

    methods: {
        async setApp (app?: App) {
            if (app === undefined) {
                const res = await this.$axios.post(endpoint, {name: this.newAppName});
                this.$store.commit("appData/setApp", res.data.app);
            } else {
                this.$store.commit("appData/setApp", app);
            }
            this.$router.push("/transition");
        }
    }

} as ThisTypedComponentOptionsWithRecordProps<Vue, Data, Method, Computed, Props>);

</script>