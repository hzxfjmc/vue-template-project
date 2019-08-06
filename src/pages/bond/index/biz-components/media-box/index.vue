<template lang="pug">
    .media-box
        .media-box__header(v-if="thumb")
            img.media-box__thumb(:src="thumb" alt="")
        .media-box__content
            h4.media-box__title {{ title }}
            p.media-box__desc {{ desc }}
</template>

<script>
export default {
    name: 'MediaBox',
    props: {
        thumb: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        desc: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss" scoped>
.media-box {
    display: flex;
    align-items: center;
    padding: 16px 14px;
    .media-box__header {
        .media-box__thumb {
            margin-right: 10px;
            width: 34px;
            height: 34px;
            border-radius: 4px;
        }
    }
    .media-box__content {
        flex: 1;
        .media-box__title {
            overflow: hidden;
            color: #fff;
            font-size: 0.32rem;
            line-height: 22px;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            word-wrap: break-word;
            word-break: break-all;
        }
        .media-box__desc {
            overflow: hidden;
            display: -webkit-box;
            color: rgba(255, 255, 255, 0.5972);
            font-size: 0.24rem;
            line-height: 17px;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
    }
}
</style>
