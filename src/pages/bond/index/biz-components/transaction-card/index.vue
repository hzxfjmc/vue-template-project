<template lang="pug">
    .transaction-card
        media-box.transanction-header(
            :title="bondEditableInfo && bondEditableInfo.issuerInfo || '--'"
            :desc="bondEditableInfo && bondUneditableInfo && bondEditableInfo.name + ' ' + bondUneditableInfo.couponRate + '% ' + bondUneditableInfo.paymentDate"
        )
        .yx-cell
            .yx-cell__header 买入价格
                .yx-cell__header-tip (美元)
            .yx-cell__primary 1.0282

        .yx-cell
            .yx-cell__header 份数
            .yx-cell__primary
                van-stepper(v-model="value" integer)
                .yx-cell__primary-tip (2000美元/份)
        .yx-cell
            .yx-cell__header 金额
            .yx-cell__primary 2,056.40

        .yx-cell
            .yx-cell__header 应付利息
                .yx-cell__header-tip
                    i.iconfont.icon-wenhao
            .yx-cell__primary +19.18

        .yx-cell
            .yx-cell__header 手续费(预估)
            .yx-cell__primary +3.24

        .divider-line

        .yx-cell
            .yx-cell__header 总额
                .yx-cell__header-tip (美元)
            .yx-cell__primary 2,078.64

        .tips
            i.iconfont.icon-wenhao
            span 债券可用资金
            strong 3,078.64美元
</template>

<script>
import MediaBox from '@/pages/bond/index/biz-components/media-box/index.vue'
import { getBondDetail } from '@/service/finance-info-server.js'
import { Stepper } from 'vant'
export default {
    name: 'TransacntionCard',
    components: {
        [Stepper.name]: Stepper,
        MediaBox
    },
    async created() {
        try {
            let { bondEditableInfo, bondUneditableInfo } = await getBondDetail(
                this.$route.query.id
            )
            this.bondEditableInfo = bondEditableInfo || []
            this.bondUneditableInfo = bondUneditableInfo || []
            console.log(
                'getBondDetail:data:>>> ',
                bondEditableInfo,
                bondUneditableInfo
            )
        } catch (e) {
            console.log('getBondDetail:error:>>>', e)
        }
    },
    data() {
        return {
            value: 1,
            bondEditableInfo: null,
            bondUneditableInfo: null
        }
    }
}
</script>

<style lang="scss" scoped>
.transaction-card {
    overflow: hidden;
    padding-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
}
.transanction-header {
    background-color: #2f79ff;
}
.icon-wenhao {
    color: #9fb0ca;
}
.yx-cell {
    display: flex;
    padding: 14px;
    .yx-cell__header {
        font-size: 0.28rem;
        line-height: 20px;
        opacity: 0.6;
    }
    .yx-cell__header-tip {
        display: inline-block;
        margin-left: 4px;
        font-size: 0.24rem;
        line-height: 17px;
        opacity: 0.6;
    }
    .yx-cell__primary {
        flex: 1;
        text-align: right;
        font-size: 0.36rem;
        line-height: 23px;
    }
    .yx-cell__primary-tip {
        margin-top: 6px;
        font-size: 0.2rem;
        line-height: 14px;
    }
}

.divider-line {
    margin: 25px 14px 16px;
    height: 1px;
    background-color: #393939;
    opacity: 0.0565;
}
.tips {
    padding-right: 15px;
    text-align: right;
    i {
        margin-right: 4px;
        font-size: 0.24rem;
    }
    span {
        margin-right: 4px;
        font-size: 0.24rem;
        line-height: 18px;
    }
    strong {
        font-size: 0.28rem;
        line-height: 18px;
    }
}
</style>
