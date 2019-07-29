<template lang="pug">
.conversion-log.full-height.flex-fixed
    van-dialog.dialog-consult(v-model="showConsult" :confirmButtonText="$t('okToKnow')")
        .cell-box
            .cell-item.flex
                .left {{$t('companyName')}}
                .right {{$t('youxinCompany')}}
            .cell-item.flex
                .left {{$t('ccassNumber')}}
                .right B02159
            .cell-item.flex
                .left {{$t('dtcNumber')}}
                .right DTC3856
            .cell-item.flex
                .left {{$t('contackPerson')}}
                .right {{$t('contackPersonName')}}
            .cell-item.flex
                .left {{$t('contactPhone')}}
                .right +852 2510 8198
            .cell-item.flex
                span {{$t('dtcTip')}}
    .scroll-able.flex-fixed-container
        yx-no-list(v-if="logList.length === 0")
        .cell-box.border-bottom(
            v-for='item,index in logList' 
            @click="item[`open`] = !item.open" 
            :key="index")
            .cell-title.flex 
                .left {{$t('stockDeposit')}}
                .right(
                    :class="{'primary-color': item.statusName == $t('inProcess'),'warn-color': item.statusName === $t('successed')}"
                    ) {{item.statusName}}
            .cell-item.flex
                .left {{$t('transferFrom')}}
                .right {{item.brokerName}}
            .cell-item.flex
                .left {{$t('subTime')}}
                .right {{item.createDate | date-format}}
            .cell-item.flex
                .left {{$t('stockDetail')}}
                .iconfont.icon-pulldown_icon(:class="{open: item.open}" )
            transition(name="fade")
                .cl-detail.text-color7(v-show="item.open" )
                    van-row(
                        v-for="itemK,i in item.stockInfo" 
                        justify="end" 
                        type="flex"
                        :key="i"
                        )
                        van-col(span="10") {{itemK.stockName}}({{itemK.stockCode}})
                        van-col(span="8") {{itemK.stockAmount}}{{$t('stockMsg')}}
                        van-col(span="6") {{(itemK.costPrice) | stockPrice(itemK.priceBase)}}{{item.exchangeType === 0 ? $t('hkd') : $t('usd')}}/{{$t('stockMsg')}}
        p.yxInfo.border-bottom(@click="showConsult = true" v-html="$t('viewInfo', $t('here'))")
</template>

<script>
import JSBridge from '@/utils/js-bridge'
export default {
    i18n: {
        zhCHS: {
            stockDeposit: '转入股票',
            transferFrom: '转出券商',
            inProcess: '处理中',
            successed: '已成功',
            subTime: '发起时间',
            stockDetail: '股票详情',
            hkd: '港币',
            usd: '美元',
            stockMsg: '股',
            here: '点击查看',
            companyName: '公司名称',
            youxinCompany: '友信证券有限公司',
            ccassNumber: 'CCASS代码',
            dtcNumber: '参与者编号',
            contackPerson: '联系人',
            contackPersonName: ' 结算部',
            contactPhone: '联系人电话',
            dtcTip: '若需转入美股，请提供参与者编号',
            viewInfo: here =>
                `如需友信证券公司资料，请<span class="primary-color">${here}</span>`
        },
        zhCHT: {
            stockDeposit: '轉入股票',
            transferFrom: '轉出券商',
            inProcess: '處理中',
            successed: '已成功',
            subTime: '發起時間',
            stockDetail: '股票詳情',
            hkd: '港幣',
            usd: '美元',
            stockMsg: '股',
            here: '點擊查看',
            companyName: '公司名稱',
            youxinCompany: '友信證券有限公司',
            ccassNumber: 'CCASS代碼',
            dtcNumber: '參與者編號',
            contackPerson: '聯繫人',
            contackPersonName: '結算部',
            contactPhone: '聯繫人電話',
            dtcTip: '若需轉入美股，請提供參與者編號',
            viewInfo: here =>
                `如需友信證券公司資料，請<span class="primary-color">${here}</span>`
        },
        en: {
            stockDeposit: 'Stock Deposit',
            transferFrom: 'Transfer From',
            inProcess: 'In Process',
            successed: 'Succeed',
            subTime: 'Submitted',
            stockDetail: 'Stock',
            hkd: 'HKD',
            usd: 'USD',
            stockMsg: 'Stock',
            here: 'Click here',
            companyName: 'Company Name',
            youxinCompany: 'uSMART Securities Limited',
            ccassNumber: 'CCASS No.',
            dtcNumber: 'DTC No.',
            contackPerson: 'Contact Person',
            contackPersonName: 'Settlement Department',
            contactPhone: 'Contact No.',
            dtcTip: 'Please provice DTC Number for transferring US stock',
            viewInfo: here =>
                `<span class="primary-color">${here}</span> to view uSMART information`
        }
    },
    data() {
        return {
            showConsult: false,
            logList: []
        }
    },
    filters: {
        stockPrice(price, pow = 1) {
            return Math.round(price * Math.pow(10, pow)) / Math.pow(10, pow)
        }
    },
    async created() {
        this.setTitleBar()
        try {
            this.$loading()
            let {
                list
            } = await this.$stockTransferService.appQueryStockTransfer({
                beginDate: '',
                endDate: '',
                orderBy: '',
                orderDirection: 0,
                pageNum: 1,
                pageSize: 100,
                pageSizeZero: true,
                requestId: '3213'
            })
            this.logList = list.map(item => {
                item.open = false
                return item
            })
            this.$close()
        } catch (e) {
            this.$toast(e.msg)
        }
    },
    methods: {
        setTitleBar() {
            JSBridge.registerFn('messageReadMarkHandler', () => {
                this.goToAssist()
            })

            JSBridge.callApp('command_set_titlebar_button', {
                type: 'icon',
                position: 2,
                icon: 'service',
                clickCallback: 'messageReadMarkHandler'
            })
        },
        goToAssist() {
            const url = location.origin + '/webapp/market/help.html'
            if (JSBridge.isYouxinApp) {
                JSBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        viewHere() {
            //this.showConsult = true
        }
    }
}
</script>

<style lang="scss" scoped>
$back-color: #f1f3f8;
.conversion-log {
    background-color: $back-color;
    .icon-pulldown_icon {
        color: #ccccd1;
        font-size: 12px;
    }
    .cl-detail {
        background-color: rgba(215, 215, 218, 0.1);
        padding: $global-padding;
        margin: $global-padding 0;
        word-break: break-all;
    }
    .open {
        transform: rotate(180deg);
        display: block;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .cell-box {
        background-color: #ffffff;
        padding: $global-padding;
        margin-bottom: 10px;
    }
    .yxInfo {
        padding: 0 $global-padding $global-padding;
        text-align: center;
        color: $text-color5;
    }
    .cell-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
    }
    .cell-item {
        position: relative;
        padding-top: 10px;
        word-break: break-all;
        .left {
            color: $text-color5;
            width: 100px;
        }
        span {
            position: absolute;
            left: 0;
            right: 0;
            font-size: 12px;
            color: $text-color3;
            text-align: center;
        }
    }
    .cell-box:last-child {
        border: 0;
    }
}
</style>
