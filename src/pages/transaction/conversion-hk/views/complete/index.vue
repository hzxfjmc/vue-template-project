<template lang="pug">
.complete.full-height.flex-fixed
    van-dialog.dialog-consult(v-model="showConsult" :confirmButtonText="$t('okToKnow')")
        .cell-box
            .cell-item.flex
                .left {{$t('companyName')}}
                .right {{$t('youxinCompany')}}
            .cell-item.flex(v-if="parseInt(this.conversionForm.exchangeType) === 0")
                .left {{$t('ccassNumber')}}
                .right B02159
            .cell-item.flex(v-else)
                .left {{$t('dtcNumber')}}
                .right DTC3856
            .cell-item.flex
                .left {{$t('contackPerson')}}
                .right {{$t('contackPersonName')}}
            .cell-item.flex
                .left {{$t('contactPhone')}}
                .right +852 2510 8198
    .main-container.scroll-able.flex-fixed-container
        .success
            img(src="@/assets/img/open-account/result/tijiao.png")
            p.r-title {{$t('successSubmit')}}
            .r-tips(v-if="sendBroker" v-html="$t('sendPlace',conversionForm.brokerName , email)")  
            //- 我們已將{{conversionForm.brokerName}}轉出表格发送至
            //-     br
            //-     span.primary-color {{email}}
            //-     |  郵箱，請查收
        ul.warn.text-color5.dialog-consult
            .title {{$t('stepTips')}}
            li(v-for="item, index in tipList" :key="index")  
                span {{index + 1}}
                p {{item}}
            p.tip-content {{$t('clickPlace')}}
                span.tip-href(@click="showConsult = true") {{$t('here')}}
    van-button.open-btn(
        type="primary" 
        class="bottom-button"  
        @click="completeHandler" 
        size="large") {{$t('finishInfo')}}
    recharge(v-if="showRecharge")
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'
import recharge from '@/biz-components/recharge'
export default {
    i18n: {
        zhCHS: {
            companyName: '公司名称',
            ccassNumber: 'CCASS代码',
            dtcNumber: '参与者编号',
            contackPerson: '联系人',
            contackPersonName: ' 结算部',
            contactPhone: '联系人电话',
            successSubmit: '您的转股申请已成功提交',
            sendPlace: (type, address) => `我们已将${type}转出表格发送至
                <br>
                <span class="primary-color"> ${address}</span>
                  邮箱，请查收`,
            stepTips: '完成以下步骤即可正常转入',
            tipListMsg: [
                `联系转出券商获取表格`,
                `打印表格填写信息并签名`,
                `寄送表格至转出券商并电话通知转出股票`
            ],
            clickPlace: '如转出券商转出过程需友信证券资料， 可点击',
            here: '这里',
            okToKnow: '知道了',
            finishInfo: '完成',
            youxinCompany: '友信证券有限公司'
        },
        zhCHT: {
            companyName: '公司名稱',
            ccassNumber: 'CCASS代碼',
            dtcNumber: '參與者編號',
            contackPerson: '聯繫人',
            contackPersonName: '結算部',
            contactPhone: '聯繫人電話',
            successSubmit: '您的轉股申請已成功提交',
            sendPlace: (type, address) => `我們已將${type}轉出表格發送至
                <br>
                <span class="primary-color"> ${address}</span>
                  郵箱，請查收`,
            stepTips: '完成以下步驟即可正常轉入',
            tipListMsg: [
                `聯繫轉出券商获取轉出表格`,
                `打印表格填寫信息并簽名`,
                `寄送表格至轉出券商并電話通知轉出股票`
            ],
            clickPlace: '如轉出劵商轉出過程需友信證劵資料， 可點擊',
            here: '這裡',
            okToKnow: '知道了',
            finishInfo: '完成',
            youxinCompany: '友信證券有限公司'
        },
        en: {
            companyName: 'Company Name',
            ccassNumber: 'CCASS No.',
            dtcNumber: 'DTC No.',
            contackPerson: 'Contact Person',
            contackPersonName: 'Settlement Department',
            contactPhone: 'Contact No.',
            successSubmit: 'Submitted',
            sendPlace: (
                type,
                address
            ) => `We have sent the stock transfer form of ${type}
                to<span class="primary-color"> ${address}</span>
                  please check.`,
            stepTips: 'steps left to complete the stock transfer',
            tipListMsg: [
                `Ask counterparty for their stock transfer form`,
                `Print and sign it`,
                `Send the form to counterparty and notify them by phone`
            ],
            clickPlace:
                'If you need uSMART Securities information for stock transfer, ',
            here: 'click here',
            okToKnow: 'OK',
            finishInfo: 'Finish',
            youxinCompany: 'uSMART Securities Limited'
        }
    },
    mixins: [require('../../mixins/common-mx.js').default],
    components: {
        recharge
    },
    data() {
        return {
            showConsult: false,
            tipList: this.$t('tipListMsg')
        }
    },
    created() {
        this.$LS.remove('conversion/form')
        window.h5HistoryBack = () => {
            jsBridge.callApp('command_close_webview')
        }
        // if (parseInt(this.conversionForm.brokerId) !== 0) {
        //     this.tipList.shift()
        // }
        if (this.$route.query.sendBroker) {
            this.tipList.shift()
        }
    },
    computed: {
        email() {
            console.log(this.conversionForm)
            return this.$route.query.email
        },
        sendBroker() {
            return this.$route.query.sendBroker
        },
        showRecharge() {
            return this.$route.query.showRecharge
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
            .right {
                color: $text-color;
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
            font-size: 16px;
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
            background: rgba(47, 121, 255, 0.06);
            border-radius: 6px;
            padding: $global-padding;
            border: 1px solid rgba(47, 121, 255, 0.12);
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
                    background-color: rgba(1, 33, 220, 0.05);
                    color: #333;
                    border-radius: 100%;
                }
                p {
                    flex: 1;
                    word-break: break-all;
                }
            }
            .tip-content {
                padding-top: 10px;
                .tip-href {
                    color: #333;
                }
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
