<template lang="pug">
    .message-type-item
        .left.center
            img(:src="img_src")
            .dot(v-if="hasNew")
        .right(:class="{'has-border-bottom': border}")
            .top
                .title {{title}}
                .time(v-if="content") {{time}}
            .bottom.overflow-ellipsis {{content | parseHtml($t('index.null'))}}
</template>

<script>
import mixins from '../mixins'

// 主页消息类型列表项
export default {
    name: 'message-type-item',
    mixins: [mixins],
    props: {
        icon: {
            type: String,
            default: 'notice'
        },
        title: String,
        content: String,
        time: String,
        border: {
            type: Boolean,
            default: false
        },
        hasNew: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // icon地址
        img_src() {
            return require(`../img/${this.icon}@2x.png`)
        }
    }
}
</script>

<style scoped lang="scss">
.message-type-item {
    display: flex;
    height: 80px;
    background: white;

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .left {
        width: 63px;
        position: relative;
        top: 0;
        left: 0;

        img {
            width: 28px;
        }

        .dot {
            width: 8px;
            height: 8px;
            position: absolute;
            top: 14px;
            right: 10px;
            border-radius: 100%;
            background: rgba(255, 74, 74, 1);
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        flex: 1;
        padding: 15px 0;
        overflow: hidden;

        &.has-border-bottom {
            border-bottom: 1px solid rgba(57, 57, 57, 0.02);
        }

        .top,
        .bottom {
            width: 100%;
            padding-right: 18px;

            /deep/ * {
                display: inline-block;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .top {
            display: flex;

            .title {
                flex: 1;
                font-size: 18px;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
                line-height: 25px;
            }

            .time {
                font-size: 12px;
                font-weight: 400;
                color: rgba(57, 57, 57, 0.4);
                line-height: 25px;
            }
        }

        .bottom {
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
        }
    }
}
</style>
