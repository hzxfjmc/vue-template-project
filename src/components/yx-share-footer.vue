<template lang="pug">
    .yx-share-footer(v-if="!env.isYouxinApp" :class="{white: color === 'white'}")
        img.logo(:src="env.logoUrl")
        p {{ i18n.uSmart }}
        p {{ i18n.slogan }}
        button(type="button" @click="buttonHandler") {{ login ? i18n.openInApp : i18n.openAccount }}
</template>

<script>
import { getUrlParam, getLoginStatus } from '@/utils/share/yx-share-fotter'
// import { getIpInfo } from '@/service/config-manager'
import env from '@/utils/scheme/env'
import scheme from '@/utils/scheme'

export default {
    name: 'yx-share-footer',
    props: {
        // 页面id，与wiki上保持一致：http://szwiki.youxin.com/pages/viewpage.action?pageId=20028732
        shareId: {
            default: ''
        },
        // 业务id，类似于资讯id，参考wiki
        bizId: {
            default: ''
        },
        // black、white
        color: {
            type: String,
            default: 'white'
        }
    },
    data() {
        const isMainland = env.isMainland
        return {
            login: false,
            env,
            langs: {
                uSmart: [
                    isMainland ? '立即开户' : '盈立智投uSmart',
                    '盈立智投uSmart',
                    'uSmart'
                ],
                slogan: [
                    isMainland ? '投资港/美/A股' : '投资.智在简单',
                    '投資.智在簡單',
                    'SIMPLY SMARTER'
                ],
                openAccount: [
                    isMainland ? '免费开户' : '开户',
                    '開戶',
                    'Open Account'
                ],
                openInApp: ['在APP中打开', '在APP中打開', 'Open uSmart']
            }
        }
    },
    computed: {
        i18n() {
            const langType = this.env.langType
            return new Proxy(this.langs, {
                get(target, property) {
                    const index = parseInt(langType) - 1
                    return target[property][index]
                }
            })
        }
    },
    async mounted() {
        if (!this.env.isYouxinApp) {
            this.login = await getLoginStatus()
        }
    },
    methods: {
        async buttonHandler() {
            if (this.login) {
                scheme.gotoWebview(location.href)
            } else {
                const invitationCode = getUrlParam('invitationCode') || ''
                if (this.env.isMainland) {
                    location.href = `/webapp/marketing/jump-register.html?ICode=${invitationCode}&shareId=${this.shareId}&bizId=${this.bizId}#/registerv2?isRegisterV2=false`
                } else {
                    const origin = location.origin.replace(
                        'yxzq.com',
                        'usmartsecurities.com'
                    )
                    location.href = `${origin}/marketing/AI_a/index.html?ICode=${invitationCode}&shareId=${this.shareId}&bizId=${this.bizId}#/index`
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.yx-share-footer {
    position: relative;
    border-radius: 6px 6px 0 0;
    background: #121216;
    padding: 17px 100px 17px 79px;
    .logo {
        position: absolute;
        left: 20px;
        top: 17px;
        width: 46px;
        height: 46px;
    }
    > p {
        line-height: 23px;
        color: #fff;
    }
    button {
        position: absolute;
        right: 15px;
        top: 19px;
        min-width: 96px;
        height: 42px;
        font-size: 16px;
        background: #0d50d8;
        border-radius: 4px;
        outline: none;
        border: none;
        color: #fff;
    }
    &.white {
        background: #ebeef7;
        > p {
            color: #191919;
        }
    }
}
.yx-root-hk {
    .yx-share-footer {
        button {
            background: #0091ff;
        }
    }
}
</style>
