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
    background-color: #f1f3f8;
}
</style>
