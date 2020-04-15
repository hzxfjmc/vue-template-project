<template lang="pug">
.investment__record__wrapper
    .investment__record_header
        p 定投记录
    .investment__record_title
        span(v-for="(item,index) in titleList" :key='index') {{item}}
    .investment__record_content
        van-list.record_content_list
            .record_content_list_item(v-for="(item,index) in recordList")
                .list_item_time {{item.time}}
                .list_item_amount {{item.amount}}
                .list_item_status 
                    span {{item.status}}
                    img(src="@/assets/img/fund/icon-more.png")

</template>
<script>
import { List } from 'vant'
export default {
    components: {
        [List.name]: List
    },
    data() {
        return {
            titleList: ['时间', '金额(港币)', '订单状态'],
            recordList: [
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' },
                { time: '2020-03-11', amount: '5000.00', status: '交易进行中' }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.investment__record__wrapper {
    padding: 12px;
    .investment__record_header {
        p {
            font-size: 16px;
            color: $text-link-color;
            margin-bottom: 12px;
        }
    }
    .investment__record_title {
        display: flex;
        justify-content: space-between;
        span {
            color: $text-color6;
        }
    }
    .investment__record_content {
        .record_content_list {
            .record_content_list_item {
                line-height: 48px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid $text-color8;
                &:last-of-type {
                    border-bottom: none;
                }
                .list_item_status {
                    display: flex;
                    align-items: center;
                    img {
                        width: 15px;
                        height: 15px;
                        margin-left: 4px;
                    }
                }
            }
        }
    }
}
</style>
