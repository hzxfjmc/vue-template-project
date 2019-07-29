<template lang="pug">
    .bank-list
        ul
            li.mb-20(v-for="item in filterBankCardList" @click="$emit('clickHandle',item)")
                .bank-item(:class="[{'bdr-n':typeList.includes('del')},'bg-'+item.bankClsName]")
                    .inner
                        .bank-inner-bg(:class="'bank-bg-'+item.bankClsName")
                        .flex-box.bank-content
                            .bank-bg
                                .bank-icon(:class="'bank-icon-'+item.bankClsName")
                            .bank-title
                                .big(:class="{'pt-8': (item.accountTypeList && item.accountTypeList.length === 0 || !item.accountTypeList)}") {{item.bankName}}
                                .small(v-if="item.accountTypeList")
                                    span(v-for="name in item.accountTypeList") {{name}}
                                .bank-code(:class="{'mt-23': (item.accountTypeList && item.accountTypeList.length === 0 || !item.accountTypeList)}")
                                    p **** **** **** {{(item.bankAccount + '').slice(-4)}}
                .bank-btn.flex-box(v-if="typeList.includes('del')")
                    .item(@click="$emit('delHandle',item)" v-if="typeList.includes('del')") {{$t('del')}}
                    .item(@click="$emit('editHandle',item)" v-if="typeList.includes('edit')") {{$t('edit')}}
</template>
<script>
import bankCodeMap from '@/utils/common/bank-code-map'
export default {
    i18n: {
        en: {
            edit: 'Edit',
            del: 'Delete'
        },
        zhCHT: {
            edit: '修改',
            del: '刪除'
        },
        zhCHS: {
            edit: '修改',
            del: '删除'
        }
    },
    props: {
        typeList: {
            type: Array,
            default: () => {
                return []
            }
        },
        bankCardList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {}
    },
    computed: {
        filterBankCardList() {
            this.bankCardList.forEach(item => {
                if (item.bankCode && bankCodeMap[item.bankCode]) {
                    item.bankClsName = bankCodeMap[item.bankCode].className
                } else {
                    switch (item.bankName) {
                        case '工银亚洲（香港）':
                        case '工銀亞洲（香港）':
                        case 'ICBC (Asia) Hong Kong Branch':
                            item.bankClsName = 'gongshang'
                            item.bankCode = 'UBHK'
                            break
                        case '民生银行香港分行':
                        case '民生銀行香港分行':
                        case 'China Minsheng Bank Hong Kong Branch':
                            item.bankClsName = 'mingsheng'
                            item.bankCode = 'MSBC'
                            break
                        case '永隆银行':
                        case '永隆銀行':
                        case 'Wing Lung Bank':
                            item.bankClsName = 'zhaoshang'
                            item.bankCode = 'WUBA'
                            break
                        case '招商银行香港分行':
                        case '招商銀行香港分行':
                        case 'China Merchants Bank Hong Kong Branch':
                            item.bankClsName = 'zhaoshang'
                            item.bankCode = 'CMBC'
                            break
                        default:
                            item.bankClsName = 'other'
                            item.bankCode = 'OTHER'
                            break
                    }
                }
            })
            return this.bankCardList
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/bank-icon-hk.scss';
.flex-box {
    display: flex;
}
.bank-list {
    padding: 0 20px;
}
.mb-20 {
    margin-bottom: 20px;
}

.bank-item .bank-title {
    .bank-code.mt-23 {
        margin-top: 23px;
    }
    .small {
        span {
            padding-right: 5px;
        }
    }
}
.bank-item .bank-title .big.pt-8 {
    padding-top: 8px;
}
.bank-btn {
    height: 37px;
    line-height: 37px;
    border-radius: 0px 0px 6px 6px;
    border: 1px solid rgba(225, 225, 225, 0.5);
    .item {
        flex: 1;
        text-align: center;
        opacity: 0.72;
        &:first-child {
            border-right: 1px solid rgba(225, 225, 225, 0.5);
        }
    }
}
</style>
