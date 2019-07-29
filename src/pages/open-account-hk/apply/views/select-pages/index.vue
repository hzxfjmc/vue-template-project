<template lang="pug">
.select-pages
    .select-pages-title {{$t('openAccountCard')}}
        yx-hk-popup(v-model="showSelect" position="bottom" :list="selectList" @checkedHandle="openHkAccountHandle")
    .select-pages-main
        .select-pages-button-list
            van-button.apply-btn-boxshadow(
                v-for="item in $t(`identifyTypeList`)"
                :key="item.identifyType"
                @click="selectTypeHandle(item.identifyType)"
                type="primary"
                size="large") {{item.name}}
        .select-pages-tips
            .text-tip {{$t('selectPagesType')}}
        .yx-company-provide(v-if="appType.Ch") 证券开户、交易服务由友信证券有限公司提供
</template>

<script>
import { startHkOpenAccount } from '@/service/user-account-server-hk.js'
import { Popup } from 'vant'
import { appType } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            openAccountCard: '选择您的开户证件',
            hongkongIdCardNever: '香港永久居民身份证',
            hongkongIdCard: '香港居民身份证',
            inlandIdCard: '补充内地身份证或护照信息',
            identifyTypeList: [
                {
                    name: '香港身份证',
                    identifyType: '2'
                },
                {
                    name: '内地身份证',
                    identifyType: '1'
                },
                {
                    name: '护照',
                    identifyType: '3'
                }
            ],
            selectPagesType:
                '暂不受理美国公民或美国永久居民卡(绿卡)持有者的开户申请，敬请谅解'
        },
        zhCHT: {
            openAccountCard: '選擇您的開戶證件',
            hongkongIdCardNever: '香港永久居民身份證',
            hongkongIdCard: '香港居民身份證',
            inlandIdCard: '補充內地身份證或護照信息',
            identifyTypeList: [
                {
                    name: '香港身份證',
                    identifyType: '2'
                },
                {
                    name: '內地身份證',
                    identifyType: '1'
                },
                {
                    name: '護照',
                    identifyType: '3'
                }
            ],
            selectPagesType:
                '暫不受理美國公民或美國永久居民卡(綠卡)持有者的開戶申請，敬請諒解'
        },
        en: {
            openAccountCard: 'Choose your ID / Passport for account opening',
            hongkongIdCardNever: 'Hong Kong Permanent Identity Cards',
            hongkongIdCard: 'Hong Kong Identity Cards',
            inlandIdCard: 'China ID or Passport Needed',
            identifyTypeList: [
                {
                    name: 'Hong Kong ID Card',
                    identifyType: '2'
                },
                {
                    name: 'China ID Card',
                    identifyType: '1'
                },
                {
                    name: 'Passport',
                    identifyType: '3'
                }
            ],
            selectPagesType:
                "We don't accept account opening application of US citizen or US permanent resident card (green card) owner. Please understand."
        }
    },
    data() {
        return {
            appType: appType,
            identifyTypeList: [],
            showSelect: false,
            selectList: [
                { text: this.$t('hongkongIdCardNever'), identifyType: 4 },
                {
                    text: this.$t('hongkongIdCard'),
                    tip: this.$t('inlandIdCard'),
                    identifyType: 2
                }
            ]
        }
    },
    components: {
        [Popup.name]: Popup
    },
    methods: {
        cancelHandle() {
            this.showSelect = false
        },
        /**
         * 1 -> 大陆身份证
         * 2 -> 香港身份证
         * 3 -> 护照
         * 4 -> 香港永久居民身份证
         */
        async openHkAccountHandle(item) {
            try {
                // 永久身份证
                let {
                    value: { identifyType }
                } = item
                await startHkOpenAccount(identifyType)
                this.nextProcess(identifyType)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async selectTypeHandle(identifyType) {
            try {
                // 香港身份证
                if (identifyType === '2') {
                    this.showSelect = true
                } else if (identifyType === '1') {
                    await startHkOpenAccount(1)
                    this.$jsBridge.gotoNativeModule('yxzq_goto://open_account')
                    setTimeout(() => {
                        this.$jsBridge.callApp('command_close_webview')
                    }, 200)
                } else {
                    await startHkOpenAccount(3)
                    this.nextProcess(identifyType)
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        nextProcess(identifyType) {
            this.$LS.put('identifyType', identifyType)
            this.$router.push({
                path: `/step/2`,
                query: { openIdCardType: identifyType }
            })
        }
    }
}
</script>

<style lang="scss">
.select-pages {
    .van-button__text {
        color: #fff;
    }
}
</style>

<style lang="scss" scoped>
.select-pages {
    background-color: #fff;
    .select-pages-title {
        padding: 40px 18px;
        font-size: 28px;
    }
    .select-pages-main {
        display: flex;
        flex-direction: column;
        padding: 21px;
        .select-pages-button-list {
            width: 100%;
            height: 284px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .van-button {
                height: 60px !important;
                border-radius: 39px !important;
            }
        }
    }
    .select-pages-tips {
        text-align: center;
        margin-bottom: 47px;
        padding: 17px;
        font-size: 12px;
        color: $hk-text-color3;
    }
}
</style>
