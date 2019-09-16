<template lang="pug">
    .fund-steps
        .title {{ title }}
        .step-row
            span(
                v-for="name, i in stepNames" :key="i"
                :class="curStep > i ? 'text-color' : ''") {{ name }}
        .step-row
            .point(:class="curStep > 0 ? 'primary-color' : ''")
            hr.border-top(:class="curStep > 0 ? 'primary-color' : ''")
            .point(:class="curStep > 1 ? 'primary-color' : ''")
            hr.border-top(:class="curStep > 2 ? 'primary-color' : ''")
            .point(:class="curStep > 2 ? 'primary-color' : ''")
        .step-row
            span(v-for="time, i in stepTimes" :key="i") {{ time }}

</template>
<script>
export default {
    name: 'fond-steps',
    props: {
        title: {
            type: String,
            default: ''
        },
        curStep: {
            type: Number,
            default: 0
        },
        stepNames: {
            // 目前写死3个
            type: Array,
            default: () => ['', '', '']
        },
        stepTimes: {
            // 目前写死3个
            type: Array,
            default: () => ['', '', '']
        }
    }
}
</script>
<style lang="scss" scoped>
.fund-steps {
    padding: 0 20px;
    color: $text-color5;
    .title {
        font-size: 0.28rem;
    }
    .step-row {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        span {
            width: 33.33333333%;
            text-align: center;
            font-size: 0.24rem;
        }
        .text-color {
            color: $text-color;
        }
        .primary-color {
            background: $primary-color;
            &::after {
                background: $primary-color;
            }
        }
        span:first-child {
            text-align: left;
        }
        span:last-child {
            text-align: right;
        }
    }
    .point {
        width: 6px;
        height: 6px;
        background: $text-color5;
        border-radius: 50%;
        flex-grow: 0;
        flex-shrink: 0;
    }
    hr {
        border: none;
        width: 100%;
        height: 2px;
        margin-top: 3px;
        position: relative;
        &::after {
            background: $text-color5;
        }
        // border-top: 1px solid $text-color3;
        @media only screen and (min-resolution: 2dppx) {
            // 非标准的
            -webkit-transform: scaleY(0.5);
            -webkit-transform-origin: 50% 0%;
        }
    }
}
</style>
