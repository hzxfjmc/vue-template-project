<template lang="pug">
yx-container.select-pages
    .select-pages-main(slot="main")
        yx-hk-popup(
            v-model="showSelect"
            position="bottom"
            :list="selectList"
            @check-handler-inland="openHkAccountHandle"
        )
        .select-pages__title 请选择开户证件
        .select-pages__main
            .select-pages__box(
                v-for="item in pagesList"
                :key="item.img"
                @click="openHkAccountHandle(item)"
            )
                img(:src="`/webapp/open-account/select-pages/${item.img}.png`")
                span {{item.page}}
        .yx-company-provide(v-if="appType.Ch") 证券开户、交易服务由友信证券有限公司提供
</template>

<script>
import { startHkOpenAccount } from '@/service/user-account-server-hk.js'
import { appType } from '@/utils/html-utils.js'
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            showSelect: false,
            appType: appType
        }
    },
    methods: {
        /**
         * 1 -> 大陆身份证
         * 2 -> 香港身份证
         * 3 -> 护照
         * 4 -> 香港永久居民身份证
         */
        async openHkAccountHandle(item) {
            try {
                if (item.identifyType) {
                    this.nextProcess(item.identifyType)
                } else {
                    this.showSelect = true
                }
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        async nextProcess(identifyType) {
            this.$LS.put('identifyType', identifyType)
            // 内地身份证开户 跳转到开户且关闭当前webview
            try {
                await startHkOpenAccount(identifyType)
                if (identifyType === 1) {
                    this.goApplyStep()
                    // this.$jsBridge.gotoNativeModule('yxzq_goto://open_account')
                    // this.$jsBridge.callApp('command_close_webview')
                    return
                } else {
                    window.location.href =
                        window.location.origin +
                        `/webapp/open-account-hk/apply.html#/step/2`
                    // 到香港开户的第二步
                }
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        }
    },
    computed: {
        selectList() {
            return [
                { text: '香港永久居民身份证', identifyType: 4 },
                {
                    text: '香港居民身份证',
                    tip: '补充内地身份证或护照信息',
                    identifyType: 2
                }
            ]
        },
        pagesList() {
            return [
                {
                    identifyType: 1,
                    img: 'inland',
                    page: '大陆二代身份证'
                },
                {
                    img: 'hk',
                    page: '香港身份证'
                },
                {
                    identifyType: 3,
                    img: 'group',
                    page: '护照'
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.select-pages {
    .select-pages-main {
        padding: $global-padding;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .select-pages__title {
            font-size: 18px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
        }
        .select-pages__main {
            padding: 8px;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 20px;
            .select-pages__box {
                margin-top: 20px;
                width: 100%;
                height: 128px;
                border-radius: 6px;
                opacity: 0.7543000000000001;
                border: 1px solid rgba(225, 225, 225, 0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                img {
                    width: 60px;
                    height: 60px;
                }
                span {
                    padding-top: 10px;
                    height: 22px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(53, 53, 71, 1);
                    line-height: 22px;
                }
            }
        }
    }
}
</style>
