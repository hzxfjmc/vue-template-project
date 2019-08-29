<template lang="pug">
.funds-details-header
     h3 Pimco 亚洲投资级债券基金-A2
        p.funds-details-subtitle 晨星 五星评级绩优基金 五星评级绩优基金
        .funds-details-number
            .header-left
                span 近一年表现
                p.number-red +22.33%
            .header-right
                span 基金价格20190704
                p.number-black $152.33
        .funds-details-footer
            p 起投金额 HKD 1,000
            span 债券型
            span 风险等级R5
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.funds-details-header {
    background: $background-color;
    height: 200px;
    padding: 10px;
    h3 {
        font-size: 0.32rem;
        color: $text-color;
        margin: 10px 0 3px 0;
    }
    .funds-details-subtitle {
        color: $text-color3;
        font-size: 0.24rem;
    }
    .funds-details-number {
        width: 100%;
        margin: 20px 0 0 0;
        float: left;
        .header-left,
        .header-right {
            float: left;
            p {
                font-size: 0.56rem;
                font-weight: 500;
                font-family: DINPro;
            }
            .number-red {
                color: rgba(234, 61, 61, 1);
            }
            .number-black {
                color: $text-color;
            }
            span {
                color: $text-color5;
                font-size: 0.24rem;
            }
        }
        .header-left {
            margin: 0 40px 0 0;
        }
    }
    .funds-details-footer {
        width: 100%;
        float: left;
        margin: 10px 0;
        p {
            color: $text-color5;
            float: left;
            font-size: 0.24rem;
            margin: 0 20px 0 0;
        }
        span {
            float: left;
            font-size: 0.2rem;
            border: 1px solid rgba(33, 119, 255, 1);
            margin: 0 3px;
            padding: 0 5px;
            color: rgba(33, 119, 255, 1);
        }
    }
}
</style>
