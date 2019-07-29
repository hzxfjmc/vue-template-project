<template lang="pug">
    .content-card(v-webp)
        template(v-if="!isInit")
            template(v-if="!isLogin")
                .title(:class="{ en: lang.isEN }") {{$t('index.card.noLogin.title')}}
                .content {{$t(`index.card.content${tabType}`)}}
                .btn-wrap
                    button.btn(
                    @click="goLogin"
                    ) {{$t('index.card.noLogin.buttonText')}}
            template(v-else)
                .title(:class="{ en: lang.isEN }") {{textObj.title}}
                    span.tip {{textObj.tip}}
                .content {{$t(`index.card.content${tabType}`)}}
                .date-content(v-show="textObj.expireTime") {{textObj.expireTime}}
                .btn-wrap
                    button.btn(
                    v-if="textObj.buttonText && showLinkButton.show"
                    @click="goUrl"
                    ) {{textObj.buttonText}}
                    <!--button.btn(-->
                    <!--v-if="textObj.extraButtonText"-->
                    <!--@click="goBuy"-->
                    <!--) {{textObj.extraButtonText}}-->
</template>
<script>
import {
    attributionMap,
    ipLocationMap,
    quotationTypeMap,
    sourceMap,
    urls
} from '../../../utils/map'

import dayjs from 'dayjs'

export default {
    props: {
        tabType: {},
        quotesInfo: {
            type: Object,
            default: () => {}
        },
        // 是否已入金
        isRecharge: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 语言类型
        lang() {
            return {
                isEN: this.$i18n.lang === 'en',
                isCHS: this.$i18n.lang === 'zhCHS',
                isCHT: this.$i18n.lang === 'zhCHT'
            }
        },
        user() {
            return this.$store.getters.user
        },
        isLogin() {
            return this.$store.getters.isLogin
        },
        // 已注册登录但并未绑定手机号
        noBindPhone() {
            return this.isLogin && !this.user.phoneNumber
        },
        // 是否显示跳转至落地页的button，及配置的Url
        showLinkButton() {
            if (!this.textObj.urls) {
                return {
                    show: true
                }
            }
            if (!this.isOpenedAccount) {
                return {
                    show: !!this.textObj.urls.url1,
                    url: this.textObj.urls.url1
                }
            } else if (!this.isRecharge) {
                return {
                    show: !!this.textObj.urls.url2,
                    url: this.textObj.urls.url2
                }
            } else if (this.isRecharge) {
                return {
                    show: !!this.textObj.urls.url3,
                    url: this.textObj.urls.url3
                }
            }
            return {
                show: true
            }
        },
        // 内地用户
        isChUser() {
            return this.quotesInfo.attribution === attributionMap.CH
        },
        // 香港用户
        isHkUser() {
            return this.quotesInfo.attribution === attributionMap.HK
        },
        // 香港用户不返回ip 4.25 19:13
        // 国内ip
        isChIp() {
            return (
                // 5.20处理，没location的默认分配大陆ip
                this.isChUser &&
                (this.quotesInfo.location
                    ? this.quotesInfo.location === ipLocationMap.CH
                    : true)
            )
        },
        // 香港用户不返回ip 4.25 19:13
        // 中国内地以外ip
        isOtherIp() {
            return (
                this.isChUser &&
                this.quotesInfo.location === ipLocationMap.OTHER
            )
        },
        // 选中香港tab
        isHkTab() {
            return this.tabType === 'Hk'
        },
        currentQuotation() {
            return (
                (this.isHkTab && this.quotesInfo.hk) ||
                (!this.isHkTab && this.quotesInfo.usa) ||
                {}
            )
        },
        // 综合行情状态
        quotationStatus() {
            let lv2Arr = [
                quotationTypeMap.HK_CN_LV2,
                quotationTypeMap.HK_WORLD_LV2
            ]
            // 行情类型
            let quoType = this.currentQuotation.productCode
            // 行情来源
            let source = this.currentQuotation.source
            // 全球lv2
            let worldLv2 = quoType === quotationTypeMap.HK_WORLD_LV2
            return {
                // 是否有lv2
                lv2: lv2Arr.includes(quoType),
                // 内地lv2
                chLv2: quoType === quotationTypeMap.HK_CN_LV2,
                // 有全球level2
                wordLv2: worldLv2,
                // 全球lv2(免费获得)
                worldLv2Free: worldLv2 && source === sourceMap.FREE,
                // 全球lv2(客户购买/中台修改)
                worldLv2Buy:
                    worldLv2 &&
                    (source === sourceMap.BUY || source === sourceMap.ADMIN),
                // 有美股lv1
                usLv1: quoType === quotationTypeMap.US_LV1
            }
        },
        // 是否是港版app uSmart
        isUSmart() {
            return this.$jsBridge.appType.Hk
        },
        // 统一输出行情卡显示内容
        textObj() {
            let result = {}
            // alert(JSON.stringify(this.quotationStatus))
            // 选中香港
            if (this.isHkTab) {
                if (this.isChUser) {
                    // 未绑定手机号，且没有高级行情
                    if (this.noBindPhone && !this.quotationStatus.lv2) {
                        result = this.setText('noBindPhone')
                        return result
                    }
                    // 内地用户，ip在中国内地
                    if (this.isChIp) {
                        if (!this.quotationStatus.lv2) {
                            // 没有lv2
                            result = this.setText('bmp')
                            result.urls = urls.hk.CH_CH_BASE
                        } else if (this.quotationStatus.chLv2) {
                            // 大陆lv2
                            result = this.setText(
                                'chLv2',
                                this.currentQuotation.expireTime
                            )
                            result.urls = urls.hk.CH_CH_CH_LV2_BUY
                        } else if (this.quotationStatus.worldLv2Free) {
                            // 赠送的全球lv2
                            result = this.setText(
                                'worldLv2Free',
                                this.currentQuotation.expireTime,
                                'extraButtonText',
                                true
                            )
                        } else if (this.quotationStatus.worldLv2Buy) {
                            // 购买的全球level2
                            result = this.setText(
                                'worldLv2Buy',
                                this.currentQuotation.expireTime
                            )
                        }
                    } else if (this.isOtherIp) {
                        // 内地用户 ip在内地以外
                        if (!this.quotationStatus.wordLv2) {
                            // 没有全球lv2行情
                            result = this.setText(
                                'bmp',
                                null,
                                'extraButtonText'
                            )
                            result.urls = urls.hk.CH_OTHER_BASE
                        } else if (this.quotationStatus.worldLv2Buy) {
                            //   购买的全球level2
                            result = this.setText(
                                'worldLv2Buy',
                                this.currentQuotation.expireTime,
                                'extraButtonText'
                            )
                        } else if (this.quotationStatus.worldLv2Free) {
                            // 赠送的全球lv2
                            result = this.setText(
                                'worldLv2Free',
                                this.currentQuotation.expireTime,
                                'extraButtonText',
                                true
                            )
                        }
                    }
                } else if (this.isHkUser) {
                    // 香港用户
                    // 未绑定手机号，且没有高级行情
                    if (this.noBindPhone && !this.quotationStatus.lv2) {
                        result = this.setText('noBindPhone')
                        return result
                    }
                    // 没有全球lv2
                    if (!this.quotationStatus.wordLv2) {
                        result = this.setText('bmpHk', null, 'extraButtonText')
                        result.urls = urls.hk.HK_ALL_BASE
                    } else {
                        // 有全球lv2
                        result = this.setText(
                            'worldHk',
                            this.currentQuotation.expireTime,
                            'extraButtonText'
                        )
                        result.urls = urls.hk.HK_ALL_LV2
                    }
                }
            } else {
                // 选中美股
                // 内地用户和香港用户同样的交互
                if (this.quotationStatus.usLv1) {
                    // 有美股lv1
                    result = this.setText(
                        'usLv1',
                        this.currentQuotation.expireTime
                    )
                    if (this.isChUser) {
                        result.urls = urls.us.CH_LV1
                    } else {
                        result.urls = urls.us.HK_LV1
                    }
                } else {
                    // 没有美股lv1
                    result = this.setText('noUsLv1')
                    if (this.isChUser) {
                        result.urls = urls.us.CH_NO_LV1
                    } else {
                        result.urls = urls.us.HK_NO_LV1
                    }
                }
            }
            return result
        },
        // 是否已开户
        isOpenedAccount() {
            return this.user.openedAccount
        },
        isInit() {
            return this.$store.getters.isInit
        }
    },
    methods: {
        /*
         * 统一设置行情卡的显示内容
         * @module: i18n模块名
         * @expireTime: 过期时间，不传则不显示
         * @extraKey: 额外的key，默认在uSmart里面显示
         * @ignoreCondition: 配置了这个字段，则可以忽略在uSmart里显示的条件
         *
         * */
        setText(module, expireTime, extraKey, ignoreCondition) {
            let basePath = `index.card.${module}`
            let result = {
                title: this.$t(`${basePath}.title`),
                tip: this.$t(`${basePath}.tip`),
                buttonText: this.$t(`${basePath}.buttonText`),
                expireTime: expireTime
                    ? this.$t(
                          `${basePath}.expireTime`,
                          this.transformDate(expireTime)
                      )
                    : ''
            }
            // 目前默认extraKey是在 uSmart 条件下才生效的，后续有改动可以增加请求参数
            if ((ignoreCondition || this.isUSmart) && extraKey) {
                result[extraKey] = this.$t(`${basePath}.${extraKey}`)
            }
            return result
        },
        // 根据语言类型不同，转换日期显示格式
        transformDate(dateStr) {
            if (!dateStr) {
                return ''
            }
            let str = dateStr.substr(0, 10)
            let dayObj = dayjs(str)
            if (this.lang.isCHS) {
                str = dayObj.format('YYYY/MM/DD')
            } else if (this.lang.isCHT) {
                str = `${dayObj.get('year')}年${dayObj.get('month') +
                    1}月${dayObj.get('date')}日`
            } else if (this.lang.isEN) {
                str = dayObj.format('DD/MM/YYYY')
            }
            return str
        },
        goBuy() {
            this.$router.push('/buy')
        },
        async goLogin() {
            try {
                await this.$store.dispatch('loginCommonAction')
            } finally {
                await this.$store.dispatch('initAction')
                this.getData()
            }
        },
        // 免费升级/免费续期
        async goUrl() {
            // 美股不判斷
            if (this.noBindPhone && this.isHkTab && !this.textObj.urls) {
                // 登陸未綁定手機號，且没有配置活动url
                try {
                    await this.$jsBridge.callApp('command_bind_mobile_phone')
                } finally {
                    await this.$store.dispatch('initAction')
                    this.getData()
                }
            } else {
                this.$jsBridge.gotoNativeModule(this.showLinkButton.url)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.content-card {
    $padding: 20px;
    width: 292px;
    height: 150px;
    margin: 20px auto 0;
    padding: $padding 0 20px 20px;
    word-break: break-word;
    background-image: url('~@/assets/img/marketing/quotes/card-bg.png');
    background-size: cover;
    color: #fff;
    border-radius: 10px;
    position: relative;
    &.webp {
        background-image: url(~@/assets/img/marketing/quotes/webp/card-bg.webp);
    }
    .title {
        font-size: 0.48rem;
        &.en {
            font-size: 0.32rem;
        }
        .tip {
            font-size: 0.24rem;
            display: inline-block;
            transform: scale(0.83);
            transform-origin: left;
        }
    }
    .content {
        font-size: 0.24rem;
    }
    .date-content {
        font-size: 0.24rem;
        transform: scale(0.67);
        color: rgba(255, 255, 255, 0.6);
        transform-origin: left;
    }
    .btn-wrap {
        position: absolute;
        bottom: $padding;
        left: $padding;
        text-align: right;
        right: $padding;
        display: flex;
        justify-content: flex-end;
        .btn {
            float: right;
            padding: 0 14px;
            height: 28px;
            background: transparent;
            color: #fff;
            border: none;
            border-radius: 14px;
            margin-right: 50px;
            &:last-child {
                background-color: #fff;
                color: #1f5bff;
                margin-right: 0;
            }
        }
    }
}
</style>
