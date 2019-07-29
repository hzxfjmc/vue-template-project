<template lang="pug">
    yx-container.login
        .header(slot="top")
            van-tabs(
            v-model="tabIndex"
            )
                van-tab(
                v-for="item in titleList"
                :key="item"
                :title="item"
                )
        .main(slot="main")
            mission-list(
            v-if="tabIndex === 0"
            )
            qr-code-list(
            v-if="tabIndex === 1"
            )
</template>
<script>
import missionList from './mission-list'
import qrCodeList from './qr-code-list'
export default {
    components: {
        missionList,
        qrCodeList
    },
    data: () => ({
        titleList: ['任务中心', '我的二维码'],
        tabIndex: 0
    })
}
</script>
<style lang="scss" scoped>
.main {
    padding: 30px $global-padding;
    background-color: #f8f8f8;
    min-height: calc(100vh - 44px);
}
</style>
