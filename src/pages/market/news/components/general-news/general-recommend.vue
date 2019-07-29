<template lang="pug">
    div(v-if="list.length > 0")
        .divider
        .recommond
            p 相关推荐
            ul
                li.item( v-for="(item, index) in list" :key="item.newsid")
                    a.item-enter(:class="{nopic: !item.picture_url || item.picture_url.length===0}" href="javascript:" @click="gotoDetailPage(item)")
                        p.rc-title {{ item.title }}
                        img.rc-img(v-if="item.picture_url && item.picture_url.length > 0" :src="item.picture_url[0]")
                    p.ft-info
                        span.ft-hot(v-if="item.tag") {{ item.tag }}
                        span.ft-text(v-if="item.source") {{ item.source | cutByteLen(20)}}
                        span.ft-text {{ item.release_time | formatTime }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import dayjs from 'dayjs'
import cutByteLen from '../../../0-filters/cut-byte-len'

export default {
    name: 'general-recommend',

    props: {
        list: Array
    },

    methods: {
        // 跳转到资讯详情页
        gotoDetailPage(item) {
            if (JSBridge.isYouxinApp) {
                JSBridge.gotoNativeModule(
                    `yxzq_goto://info_detail?type=${
                        item.daily_type === 0 ? 1 : 2
                    }&title=${encodeURIComponent(item.title)}&newsid=${
                        item.newsid
                    }`
                )
            } else {
                location.href = `/webapp/market/news.html?newsid=${item.newsid}`
            }
        }
    },

    filters: {
        // 格式化时间
        formatTime(time) {
            const nowTimestamp = Date.now() / 1000
            const interval = Math.floor(nowTimestamp - time)
            if (interval <= 3600) {
                if (Math.ceil(interval / 60) === 0) {
                    return '刚刚'
                } else {
                    return Math.ceil(interval / 60) + '分钟前'
                }
            } else if (
                dayjs(time * 1000).format('YYYY-MM-DD') ===
                dayjs().format('YYYY-MM-DD')
            ) {
                return dayjs(time * 1000).format('HH:mm')
            } else if (
                dayjs(time * 1000).format('YYYY') === dayjs().format('YYYY')
            ) {
                return dayjs(time * 1000).format('MM-DD HH:mm')
            } else {
                return dayjs(time * 1000).format('YYYY-MM-DD HH:mm')
            }
        },
        cutByteLen
    }
}
</script>

<style lang="scss" scoped>
.divider {
    height: 10px;
    background: #f1f3f8;
}
.recommond {
    margin: 21px 10px;
}
.recommond > p {
    margin: 0 6px 8px;
    font-size: 16px;
}
.item {
    position: relative;
    border-bottom: 1px solid rgba(#e1e1e1, 0.3);
}
.item-enter {
    display: block;
    padding: 12px 0 7px 6px;
    &.nopic {
        .rc-title {
            height: auto;
            max-height: 72px;
            margin-right: 6px;
        }
    }
}
.rc-img {
    position: absolute;
    right: 6px;
    top: 14px;
    width: 109px;
    height: 69px;
    border-radius: 2px;
}
.rc-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    font-size: 16px;
    line-height: 24px;
    height: 72px;
    color: #353547;
    margin-right: 132px;
}
.ft-info {
    margin: 0 6px 10px;
}
.ft-hot {
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 10px;
    line-height: 14px;
    border: 1px solid #e72653;
    color: #e72653;
    margin-right: 8px;
    padding: 0 2px;
    border-radius: 1px;
}
.ft-text {
    vertical-align: top;
    font-size: 12px;
    line-height: 16px;
    color: #aaaab4;
    margin-right: 8px;
}
.dis {
    position: absolute;
    right: 6px;
    bottom: 12px;
    width: 21px;
    height: 13px;
}
</style>
