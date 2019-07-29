<template lang="pug">
    .apply-home
        .apply-main
            .apply-main-banner(@click="goNewActHandler" v-webp="" :class="$t('home.openGuidSrc')")
                van-button.apply-banner-bottom(
                type="primary"
                @click.stop="goOpenAccount"
                size="large") {{openTip || $t('home.openAccount')}}
            .apply-main-add-credit.common-radius(@click="aiHandler" v-webp=""  :class="$t('home.bannerSrc')")
</template>

<script>
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
export default {
    i18n: {
        zhCHS: {
            home: {
                openAccount: '立即开户',
                bannerSrc: 'banner-dl webp-dl',
                openGuidSrc: 'open-account-jt webp-jt '
            }
        },
        zhCHT: {
            home: {
                openAccount: '立即開戶',
                bannerSrc: 'banner-hk webp-hk',
                openGuidSrc: 'open-account-ft webp-ft '
            }
        },
        en: {
            home: {
                openAccount: 'Open Account Now',
                bannerSrc: 'banner-eng webp-eng',
                openGuidSrc: 'open-account-eng webp-eng '
            }
        }
    },
    props: {
        identifyType: {
            type: Number,
            default: 0
        },
        openTip: {
            type: String,
            default: ''
        },
        infoEditStatus: {
            type: Number,
            default: 0
        }
    },
    computed: {
        // 立即开户（0）&&继续开户（!0）时，获取父组件的状态
        step() {
            return this.transNum(this.infoEditStatus)
        }
    },
    methods: {
        goNewActHandler() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    '/webapp/marketing/recruit-new.html?register-cid=12019061802'
            )
        },
        transNum(infoEditStatus) {
            let sum = 1
            for (let i = 1; i <= 6; i++) {
                // 返回到还没有完成的那一步
                if ((infoEditStatus & sum) === 0) {
                    return i
                }
                sum *= 2
            }
        },
        aiHandler() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://main_stockking')
        },
        // 未登录，先进入home页面
        async goOpenAccount() {
            try {
                await this.$store.dispatch('loginCommonAction')
                this.jumpNextAfterLoginHandle()
            } catch (e) {
                console.log(e)
            }
        },
        async jumpNextAfterLoginHandle() {
            try {
                this.$loading()
                if (this.identifyType === 1) {
                    this.$jsBridge.gotoNativeModule('yxzq_goto://open_account')
                    return
                }
                let {
                    infoEditStatus,
                    openAccountStatus,
                    ipadOpened,
                    ipadOpenAccountStatus
                } = await getHKOpenAccountInfo()
                this.infoEditStatus = infoEditStatus
                // 更新步骤
                let step = this.transNum(infoEditStatus)
                // IPAD 開戶處理邏輯
                if (ipadOpened) {
                    let params = {
                        page: 'ipad-result',
                        ipadOpenAccountStatus: ipadOpenAccountStatus
                    }
                    this.$emit('changeView', params)
                }
                if (infoEditStatus === 0) {
                    // 登录回来之后，直接跳转到第一步进行开户
                    this.goStep(`step/1`)
                } else if (openAccountStatus === 12) {
                    // 已经开户，到结果页
                    this.$emit('changeView', { page: 'no-pass' })
                } else if (
                    openAccountStatus !== 12 &&
                    openAccountStatus !== 0
                ) {
                    this.$emit('changeView', { page: 'result' })
                } else if (openAccountStatus === 0 && infoEditStatus > 0) {
                    this.goStep(`step/${step}`)
                }
                this.$close()
            } catch (e) {
                await this.$toast(e.msg)
            }
        },
        goStep(pageName) {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        `/webapp/open-account-hk/apply.html#/${pageName}`
                )}`
            )
        }
    }
}
</script>

<style lang="scss" scoped>
$content-box-color: rgba(#d8d8d8, 0.6);
$border-top-color: #e9e9e9;
.apply-home {
    .apply-main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .apply-main-banner {
            width: 345px;
            height: 500px;
            padding: $global-padding $global-padding / 2;
            display: flex;
            flex-direction: column;
            background-position: center;
            background-size: 100% auto;
            background-repeat: no-repeat;
            justify-content: flex-end;
            &.open-account-jt {
                background-image: url('/webapp/open-account-hk/apply/open-account-jt.jpg');
            }
            &.open-account-ft {
                background-image: url('/webapp/open-account-hk/apply/open-account-ft.png');
            }
            &.open-account-eng {
                background-image: url('/webapp/open-account-hk/apply/open-account-eng.png');
            }
            &.webp.webp-ft {
                background-image: url('/webapp/open-account-hk/apply/webp/open-account-ft.webp');
            }
            &.webp.webp-jt {
                background-image: url('/webapp/open-account-hk/apply/webp/open-account-jt.webp');
            }
            &.webp.webp-eng {
                background-image: url('/webapp/open-account-hk/apply/webp/open-account-eng.webp');
            }
        }
        .apply-main-add-credit {
            width: 345px;
            margin-top: $global-padding;
            background-color: $content-box-color;
            height: 90px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            &.banner-dl {
                background-image: url('/webapp/open-account-hk/apply/pxw-jt.png');
            }
            &.banner-hk {
                background-image: url('/webapp/open-account-hk/apply/pxw-ft.png');
            }
            &.banner-eng {
                background-image: url('/webapp/open-account-hk/apply/pxw-eng.png');
            }
            &.webp.webp-dl {
                background-image: url('/webapp/open-account-hk/apply/webp/pxw-jt.webp');
            }
            &.webp.webp-hk {
                background-image: url('/webapp/open-account-hk/apply/webp/pxw-ft.webp');
            }
            &.webp.webp-eng {
                background-image: url('/webapp/open-account-hk/apply/webp/pxw-eng.webp');
            }
        }
    }
}
</style>
