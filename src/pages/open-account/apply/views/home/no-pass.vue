<template lang="pug">
    .hk-open-account-reject
        h1.title 开户
        .main
            .flag :(
            p.sorry-text 抱歉，开户资料审核没有通过，暂不能为您开户。如有疑问，请联系客服
</template>
<script>
import { buryingViewPage, openAccountType } from '../../const/map'
import { webViewScreen } from '@/utils/burying-point'
export default {
    created() {
        let openType = this.$LS.get('identifyType')
        let openTypeObj = openAccountType[openType] || {}
        webViewScreen(
            buryingViewPage['inland-result'].id,
            openTypeObj.id,
            openTypeObj.name
        )
    }
}
</script>
<style lang="scss" scope>
.hk-open-account-reject {
    padding: $global-padding;
    .title {
        font-family: PingFangHK-Medium;
        font-size: 28px;
        font-weight: 500;
        color: rgba(57, 57, 57, 1);
        line-height: 40px;
    }
    .main {
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(57, 57, 57, 1);
        .flag {
            padding-top: 14px;
            font-size: 28px;
            line-height: 40px;
        }
        .sorry-text {
            padding-top: 14px;
            width: 306px;
            font-size: 18px;
            line-height: 25px;
        }
    }
}
</style>
