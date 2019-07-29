<template lang="pug">
    .hk-open-account-reject
        h1.title {{$t('nopass.title')}}
        .main
            .flag :(
            p.sorry-text {{$t('nopass.sorryTip')}}
        .apply-footer
            .footerBanner(
            @click='toMarketingHandle'
            :style="{backgroundImage: `url(/webapp/open-account-hk/ipad-result/banner.jpg)`}")
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            nopass: {
                title: '开户',
                sorryTip:
                    '抱歉，开户资料审核没有通过，暂不能为您开户。如有疑问，请联系客服'
            }
        },
        zhCHT: {
            nopass: {
                title: '開戶',
                sorryTip:
                    '抱歉，開戶資料審核沒有通過，暫不能為您開戶。如有疑問，請聯繫客服'
            }
        },
        en: {
            nopass: {
                title: 'Account opening',
                sorryTip:
                    "Sorry, account opening application failed, we can't open an account for you. If you have any questions, please contact customer service"
            }
        }
    },
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
<style lang="scss" scope>
.hk-open-account-reject {
    .title {
        padding: $global-padding;
        font-size: 28px;
        font-family: PingFangHK-Medium;
        font-weight: 500;
        color: rgba(57, 57, 57, 1);
        line-height: 40px;
    }
    .main {
        padding: $global-padding;
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(57, 57, 57, 1);
        .flag {
            padding-top: 14px;
            font-size: 28px;
            line-height: 40px;
        }
        .sorry-text {
            padding-top: 14px;
            width: 306px;
            font-size: 18px;
            line-height: 25px;
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
