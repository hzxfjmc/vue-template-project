<template lang="pug">
    .withdrawal-container
        .content-box
            .bank-list
                ul
                    li(v-for="item in bankList")
                        .bank-item.bdr-n(:class="'bg-'+item.bankClsName")
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
                        .bank-btn.flex-box
                            .item(@click="del(item)") 删除
                            .item(@click="edit(item)") 修改
            .btn-area(@click="goAddAccount")
                img(src="@/assets/img/open-account/withdrawal/add.png")
                span 添加银行卡账户
</template>
<script>
/**
 * 出金流程-管理收款账户
 * @ Author LINJAIJUN
 * @ Date 2019/01/03
 */
import { mapGetters } from 'vuex'
import {
    queryOwnValiBankCardBinding,
    delBankCardBinding
} from '@/service/stock-capital-server.js'
export default {
    data() {
        return {
            bankList: []
        }
    },
    methods: {
        goAddAccount() {
            if (this.bankList.length < 5) {
                this.$router.push({
                    name: 'addAccount',
                    query: { type: 'add', fromPage: 'manageAccount' }
                })
            } else {
                this.$alert({
                    message: '抱歉，最多只能添加5个收款账户！',
                    confirmButtonText: '我知道了'
                })
            }
        },
        edit(item) {
            this.$router.push({
                name: 'editAccount',
                query: { type: 'edit', bindingId: item.bindingId }
            })
        },
        del(item) {
            this.$confirm({
                message: '确认删除该账户吗？',
                confirmButtonText: '确认删除'
            })
                .then(async () => {
                    try {
                        let params = {
                            bindingId: item.bindingId,
                            deleted: 2 // 是否删除 1-有效 2-删除
                        }
                        await delBankCardBinding(params)
                        this.$toast('删除成功')
                        this.getBankList()
                    } catch (e) {
                        this.$toast(e.msg || '删除失败')
                    }
                })
                .catch(() => {})
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
                this.$toast(e.msg)
            }
        }
    },
    computed: {
        ...mapGetters([`user`])
    },
    created() {
        delete window.h5HistoryBack
        window.h5HistoryBack = () => {
            if (this.$route.name === 'manageAccount') {
                this.$router.replace({ name: 'home' })
            }
            return true
        }
        this.getBankList()
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';

.dn {
    display: none;
}

.flex-box {
    display: flex;
    display: -webkit-flex;
}

.withdrawal-container {
    position: relative;
    min-height: 100%;
    .content-box {
        background-color: #fff;
        padding: 14px 10px;
    }

    .bank-add {
        height: 98px;
        border-radius: 8px;
        border: 1px dotted #e1e1e1;
        margin-top: 20px;

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
        .bank-btn {
            height: 37px;
            line-height: 37px;
            border-radius: 0px 0px 6px 6px;
            border: 1px solid rgba(225, 225, 225, 0.5);
            margin-bottom: 14px;
            .item {
                flex: 1;
                text-align: center;
                opacity: 0.72;
                &:first-child {
                    border-right: 1px solid rgba(225, 225, 225, 0.5);
                }
            }
        }
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

    .fix-box {
        a {
            color: #285ac8;
        }

        font-size: 12px;
        width: 100%;
        position: absolute;
        bottom: 14px;
        text-align: center;
    }
}
</style>
