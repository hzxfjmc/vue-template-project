<template lang="pug">
    yx-container.index-page
        .main(slot="main")
            van-button.entry-btn(
            size="large"
            type="primary"
            to="/apply"
            ) 申请成为合伙人
            van-button.entry-btn(
            size="large"
            type="primary"
            to="/login"
            ) 登录
</template>
<script>
import mixins from '../../util/mixins'
export default {
    mixins: [mixins]
}
</script>
<style lang="scss" scoped>
.index-page {
    .main {
        padding: 0 20px;
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .entry-btn {
            margin-bottom: 50px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
