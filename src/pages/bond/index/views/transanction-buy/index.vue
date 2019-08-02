<template lang="pug">
    .transaction-wrapper
        media-box.transanction-header(
            :thumb="bondThumb"
            title="苹果"
            desc="苹果 3.651% 2022.03.22"
        )
        .operate-price
            .operate-price__header 买入价格
                .operate-price__header-tip (美元)
            .operate-price__primary 1.0282
        .operate-count
            .operate-count__header 份数
            .operate-count__primary
                van-stepper(v-model="value" integer)
        .operate-money
            .operate-money__header 金额
            .operate-money__primary 2,056.40
        .operate-interest
            .operate-interest__header 应付利息
                .operate-interest__header-tip ?
            .operate-interest__primary +19.18
        .operate-service-fee
            .operate-service-fee__header 手续费(预估)
            .operate-service-fee__primary +3.24
        .divider-line
        .operate-total
            .operate-total__header 总额
                .operate-total__header-tip (美元)
            .operate-total__primary 2,078.64
        .tips 债券可用资金 3,078.64美元
        .operate
</template>

<script>
import MediaBox from '@/pages/bond/index/biz-components/media-box/index.vue'
import { Stepper } from 'vant'
export default {
    name: 'TransanctionBuy',
    components: {
        [Stepper.name]: Stepper,
        MediaBox
    },
    data() {
        return {
            value: 1,
            bondThumb: require('@/assets/img/bond/bond-avatar-demo.png')
        }
    }
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    padding: 10px 10px 48px;
    .transanction-header {
        border-radius: 4px;
        background-color: #2f79ff;
    }
    .operate-price {
        .operate-price__header {
        }
        .operate-price__header-tip {
        }
        .operate-price__primary {
        }
    }
    .operate-count {
        .operate-count__header {
        }
        .operate-count__primary {
        }
    }

    .operate-money {
        .operate-money__header {
        }
        .operate-money__primary {
        }
    }
    .operate-interest {
        .operate-interest__header {
        }
        .operate-interest__header-tip {
        }
        .operate-interest__primary {
        }
    }
    .operate-service-fee {
        .operate-service-fee__header {
        }
        .operate-service-fee__primary {
        }
    }
    .divider-line {
    }
    .operate-total {
        .operate-total__header {
        }
        .operate-total__header-tip {
        }
        .operate-total__primary {
        }
    }
    .tips {
    }
}
</style>
