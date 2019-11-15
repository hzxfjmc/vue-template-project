<template lang="pug">
    #app
        router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
#app {
    background-color: $background-bottom-color;
    font-family: PingFangSC-Regular, PingFang SC;
}
* {
    user-select: none;
}
input,
textarea {
    user-select: auto;
}
</style>
