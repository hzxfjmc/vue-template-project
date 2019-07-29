<template lang="pug">
yx-container.corporate-action-home
    .main(slot="main")
        CellInfo(:conversionForm="conversionForm" :curName="curName" :withdrawBalance="withdrawBalance")
        VerticalStep(:data="verticalStepData" :title='title')
        .bottom(v-if="conversionForm.status === 3")
          van-button( size="large" :disabled="disabled" type="primary" class="bottom-button" @click="deleteHandler") {{$t('cancelled')}}
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
            withdrawBalance: ''
        }
    },
    i18n: {
        zhCHS: {
            ifcancel: res => {
                return `是否确认撤销${res}的供股申请`
            },
            withdrawalSuccess: '撤销成功',
            final: '股权最后交易日'
        },
        zhCHT: {
            ifcancel: res => {
                return `是否確認撤銷${res}的供股申請`
            },
            withdrawalSuccess: '撤销成功',
            final: '股權最后交易日'
        },
        en: {
            ifcancel: res => {
                return `Whether to confirm the withdrawal of the ${res}  rights issue application`
            },
            withdrawalSuccess: 'Successful cancellation',
            final: 'Rights issue process'
        }
    },
    created() {
        this.initData()
    },
    computed: {
        title() {
            return this.$t('process')
        }
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
                    this.$toast(res.msg || this.$t('netError'))
                })
            let params = {
                applyId: this.$route.query.applyId
            }
            getDetail(params)
                .then(res => {
                    this.$close()
                    this.conversionForm = res
                    this.verticalStepData = [
                        `${this.$t('供股申請開始日')}:${res.applyBeginDate}`,
                        `${this.$t('供股申請截止日')}:${res.applyEndDate}`,
                        `${this.$t('正股派送日')}:${res.dividendDate}`,
                        `${this.$t('正股上市日')}:${res.listingDate}`
                    ]
                    //可交易
                    if (!res.tradeFlag) {
                        this.verticalStepData.splice(
                            1,
                            0,
                            `${this.$t('final')}:${res.tradingPeriodTo}`
                        )
                    }
                })
                .catch(res => {
                    this.$toast(res.msg || this.$t('netError'))
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
                this.$toast(this.$t('withdrawalSuccess'))
                this.initData()
            } catch (e) {
                await this.$toast(e.msg || this.$t('netError'))
            }
        },
        deleteHandler() {
            this.$confirm({
                title: this.$t('ifcancel', this.conversionForm.stockName),
                confirmButtonText: this.$t('confirmed'),
                cancelButtonText: this.$t('cancel')
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
