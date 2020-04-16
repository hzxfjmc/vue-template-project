<template lang="pug">
.inverstment--block--wrapper
    van-tabs(
        color="#2F79FF"
        :line-width="width"
        title-inactive-color="#191919"
        title-active-color="#2F79FF"
        v-model="active" 
        sticky
        swipeable) 
        van-tab(title="定投计划")
            .inverstment--block--list(v-for="(item,index) in list")
                .block--item--header.bg-color.ellipse JP摩根中國A股市324324324機會基最多是这么多个…
                .block--item--content.border-bottom
                    .item--left 
                        .top 累计金额(港币）
                        .bottom 13,450.00
                    .item--left 
                        .top 已投期数
                        .bottom 100
                .block--item--footer
                    .flex-item
                        .top 下次扣款日期
                        .bottom 02-11(周一)
                    .flex-item
                        .top 扣款方式
                        .bottom 建设银行(0483)
                    .flex-item
                        .top 扣款金额
                        .bottom 5,0000.00
        van-tab(title="历史计划")
             .inverstment--block--list(v-for="(item,index) in list")
                .block--item--header.bg-uncolor.ellipse JP摩根中國A股市324324324機會基最多是这么多个…
                .block--item--content.border-bottom
                    .item--left 
                        .top 累计金额(港币）
                        .bottom 13,450.00
                    .item--left 
                        .top 已投期数
                        .bottom 100
                .block--item--footer
                    .flex-item
                        .top 下次扣款日期
                        .bottom 02-11(周一)
                    .flex-item
                        .top 扣款方式
                        .bottom 建设银行(0483)
                    .flex-item
                        .top 扣款金额
                        .bottom 5,0000.00
        .nomore(v-if="list.length === 0 && active === 0")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p 暂无定投计划
        .nomore(v-if="list.length === 0 && active === 1")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p 暂无历史计划
    .inverstment--footer--btn
        van-button.btn-left() 发现更多定投机会
        van-button.btn-right 我的持仓
</template>
<script>
import './index.scss'
export default {
    data() {
        return {
            width: 28,
            active: 1,
            list: []
        }
    }
}
</script>
