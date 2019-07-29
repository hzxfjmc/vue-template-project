<template lang="pug">
yx-container.corporate-action-home
    .main(slot="main")
        CellInfo(:conversionForm="conversionForm" :curName="curName" :withdrawBalance="withdrawBalance")
        VerticalStep(:data="verticalStepData" :title='title')
        .bottom(v-if="conversionForm.status === 3")
          van-button( size="large" :disabled="disabled" type="primary" class="bottom-button" @click="deleteHandler") 撤回
</template>

<script>
import CellInfo from './right-cell-info.vue'
import VerticalStep from '../../components/vertical-step.vue'
import {
    getDetail,
    applyModify,
    MoneyCanTake
} from '@/service/stock-order-server.js'
export default {
    components: {
        CellInfo,
        VerticalStep
    },
    data() {
        return {
            conversionForm: {},
            curName: '',
            verticalStepData: [],
            disabled: false,
            title: '供股流程',
            withdrawBalance: ''
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            this.$loading()
            let param = {
                moneyType: 2
            }
            MoneyCanTake(param)
                .then(res => {
                    this.$close()
                    this.withdrawBalance = res.withdrawBalance
                })
                .catch(res => {
                    this.$toast(res.msg || '网络开小差了,请稍后重试')
                })
            let params = {
                applyId: this.$route.query.applyId
            }
            getDetail(params)
                .then(res => {
                    this.$close()
                    this.conversionForm = res
                    this.verticalStepData = [
                        `供股申请开始日:${res.applyBeginDate}`,
                        `供股申请截止日:${res.applyEndDate}`,
                        `正股派送日:${res.dividendDate}`,
                        `正股上市日:${res.listingDate}`
                    ]
                    //可交易
                    if (!res.tradeFlag) {
                        this.verticalStepData.splice(
                            1,
                            0,
                            `股权最后交易日:${res.tradingPeriodTo}`
                        )
                    }
                })
                .catch(res => {
                    this.$toast(res.msg || '网络开小差了,请稍后重试')
                })
        },
        async onNextStep() {
            this.$loading()
            let params = {
                action: 1, //操作类型(0-修改,1-撤销)
                activityType: 0, //业务(供股-0)
                applyId: this.$route.query.applyId,
                selectionQty: 0
            }
            try {
                await applyModify(params)
                this.$close()
                this.$toast('撤销成功')
                this.initData()
            } catch (e) {
                await this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        deleteHandler() {
            this.$confirm({
                title: `是否确认撤销${this.conversionForm.stockName}的供股申请`,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            })
                .then(() => {
                    this.onNextStep()
                })
                .catch(() => {
                    console.log(333)
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.corporate-action-home {
    $disabled: #dadada;
    .header {
        background-color: $primary-color;
        width: 100%;
        color: rgba(235, 235, 235, 1);
        line-height: 32px;
        height: 32px;
        padding: 0 $global-padding;
    }
    .main {
        background-color: $background-color;
        padding: 0 $global-padding;
    }
    .bottom {
        background-color: rgba(40, 90, 200, 1);
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        text-align: center;
        color: #fff;
        border-radius: 4px;
        margin-top: 20px;
    }
}
</style>
