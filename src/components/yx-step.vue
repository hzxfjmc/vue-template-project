<template lang="pug">
    .step-box(v-if="data && data.length")
        .flex-box.ov-h
            .step-item(
                v-for="(item,index) in data"
                v-bind:class="{active:active >= index}")
                .top
                    i.dot
                    i.line(v-bind:class="{active:active > index}")
                p {{item}}
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
        active: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style scoped lang="scss">
.step-box {
    .step-item.active {
        .dot {
            background: $primary-color;
        }
        p {
            color: $primary-color;
        }
    }
    .step-item {
        transform: translate3d(50%, 0, 0);
        position: relative;
        flex: 1;
        padding-top: 5px;
        p {
            transform: translate3d(-50%, 0, 0);
            font-size: 14px;
            font-weight: 400;
            color: rgba(53, 53, 71, 0.5);
        }
        .top {
            position: relative;
        }

        .dot {
            position: absolute;
            left: 0;
            display: block;
            width: 7px;
            height: 7px;
            background: #d8d8d8;
            border-radius: 50%;
            z-index: 2;
        }
        &:last-child {
            .line {
                display: none;
            }
        }
        .line.active {
            background: $primary-color;
        }
        .line {
            position: absolute;
            left: 0;
            top: 2px;
            display: block;
            width: 100%;
            height: 1px;
            background: $border-color;
            opacity: 0.5;
        }
        p {
            text-align: center;
            margin-top: 9px;
        }
    }
}
.ov-h {
    overflow: hidden;
}
.flex-box {
    display: flex;
    height: 52px;
    justify-content: space-between;
    align-items: center;
}
</style>
