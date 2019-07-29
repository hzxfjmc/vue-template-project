<template lang="pug">
    .step-box(v-if="data && data.length")
        .title {{title}}
        .flex-box
            .step-item(
                v-for="(item,index) in data")
                .top
                    i.dot
                    i.line
                p {{item}}
        p.a-tips.top-margin(v-if="ds")
            span.iconfont.icon-warning.text-color2
            span.text-color5 {{$t('oneDayLater')}}
</template>

<script>
export default {
    name: 'yxStep',
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        title: {
            type: String,
            default: ''
        },
        ds: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="scss">
.step-box {
    background: rgba(248, 248, 248, 1);
    border-radius: 10px;
    padding: $global-padding;
    margin-bottom: 10px;
    .step-item {
        position: relative;
        p {
            font-size: 14px;
            font-weight: 400;
            color: rgba(53, 53, 71, 0.5);
        }
        .top {
            position: relative;
            top: 6px;
            left: 10px;
        }

        .dot {
            position: absolute;
            left: 0;
            display: block;
            width: 7px;
            height: 7px;
            background: rgba(216, 216, 216, 1);
            border-radius: 50%;
            z-index: 2;
        }
        &:last-child {
            .line {
                display: none;
            }
        }
        .line {
            position: absolute;
            left: 3px;
            top: 2px;
            display: block;
            width: 1px;
            height: 28px;
            background: rgba(216, 216, 216, 1);
        }
        p {
            margin-left: 40px;
            margin-top: 13px;
        }
    }
}
.top-margin {
    margin-top: 15px;
}
</style>
