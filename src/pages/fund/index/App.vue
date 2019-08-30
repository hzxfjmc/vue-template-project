<template lang="pug">
    #app
        keep-alive
            router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
#app {
    background-color: $background-bottom-color;
}
* {
    user-select: none;
}
input,
textarea {
    user-select: auto;
}
</style>
