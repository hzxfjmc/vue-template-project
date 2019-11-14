<template lang="pug">
    .detail-bond-info-wrapper
        .bond-info-header
            a.pdf(
                v-if="bondEditableInfo && bondEditableInfo.productOverview"
                :href="bondEditableInfo && bondEditableInfo.productOverview"
            )
                i.icon
                span 产品概览
            a.pdf(
                v-if="bondEditableInfo && bondEditableInfo.raiseManual"
                :href="bondEditableInfo && bondEditableInfo.raiseManual"
            )
                i.icon
                span 募集说明书
        .con(@click="toggleShowMoreMsg")
            col-msg.hd-col(:colData="colData")
            .more-msg(v-show="showMore")
                col-msg(
                    v-for="(msgItem, index) in moreBondMsg"
                    :key="index"
                    :colData="msgItem"
                )
            i.iconfont(:class="[showMore ? 'icon-iconshouqi' : 'icon-iconxiala' ]")

</template>
<script>
import { calcPaymentDates } from '@/pages/bond/index/tools.js'
import bondInfoMixin from './mixins/bond-info.js'
export default {
    mixins: [bondInfoMixin],
    computed: {
        // 付息日
        paymentDate() {
            return calcPaymentDates(
                this.bondUneditableInfo && this.bondUneditableInfo.paymentDate,
                true,
                '.',
                '、'
            )
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-info-wrapper {
    padding-top: 2px;
    .bond-info-header {
        position: absolute;
        top: 14px;
        right: 14px;
        display: flex;
        .pdf {
            display: flex;
            align-items: center;
            height: 22px;
            padding: 0 6px;
            border: 1px solid #ebebeb;
            color: #393939;
            border-radius: 1px;
            &:first-child {
                margin-right: 10px;
            }
            i {
                display: inline-block;
                width: 12px;
                height: 13px;
                margin-right: 7px;
                background: url('~@/assets/img/bond/icon-pdf.png') center
                    no-repeat;
                background-size: 100% 100%;
            }
            span {
                font-size: 12px;
            }
        }
    }
    .col-column {
        padding-bottom: 20px;
        &:nth-child(1) {
            padding-top: 0;
        }
    }
    .con {
        position: relative;
        .iconfont {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%);
        }
    }
}
</style>
<style lang="scss">
.detail-bond-info-wrapper {
    .hd-col {
        &.col-column {
            .van-col:nth-child(3) {
                .van-col__title {
                    font-size: 0.22rem;
                }
            }
        }
    }
}
</style>
