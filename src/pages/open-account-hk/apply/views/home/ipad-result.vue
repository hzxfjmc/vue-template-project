<template lang="pug">
    .apply-ipad-result
        .apply-main
            img(src='/webapp/open-account-hk/ipad-result/group.png')
            .result-text(:class="{noPass: ipadOpenAccountStatus ===3}") {{infoTxt.textTop}}
            .result-text {{infoTxt.textBottom}}
        .apply-footer
            .footerBanner(
                @click='toMarketingHandle'
                :style="{backgroundImage: `url(/webapp/open-account-hk/ipad-result/${infoTxt.src}.jpg)`}")
</template>

<script>
export default {
    i18n: {
        zhCHS: {
            result: {
                1: {
                    textTop: '我们已收到部分资料，',
                    textBottom: '请联系客户经理补充文件。',
                    src: 'banner'
                },
                2: {
                    textTop: '已收到你的开户申请，',
                    textBottom: '将在一至两个工作日完成开户。',
                    src: 'banner'
                },
                3: {
                    textTop: ':(',
                    textBottom:
                        '抱歉，开户资料审核没有通过，暂不能为您开户。如有疑问，请联系客服',
                    src: 'banner'
                }
            }
        },
        zhCHT: {
            result: {
                1: {
                    textTop: '我們已收到部份資料，',
                    textBottom: '請聯繫客戶經理補充文件。',
                    src: 'banner'
                },
                2: {
                    textTop: '已收到你的開户申請，',
                    textBottom: '將在一至兩個工作日完成開戶。',
                    src: 'banner'
                },
                3: {
                    textTop: ':(',
                    textBottom:
                        '抱歉，開戶資料審核沒有通過，暫不能為您開戶。如有疑問，請聯繫客服',
                    src: 'banner'
                }
            }
        },
        en: {
            result: {
                1: {
                    textTop: 'We have received some information，',
                    textBottom:
                        'Please contact the Customer Manager for additional documents.',
                    src: 'banner'
                },
                2: {
                    textTop:
                        'Your application for opening an account has been received,',
                    textBottom:
                        'Opening accounts will be completed in one to two working days.',
                    src: 'banner'
                },
                3: {
                    textTop: ':(',
                    textBottom: `Sorry, the audit of account opening data has not passed,
                        I can't open an account for you for the time being.
                        If you have any questions, please contact customer service.`,
                    src: 'banner'
                }
            }
        }
    },
    props: {
        ipadOpenAccountStatus: {
            type: Number,
            required: true
        }
    },
    computed: {
        infoTxt() {
            return this.$t('result')[this.ipadOpenAccountStatus]
        }
    },
    // created() {
    //     this.$i18n.setLang('zhCHT')
    // },
    methods: {
        toMarketingHandle() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    '/webapp/marketing/recruit-new.html?register-ct=ecp&register-cid=12019061802#/'
            )
        }
    }
}
</script>

<style lang="scss" scoped>
$content-box-color: rgba(#d8d8d8, 0.6);
.apply-ipad-result {
    .apply-main {
        padding: $global-padding;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            width: 99px;
            height: 99px;
            margin-top: 50px;
            margin-bottom: 28px;
        }
        .result-text {
            text-align: center;
            color: $hk-text-color;
            font-size: 18px;
            line-height: 24px;
        }
        .noPass {
            font-size: 30px;
            padding-right: 300px;
            padding-bottom: 20px;
        }
    }
    .apply-footer {
        .footerBanner {
            height: 94px;
            width: 100%;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
        }
    }
}
</style>
