<template lang="pug">
  #app
    keep-alive
        router-view
</template>

<style lang="scss">
@import '../../../../src/assets/styles/global.scss';
@import '../../../../src/assets/styles/common.scss';
@import '../../../../src/assets/styles/vant-reset.scss';
#app {
    background: linear-gradient(
        180deg,
        rgba(237, 168, 47, 1) 0%,
        rgba(255, 166, 67, 1) 100%
    );
}
</style>
