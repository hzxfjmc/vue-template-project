<template lang="pug">
    #app.ch
        router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
#app.ch {
    background-color: $text-color8;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
}
* {
    user-select: none;
}
input,
textarea {
    user-select: auto;
}
</style>
