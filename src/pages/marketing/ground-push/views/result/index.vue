<template lang="pug">
    yx-container.result
        .main(slot="main")
            .title 当前审核进度
            .content 您的申请已提交，审核后即可获取专属推广QR CODE
            .btn
                van-button(
                size="large"
                type="primary"
                to="/index"
                ) 确定
</template>
<script>
import mixins from '../../util/mixins'
export default {
    mixins: [mixins]
}
</script>
<style lang="scss" scoped>
.result {
    padding: 0 30px;
    .title {
        text-align: center;
        font-size: 24px;
    }
    .content {
        font-size: 20px;
        margin-top: 100px;
    }
    .btn {
        text-align: center;
        margin-top: 30px;
    }
}
</style>
