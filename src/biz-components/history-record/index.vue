<template lang="pug">
    .bottom-box
        .history-record(@click="goHistory") {{title}} >
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'
export default {
    props: {
        title: {
            type: String,
            default: '存入紀錄'
        }
    },
    methods: {
        goHistory() {
            jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
        }
    }
}
</script>

<style scoped lang="scss">
.bottom-box {
    padding: 5px 0;
    .history-record {
        text-align: center;
        color: $hk-primary-color;
    }
}
</style>
