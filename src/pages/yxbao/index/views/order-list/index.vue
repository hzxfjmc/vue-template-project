<template lang="pug">
    .block__order--content
        .block__order--list.border-bottom
            .block__order--left
                p.title 普通转出
                p.color 2019-07-10 15:55:08
            .block__order--right
                p.num -10.88
                p.color 余额 1237.40
        .block__no-more 没有更多啦

</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__order--content {
    background: #fff;
    width: 100%;
    height: 100%;
    .block__order--list {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 82px;
        align-items: center;
        .block__order--left {
            margin: 0 0 0 12px;
            .title {
                font-size: 16px;
            }
        }
        .block__order--right {
            margin: 0 12px 0 0;
            text-align: right;
            .num {
                font-size: 18px;
            }
        }
        p {
            line-height: 26px;
        }
        .color {
            color: rgba(25, 25, 25, 0.65);
        }
    }
    .block__no-more {
        width: 100%;
        text-align: center;
        color: rgba(25, 25, 25, 0.45);
        line-height: 20px;
        margin: 20px 0 0 0;
    }
}
</style>
