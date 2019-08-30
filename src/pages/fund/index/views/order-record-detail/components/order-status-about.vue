<template lang="pug">
    .order-status-about-container
        .order-status-about
                van-cell(border)
                    template(slot-scope='scope')
                        .status-title.flex
                            span 订单状态
                            span(class="status-color") {{statusValue}}  
                        .begin-time
                            img(src="@/assets/img/fund/clock.png")
                            span 预计 
                            span(class='time') {{beginTime}} 
                            span 确认份额
                        .left-line
                        .end-time
                            i(class="dot")
                            span 预计 
                            span(class='time') {{endTime}} 
                            span 查收收益 
</template>

<script>
export default {
    name: 'order-status-about',
    data() {
        return {
            statusValue: '确认中',
            beginTime: '07.01日',
            endTime: '07.19日'
        }
    }
}
</script>

<style lang="scss" scoped>
.order-status-about-container {
    .order-status-about {
        .status-title {
            margin-bottom: 16px;
            .status-color {
                color: $status-text-color;
            }
        }
        .begin-time {
            img {
                width: 15px;
                height: 15px;
                vertical-align: middle;
                margin-right: 6px;
            }
            span {
                color: $text-color;
                opacity: 0.5;
                line-height: 20px;
                &.time {
                    opacity: 1;
                }
            }
        }
        .left-line {
            width: 1px;
            height: 56px;
            background-color: $text-color;
            opacity: 0.19;
            margin: 2px 0 -8px 8px;
        }
        .end-time {
            @extend .begin-time;
            i.dot {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background-color: $tip-color;
                opacity: 0.19;
                margin: 0 10px 0 6px;
            }
        }
    }
}
</style>
