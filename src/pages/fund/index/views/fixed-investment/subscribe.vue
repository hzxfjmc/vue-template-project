<template lang="pug">
    .subscribe-wrapper
        .fond-des
            .fond-name {{ fundName }}

        .fund--block-content
            .fund-content
                .fund--header-title
                    .fund-title 定投金额
                    .fund-desc 交易规则
                .fund--header--input
                    NumberKeyboard( 
                        :placeholder="placeholder"
                        @handlerAmount="handlerAmount")
            .fund-footer-content
                .protocol
                    .protocol__checkbox.iconfont.icon-unchecked(:class="isCheckedProtocol ?'icon-selected checked':''" @click="checkProtocol")
                    .protocol__text(@click="checkProtocol") {{$t('protocolTips')}}
                    .protocol__button.iconfont.icon-iconshouqi(@click="showProtocol")
                van-button(@click="handlerSubmitFilter") {{$t('submitButtonText')}}
        
        protocol-popup(
            v-model="protocolVisible"
            :protocolFileList="buyProtocolFileList"
            )
      

        .block__footer--loading(v-if="loading")
            Loading(type="spinner" color="#2F79FF")
</template>
<script>
import { getFundDetail } from '@/service/finance-info-server.js'
import jsBridge from '@/utils/js-bridge.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import protocolPopup from './components/protocol-popup'
import { mapGetters } from 'vuex'
import { getFundUserInfo } from '@/service/user-server.js'
import { Loading } from 'vant'
import NumberKeyboard from './components/number-keyboard'
import './index.scss'
export default {
    name: 'subscribe',
    components: {
        protocolPopup,
        Loading,
        NumberKeyboard
    },
    data() {
        return {
            loading: true,
            fundName: '',
            buyProtocolFileList: [],
            protocolVisible: false,
            isCheckedProtocol: true,
            placeholder: '请输入金额'
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },

    async created() {
        this.getFundDetailInfo()
        this.getFundUserInfo()
    },
    computed: {
        ...mapGetters([
            'appType',
            'lang',
            'isLogin',
            'openedAccount',
            'appVersion'
        ])
    },
    methods: {
        handlerAmount(val) {
            console.log(val)
        },
        handlerSubmitFilter() {},
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                this.loading = false
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },

        async openProtocol(url) {
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        checkProtocol() {
            this.isCheckedProtocol = !this.isCheckedProtocol
        },
        showProtocol() {
            this.protocolVisible = true
        },
        hideProtocol() {
            this.protocolVisible = false
        },

        // 获取基金信息
        async getFundDetailInfo() {
            try {
                const fundDetail = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundName = fundDetail.fundHeaderInfoVO.fundName
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    i18n: {
        zhCHS: {
            protocolTips: '已阅读并同意服务协议及风险提示，并查阅相关信息'
        },
        zhCHT: {
            protocolTips: '已閱讀並同意服務協議及風險提示，並查閱相關信息'
        },
        en: {
            protocolTips:
                'I have read and agree to the service agreement and risk warning, and consult relevant information'
        }
    }
}
</script>
