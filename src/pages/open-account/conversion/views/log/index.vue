<template lang="pug">
.conversion-log.full-height.flex-fixed
    van-dialog.dialog-consult(v-model="showConsult" confirmButtonText="确认")
        .cell-box
            .cell-item.flex
                .left 公司名称
                .right 友信证券有限公司
            .cell-item.flex
                .left CCASS代码
                .right B02159
            .cell-item.flex
                .left 参与者编号
                .right DTC3856
            .cell-item.flex
                .left 联系人
                .right 结算部
            .cell-item.flex
                .left 联系人电话
                .right +852 2510 8198
            .cell-item.flex
                span 若需转入美股，请提供参与者编号
    .scroll-able.flex-fixed-container
        yx-no-list(v-if="logList.length === 0")
        .cell-box.border-bottom(
            v-for='item in logList' 
            @click="item[`open`] = !item.open" 
            :key="item")
            .cell-title.flex 
                .left 转入股票
                .right(
                    :class="{'primary-color': item.statusName == '处理中','warn-color': item.statusName === '已成功'}"
                    ) {{item.statusName}}
            .cell-item.flex
                .left 转出券商
                .right {{item.brokerName}}
            .cell-item.flex
                .left 发起时间
                .right {{item.createDate | date-format}}
            .cell-item.flex
                .left 股票详情
                .iconfont.icon-pulldown_icon(:class="{open: item.open}" )
            transition(name="fade")
                .cl-detail.text-color7(v-show="item.open" )
                    van-row(
                        v-for="itemK in item.stockInfo" 
                        justify="end" 
                        type="flex"
                        :key="itemK"
                        )
                        van-col(span="10") {{itemK.stockName}}({{itemK.stockCode}})
                        van-col(span="8") {{itemK.stockAmount}}股
                        van-col(span="6") {{(itemK.costPrice) | stockPrice(itemK.priceBase)}}{{item.exchangeType === 0 ? '港币':'美元'}}/股
        p.yxInfo.border-bottom 如需友信证券公司资料，请
            span.primary-color(@click="showConsult = true") 点击查看
</template>

<script>
import JSBridge from '@/utils/js-bridge'
export default {
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
            width: 80px;
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
