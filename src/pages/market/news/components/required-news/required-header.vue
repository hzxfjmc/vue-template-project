<template lang="pug">
    header.required-header
        h1.title
            span(v-if="data && data.daily_type") {{ dailyType(data.daily_type) }}
            | {{ data.title }}
        p.sub-info
            span(v-if="data.source") {{ data.source | cutByteLen(20) }}
            | {{ $timeFormat(data.release_time * 1000) }}
        yx-audio.audio(v-if="data.voice_url" :src="data.voice_url")
        p.greetings(v-if="data.main_summary") {{ data.main_summary }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import yxAudio from '@/components/yx-audio/index'
import cutByteLen from '../../../0-filters/cut-byte-len'

export default {
    name: 'required-header',
    props: {
        data: { default: null }
    },
    methods: {
        gotoNativeModule(url) {
            JSBridge.gotoNativeModule(url)
        },
        dailyType(type) {
            const map = new Map([
                [1, this.$t('morning')],
                [2, this.$t('noon')],
                [3, this.$t('evening')],
                [4, this.$t('usInsight')],
                [5, this.$t('hotNews')],
                [6, this.$t('yUsInsight')]
            ])
            return map.get(type) || ''
        }
    },
    filters: {
        cutByteLen
    },
    components: {
        yxAudio
    }
}
</script>

<style lang="scss" scoped>
.required-header {
    margin: 0 8px;
    .title {
        font-size: 24px;
        line-height: 33px;
        margin: 18px 7px 0;
        color: #353547;
        text-align: justify;
        font-weight: bold;
        letter-spacing: 0.2px;
        span {
            display: inline-block;
            background: #bb1919;
            font-size: 17px;
            color: #fff;
            line-height: 26px;
            padding: 0 6px;
            text-align: center;
            margin-right: 8px;
            position: relative;
            bottom: 2px;
        }
    }
    .sub-info {
        margin: 8px 7px 20px;
        color: #aaaab4;
        font-size: 12px;
        span {
            margin-right: 14px;
        }
    }
    .audio {
        margin: 0 6px 20px;
    }
    .greetings {
        color: rgba(#353547, 0.7);
        background: rgba(#9a9aa3, 0.06);
        font-size: 18px;
        padding: 16px;
        text-align: justify;
        margin: 0 8px;
    }
}
</style>
