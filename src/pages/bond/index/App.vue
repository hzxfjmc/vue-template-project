<template lang="pug">
    #app.ch
        router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
// DINPro-Regular, DINPro 只对英文和数字生效，所以默认排在前面，
// 如果不是英文和数字，后面的字体会生效
#app.ch {
    // background-color: $text-color8;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
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
