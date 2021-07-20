<template>
    <div>
        <div>
            <p>アプリ名: {{$store.getters["appData/app"].name}}</p>
        </div>
        <div>
            <input type="button" class="btn btn-link" value="アプリ選択に戻る" @click="$router.push('/')" />
            <input type="button" class="btn btn-danger" value="アプリを削除" />
        </div>
    </div>
</template>

<script lang="ts">

import Vue from "vue";

export default Vue.extend({
    
});