<template lang="pug">
#app
    keep-alive
        router-view
</template>

<style lang="scss">
@import '../../../../src/assets/styles/global.scss';
@import '../../../../src/assets/styles/common.scss';
@import '../../../../src/assets/styles/vant-reset.scss';
@import '../../../../src/assets/styles/common-hk.scss';
#app {
    .van-field {
        line-height: 49px;
    }
    .van-cell {
        font-size: 16px;
    }
}
</style>
