<template lang="pug">
.complete.full-height.flex-fixed
    van-dialog.dialog-consult(v-model="showConsult" confirmButtonText="知道了")
        .cell-box
            .cell-item.flex
                .left 公司名称
                .right 友信证券有限公司
            .cell-item.flex(v-if="parseInt(this.conversionForm.exchangeType) === 0")
                .left CCASS代码
                .right B02159
            .cell-item.flex(v-else)
                .left 参与者编号
                .right DTC3856
            .cell-item.flex
                .left 联系人
                .right 结算部
            .cell-item.flex
                .left 联系人电话
                .right +852 2510 8198
    .main-container.scroll-able.flex-fixed-container
        .success
            img(src="@/assets/img/open-account/result/tijiao.png")
            p.r-title 您的转股申请已成功提交
            .r-tips(v-if="sendBroker") 我们已将{{conversionForm.brokerName}}转出表格发送至
                br
                span.primary-color {{email}}
                |  邮箱，请查收
        ul.warn.text-color5
            .title 完成以下步骤即可正常转入
            li(v-for="item, index in tipList" :key="index")  
                span {{index + 1}}
                p {{item}}
            p.tip-content 如转出券商转出过程需友信证券资料，可
                span.tip-href.primary-color(@click="showConsult = true") 点击查看参考
        van-button.open-btn(type="primary" @click="completeHandler" size="large") 完成
    recharge(v-if="showRecharge")    
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'
import recharge from '@/biz-components/recharge'

export default {
    mixins: [require('../../mixins/common-mx.js').default],
    data() {
        return {
            showConsult: false,
            tipList: [
                `联系转出券商获取转出表格`,
                `打印表格填写信息并签名`,
                `寄送表格至转出券商并电话通知转出股票`
            ]
        }
    },
    components: {
        recharge
    },
    created() {
        this.$LS.remove('conversion/form')
        window.h5HistoryBack = () => {
            jsBridge.callApp('command_close_webview')
        }
        console.log(this.conversionForm, this.tipList)
        // if (parseInt(this.conversionForm.brokerId) !== 0) {
        //     this.tipList.shift()
        // }
        if (this.$route.query.sendBroker) {
            this.tipList.shift()
        }
    },
    computed: {
        email() {
            return this.$route.query.email
        },
        showRecharge() {
            return this.$route.query.showRecharge
        },
        sendBroker() {
            return this.$route.query.sendBroker
        }
    },
    methods: {
        completeHandler() {
            jsBridge.callApp('command_close_webview')
        }
    }
}
</script>

<style lang="scss" scoped>
$b-color: #d8d8d8;
.complete {
    flex-direction: column;
    .dialog-consult {
        .cell-item {
            padding-top: 10px;
            word-break: keep-all;
            .left {
                color: $text-color5;
                font-size: 14px;
            }
        }
        .cell-box {
            padding: $global-padding;
            font-size: 14px;
        }
        .cell-box:last-child {
            border: 0;
        }
    }
    .main-container {
        padding: 36px $global-padding;
        .success {
            text-align: center;
            padding-bottom: 20px;
            img {
                width: 99px;
            }
            .r-title {
                font-size: 20px;
                font-weight: 400;
                padding: 10px;
            }
        }
        .r-tips {
            font-size: 12px;
            padding-top: 6px;
            color: $text-color5;
        }
        .brand-list {
            .brand-item {
                width: 100%;
                height: 85px;
                background-color: $b-color;
                margin-right: 5px;
            }
            .brand-item:nth-child(3) {
                margin-right: 0;
            }
        }
        .deposit-log {
            color: $primary-color;
            text-align: center;
            padding-top: 10px;
        }
        .warn {
            width: 343px;
            background: rgba(60, 120, 250, 0.06);
            border-radius: 10px;
            padding: $global-padding;
            border: 1px solid rgba(60, 120, 250, 0.12);
            li {
                display: flex;
                margin-top: 6px;
                span {
                    font-size: 10px;
                    margin-right: 10px;
                    display: flex;
                    height: 16px;
                    align-items: center;
                    justify-content: center;
                    margin-top: 3px;
                    width: 16px;
                    background-color: rgba(60, 120, 250, 0.35);
                    color: #fff;
                    border-radius: 100%;
                }
                p {
                    flex: 1;
                    word-break: break-all;
                }
            }
            .tip-content {
                padding-top: 10px;
            }
        }
        .h-operate {
            width: 100%;
            height: 127px;
            margin-top: 5px;
            background-color: $b-color;
        }
        .open-btn {
            margin-top: 46px;
        }
    }
}
</style>
