<template lang="pug">
    #app.hk
        router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/common-hk.scss';
@import '~@/assets/styles/vant-reset.scss';
@import '~@/assets/styles/vant-reset-hk.scss';
#app.hk {
    background-color: $hk-background-color;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .yx-container {
        background-color: transparent;
    }
}
* {
    user-select: none;
}
input,
textarea {
    user-select: auto;
}
</style>
