<template>
    <div>
        <div>
            <p>{{$store.getters["appData/app"] === null ? "" : "アプリ名: "  + $store.getters["appData/app"].name}}</p>
        </div>
        <div>
            <div>
                <h6>状態</h6>
                <div v-for="state in states" v-bind:key="state.stateId">
                    <p>{{state.name}}</p>
                </div>
            </div>
            <div>
                <h6>操作</h6>
                <div v-for="action in states" v-bind:key="action.stateId">
                    <p>{{action.name}}</p>
                </div>
            </div>
            <div class="mb-3" v-if="$store.getters['appData/app'] !== null">
                <select v-model="selected">
                    <option v-bind:value="'state'" selected>状態</option>
                    <option v-bind:value="'action'">操作</option>
                </select>
                <input class="form-control" type="text" v-model="name" v-bind:placeholder="selected === 'state' ? '入力受付中' : '戻るボタンを押す'" />
                <input class="btn btn-primary" type="button" v-bind:value="selected === 'state' ? '状態を追加' : '操作を追加'" @click="post()" />
            </div>
        </div>
        <div>
            <input type="button" class="btn btn-link" value="アプリ選択に戻る" @click="back()" />
            <input type="button" class="btn btn-danger" value="アプリを削除" @click="back($store.getters['appData/app'].id)" />
        </div>
    </div>
</template>

<script lang="ts">

import Vue from "vue";
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options";

interface Data {
    states: any[],
    actions: any[],
    transitions: any[],
    selected: "state" | "action",
    name: string
}

interface Method {
    back(id?: string): void,
    post(): void
}

interface Computed {}
interface Prop {}

export default Vue.extend({

    async asyncData(context): Promise<Data> {

        var data: Data = {states: [], actions: [], transitions: [], selected: "state", name: ""}

        if (context.store.getters["appData/app"] === null) {
            return data;
        }

        const res = await context.$axios.get(`http://localhost:3000/api/transition?id=${context.store.getters['appData/app'].id}`);

        return {...data, states: res.data.states, actions: res.data.actions, transitions: res.data.transitions}

    },
    
    beforeCreate() {
        if (this.$store.getters["appData/app"] === null) {
            this.$router.push("/");
        }
    },

    methods: {

        async back(id?: string) {
            if (id !== undefined) {
                const res = await this.$axios.delete("http://localhost:3000/api/app", {data: {id: id}});
                if (res.status === 200) {
                    alert("アプリを削除しました");
                } else {
                    alert("エラーが発生しました");
                }
            } 
            this.$store.commit("appData/releaseApp");
            this.$router.push("/");
        },

        async post() {

            let res;

            if (this.selected === "state") {
                res = await this.$axios.post("http://localhost:3000/api/state", {state: {appId: this.$store.getters["appData/app"].id, name: this.name}});
                this.states.push(res.data.state);
            } else if (this.selected === "action") {
                res = await this.$axios.post("http://localhost:3000/api/action", {state: {appId: this.$store.getters["appData/app"].id, name: this.name}});
                this.actions.push(res.data.action);
            }

        }
        
    }
    
} as ThisTypedComponentOptionsWithRecordProps<Vue, Data, Method, Computed, Prop>);

</script>