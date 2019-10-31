<template lang="pug">
    #app
        keep-alive
            router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/common-hk.scss';
@import '~@/assets/styles/vant-reset.scss';
@import '~@/assets/styles/vant-reset-hk.scss';
#app {
    background-color: $hk-background-color;
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
