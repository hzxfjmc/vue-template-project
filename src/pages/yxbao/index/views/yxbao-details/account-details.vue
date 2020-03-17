<template lang="pug">
.block__account--details
    .block__account--header.border-bottom
        p.title 普通转出
        p.num 2000000
            em.money 港币
    .block__account--list.border-bottom
        .block__account--item
            p 手续费
            p 0.01港币
        .block__account--item
            p 实际到账
            p 49999.00港币
    .block__status--step
        transferStep
</template>
<script>
import transferStep from './transfer-step'
export default {
    components: {
        transferStep
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__account--details {
    background: #fff;
    width: 100%;
    height: 100%;
}
.block__account--header {
    width: 100%;
    height: 123px;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
        font-size: 16px;
        color: $text-color5;
    }
    .num {
        font-size: 24px;
        display: flex;
        align-items: center;
        font-family: yxFontDINPro-Medium;
        .money {
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
        }
    }
}
.block__account--list {
    padding: 14px 12px;
    .block__account--item {
        display: flex;
        flex-direction: row;
        line-height: 26px;
        color: $text-color6;
        justify-content: space-between;
    }
}
.block__status--step {
    padding: 14px 12px;
}
</style>
