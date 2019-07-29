<template lang="pug">
    .index-content
        van-tabs(
        v-model="tab"
        animated
        swipeable
        :line-width="24"
        )
            van-tab(
            v-for="(item, index) in tabList"
            :key="index"
            )
                span.title(slot="title") {{item}}
                content-card(
                :tabType="tabType"
                :quotesInfo="quotesInfo"
                :isRecharge="isRecharge"
                )
                table-box(
                :tabType="tabType"
                )

</template>
<script>
import contentCard from './card'
import tableBox from './table-box'
import { attributionMap } from '../../../utils/map'

export default {
    components: {
        contentCard,
        tableBox
    },
    data() {
        return {
            tabList: [this.$t('index.common.Hk'), this.$t('index.common.Us')],
            tab: 0,
            quotesInfo: {},
            // 是否入金
            isRecharge: false
        }
    },
    computed: {
        tabType() {
            return this.tab === 0 ? 'Hk' : 'Us'
        },
        isLogin() {
            return this.$store.getters.isLogin
        },
        // 是否已开户
        isOpenedAccount() {
            return this.user.openedAccount
        },
        user() {
            return this.$store.getters.user
        },
        // 内地用户
        isChUser() {
            return this.quotesInfo.attribution === attributionMap.CH
        }
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            this.$store.dispatch('setIsInit', true)
            if (this.isLogin) {
                try {
                    let data = await this.$quotesService.getUserQuotationInfo()
                    this.quotesInfo = data || {}
                    this.$store.dispatch('setIsChUser', this.isChUser)
                    // 是否入金
                    if (this.isOpenedAccount) {
                        this.isRecharge = await this.$quotesService.userFirstTrade()
                    }
                } finally {
                    this.$store.dispatch('setIsInit', false)
                }
            } else {
                this.$store.dispatch('setIsInit', false)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.index-content {
    .title {
        font-size: 16px;
    }
    /deep/ {
        .van-tabs__line {
            background-color: $hk-primary-color;
        }
        .van-tab--active .title {
            color: $hk-primary-color;
        }
    }
}
</style>
