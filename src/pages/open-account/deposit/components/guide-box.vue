<template lang="pug">
    .guide-box
        .title {{title}}
        ul
            template(v-if="isSubAccount")
                li.icon-app(@click="gotoAppGuide"  v-if="isSubAccountGuideLine") {{bankName}} APP汇款指引
                li.icon-web(@click="gotoWebGuide"  v-if="isSubAccountGuideLine") {{bankName}} 网页汇款指引
                li.icon-contact(@click="gotoCustomerService" v-else) 联系客服
            template(v-else)
                li.icon-app(@click="gotoFpsGuide" v-if="mode === 'fps'") {{bankName}} FPS转账指引
                li.icon-app(@click="gotoAppGuide") {{bankName}} APP转账指引
                li.icon-web(@click="gotoWebGuide") {{bankName}} 网页转账指引
                li.icon-contact(@click="gotoCustomerService") 联系客服
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'

export default {
    props: {
        title: {
            type: String,
            default: '转账遇到问题？'
        },
        mode: {
            type: String,
            default: ''
        },
        bankName: {
            type: String,
            default: ''
        },
        appRemittanceGuidelines: {
            type: String,
            default: ''
        },
        webRemittanceGuidelines: {
            type: String,
            default: ''
        },
        isSubAccount: {
            type: Boolean,
            default: false
        },
        isSubAccountGuideLine: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        gotoFpsGuide() {
            let url =
                location.origin + '/webapp/market/generator.html?key=XY023'
            jsBridge.gotoNewWebview(url)
        },
        gotoAppGuide() {
            let url = this.appRemittanceGuidelines
            url && jsBridge.gotoNewWebview(url)
        },
        gotoWebGuide() {
            let url = this.webRemittanceGuidelines
            url && jsBridge.gotoNewWebview(url)
        },
        gotoCustomerService() {
            jsBridge.gotoCustomerService()
        }
    }
}
</script>

<style scoped lang="scss">
.guide-box {
    .title {
        font-size: 16px;
        font-weight: 500;
        color: $text-color;
        line-height: 22px;
        padding: 14px 15px 14px;
    }

    ul li {
        padding: 16px 0 16px 40px;
        margin: 0 8px;
        border-top: 1px solid $border-color5;
        &:last-child {
            border-bottom: 1px solid $border-color5;
        }
    }
}

.icon-app {
    background: url('~@/assets/img/open-account/deposit/app@2x.png') no-repeat
        13px center;
    background-size: 14px 20px;
}

.icon-web {
    background: url('~@/assets/img/open-account/deposit/web@2x.png') no-repeat
        10px center;
    background-size: 19px 16px;
}

.icon-contact {
    background: url('~@/assets/img/open-account/deposit/contact@2x.png')
        no-repeat 10px center;
    background-size: 22px 18px;
}
.icon-guide {
    background: url('~@/assets/img/open-account/deposit/guide@2x.png') no-repeat
        10px center;
    background-size: 18px 16px;
}
</style>
