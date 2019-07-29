<template lang="pug">
    .full-height.flex-fixed
        .top-box
            .inner
                .left-item
                    .title 请选择收款账户
                .right-item.flex-box(v-if="bankList.length")
                    a(hef="javascript:;" @click="goManageAccount")
                        img(src="@/assets/img/open-account/withdrawal/edit@2x.png" class="icon-edit")
                        span 管理账户
        .scroll-able.flex-fixed-container
            .bank-list(v-if="bankList.length")
                ul
                    li.bank-item.mb-14(:class="'bg-'+item.bankClsName" @click="goFunds(item)" v-for="item in bankList")
                        .inner
                            .bank-inner-bg(:class="'bank-bg-'+item.bankClsName")
                            .flex-box.bank-content
                                .bank-bg
                                    .bank-icon(:class="'bank-icon-'+item.bankClsName")
                                .bank-title
                                    .big {{item.bankName}}
                                    .small {{item.accountTypeName}}
                                    .bank-code
                                        p **** **** **** {{(item.bankAccount+'').slice(-4)}}
            .bank-add(v-else @click="goAddAccount")
                p
                    img(src="@/assets/img/open-account/withdrawal/add.png")
                p
                    span 添加银行卡账户
            .btn-area(v-if="bankList.length" @click="goAddAccount")
                img(src="@/assets/img/open-account/withdrawal/add.png")
                span 添加银行卡账户
            .service-box
                .tips #[span 提示：由于到账率较低，暂时无法使用大陆银行卡收款，建议您使用香港银行卡账户收款] #[a(@click="goHelpCenter") 出金常见问题]
                p
                    a(href="javascript:;" @click="goBankCardProcessing") 没有香港银行卡？大陆可直接办理 >
</template>
<script>
/**
 * 出金流程-首页
 * @ Author LINJAIJUN
 * @ Date 2019/01/02
 */
import { mapGetters } from 'vuex'
import jsBridge from '@/utils/js-bridge.js'
import { queryOwnValiBankCardBinding } from '@/service/stock-capital-server.js'
export default {
    data() {
        return {
            bankList: []
        }
    },
    methods: {
        goHelpCenter() {
            let url = location.origin + '/webapp/market/help.html'
            this.$jsBridge.gotoNewWebview(url)
        },
        goAddAccount() {
            if (this.bankList.length < 5) {
                this.$router.push({
                    name: 'addAccount',
                    query: { type: 'add', fromPage: 'home' }
                })
            } else {
                this.$alert({
                    message: '抱歉，最多只能添加5个收款账户！',
                    confirmButtonText: '我知道了'
                })
            }
        },
        goBankCardProcessing() {
            let url =
                location.origin +
                '/webapp/open-account/deposit.html#/bank-card-processing?referrer=withdraw'
            this.$jsBridge.gotoNewWebview(url)
        },
        goManageAccount() {
            this.$router.push({ name: 'manageAccount' })
        },
        goFunds(item) {
            this.$router.push({
                name: 'funds',
                query: {
                    bankListLength: this.bankList.length,
                    bankName: item.bankName,
                    bankAccount: item.bankAccount,
                    accountType: item.accountType,
                    accountTypeName: item.accountTypeName
                }
            })
        },
        async getBankList() {
            try {
                let params = {
                    userId: this.user.userId
                }
                this.$loading()
                this.bankList = await queryOwnValiBankCardBinding(params)
                this.bankList.forEach(item => {
                    switch (item.bankName) {
                        case '工银亚洲（香港）':
                            item.bankClsName = 'gongshang'
                            break
                        case '民生银行香港分行':
                            item.bankClsName = 'mingsheng'
                            break
                        case '永隆银行':
                        case '招商银行香港分行':
                            item.bankClsName = 'zhaoshang'
                            break
                        default:
                            item.bankClsName = 'other'
                            break
                    }
                })
                this.$close()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        }
    },
    computed: {
        ...mapGetters([`user`])
    },
    created() {
        delete window.h5HistoryBack
        window.h5HistoryBack = () => {
            if (this.$route.name === 'home') {
                jsBridge.callApp('command_close_webview')
            }
            return true
        }
        this.getBankList()
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.flex-box {
    display: flex;
}
.mb-14 {
    margin-bottom: 14px;
}
.icon-edit {
    width: 15px;
    height: 15px;
}
.top-box {
    .inner {
        padding: 14px 10px;
        overflow: hidden;
    }
    .left-item {
        float: left;
    }
    .right-item {
        float: right;
        a {
            img {
                margin: 3px 7px 0 0;
            }
            span {
                opacity: 0.5;
                line-height: 22px;
            }
        }
    }
    .title {
        font-size: 18px;
        font-weight: 500;
        line-height: 22px;
        padding-left: 4px;
    }
}
.bank-add {
    height: 98px;
    border-radius: 8px;
    border: 1px dashed #e1e1e1;
    margin: 0 10px 0;
    img {
        width: 31px;
        height: 31px;
        margin: 19px 0 7px;
    }

    p {
        text-align: center;
        font-size: 12px;
        color: rgba(53, 53, 71, 0.7);
    }
}

.bank-list {
    padding: 0 10px;
}

.btn-area {
    font-size: 14px;
    font-weight: 400;
    color: rgba(53, 53, 71, 0.7);
    line-height: 24px;
    text-align: center;
    img {
        width: 24px;
        height: 24px;
        margin-right: 6px;
    }
}
.service-box {
    padding: 14px;
    font-size: 12px;
    line-height: 20px;

    .tips {
        padding-bottom: 5px;
        span {
            opacity: 0.5;
            padding-right: 5px;
        }
    }

    a {
        color: $text-link-color;
    }
}
</style>
