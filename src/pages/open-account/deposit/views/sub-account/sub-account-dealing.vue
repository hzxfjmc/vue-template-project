<template lang="pug">
    .full-height.flex-fixed.bg-bottom
        yx-step(
            :data="stepData"
            :active="active"
            class="bg-white"
            )
        .gap
        .account-box.bg-white
            .mask-box
                .img-box
                    img(src="/webapp/open-account/open-account/deposit/icon_chuli@2x.png" class="img-status")
                .status 处理中
                .tips
                    p 由于银行内部分配，预计最长1个工作日完成处理， 成功后会短信通知到您
            .title {{title}}
            .info-box
                ul
                    li(v-for="item in map" @click="copy(accountInfo[item.key])")
                        .item-left
                            span.label {{item.value}}
                        .item-right *********
        .gap
        guide-box(title="申请遇到问题？" :isSubAccount="true" class="bg-white")
</template>
<script>
/**
 * 入金流程-香港汇款/跨境汇款
 * @ Author LINJAIJUN
 * @ Date 2019/01/05
 */
import { mapGetters } from 'vuex'
import guideBox from '../../components/guide-box'
export default {
    components: {
        guideBox
    },
    methods: {},
    computed: {
        ...mapGetters({
            user: 'user',
            currency: `deposit/currency`,
            bankAttribute: `deposit/bankAttribute`,
            baseInfo: `deposit/baseInfo`
        }),
        title() {
            return this.$constant.title[this.bankAttribute]
        },
        stepData() {
            return this.$constant.subAccountStepData
        }
    },
    data() {
        return {
            map: [
                { key: 'accountNo', value: '收款账户号码' },
                { key: 'bankName', value: '收款银行名称' },
                { key: 'accountName', value: '收款账户名称' },
                { key: 'bankRtgs', value: '银行编号' },
                { key: 'bankSwift', value: 'Swift代码' },
                { key: 'bankAddress', value: '收款银行地址' }
            ],
            active: 0
        }
    },
    created() {}
}
</script>

<style lang="scss"></style>
<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.bg-white {
    background: #fff;
}
.bg-bottom {
    background-color: $background-bottom-color;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.mask-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 2;
    text-align: center;
    .img-box {
        padding-top: 55px;
        img {
            width: 80px;
            height: 70px;
        }
    }
    .status {
        font-size: 20px;
        font-weight: 400;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
        margin: 14px 0 6px;
    }
    .tips {
        padding: 0 30px 10px;
        p {
            font-size: 14px;
            opacity: 0.5;
        }
    }
}
.account-box {
    position: relative;
    padding: 14px;
    .title {
        font-size: 18px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
}
.info-box {
    ul li {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: start;
        padding-top: 12px;
        &:first-child {
            padding-top: 16px;
        }
    }
    .item-left {
        flex: 1;
        .label {
            opacity: 0.5;
        }
    }
    .item-right {
        flex: 2;
    }
}
</style>
