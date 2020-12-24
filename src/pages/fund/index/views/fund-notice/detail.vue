<template lang="pug">
    .fund-notice-detail
        .block__header
            .title {{$t([noticeInfo.titleCn, noticeInfo.titleHk, noticeInfo.titleEn])}}{{$t('detail')}}
            .date {{noticeInfo.publishDate}}
        .fund-file(
            v-for="item,i in noticeInfo.docUrlList" 
            @click="toJumpLink(item)"
            :key="i"
        )
            .file-name {{item | fileName}}
            img(:src="isPdfFile(item) ? pdfPath : htmlPath")

</template>
<script>
import { getFundNotice } from '@/service/finance-info-server'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    name: 'fund-notic',
    data() {
        return {
            noticeInfo: {},
            pdfPath: require('@/assets/img/fund/pdf.png'),
            htmlPath: require('@/assets/img/fund/html.png')
        }
    },
    created() {
        this.getFundNotice()
    },
    filters: {
        fileName(path) {
            return path.split('/')[path.split('/').length - 1]
        }
    },
    methods: {
        async getFundNotice() {
            try {
                let data = await getFundNotice({
                    id: this.$route.query.id
                })
                this.noticeInfo = data || {}
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async toJumpLink(path) {
            try {
                const res = await getCosUrl(path)
                window.location.href = res
            } catch (e) {
                console.log('赎回页面-getCosUrl:error:>>>', e)
            }
        },
        isPdfFile(path) {
            return path.endsWith('pdf')
        }
    }
}
</script>
<style lang="scss">
.fund-notice-detail {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 12px 14px;
}
.block__header {
    margin-bottom: 14px;
    .title {
        font-size: 18px;
        font-weight: 600;
        line-height: 22px;
    }
    .date {
        margin-top: 6px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(25, 25, 25, 0.3);
        line-height: 17px;
    }
}
.fund-file {
    display: flex;
    padding: 12px 14px;
    margin-bottom: 6px;
    justify-content: space-between;
    align-items: center;
    background: #f3f3f3;
    color: rgba(25, 25, 25, 0.5);
    img {
        width: 33px;
        height: 41px;
    }
}
</style>
