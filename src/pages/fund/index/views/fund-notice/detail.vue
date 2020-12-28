<template lang="pug">
    .fund-notice-detail
        .block__header(v-if="noticeInfo.title")
            .title {{noticeInfo.title}}{{$t('detail')}}
            .info
                .date {{noticeInfo.publishDate}}
                .tip(@click="toJumpPage") {{$t('disclaimers')}}
        .fund-file(
            v-for="item,i in noticeInfo.docUrlList" 
            @click="toJumpLink(item)"
            :key="i"
        )
            .file-name {{item | fileName}}
            img(:src="isPdfFile(item) ? pdfPath : htmlPath")
        .fund-company(v-if="false")
            .left
                .logo
                    img(:src="logoUrl" v-if="logoUrl")
                .name
            .right
                span.iconfont.icon-iconEBgengduoCopy

</template>
<script>
import {
    getFundNotice,
    getListFundCompany
} from '@/service/finance-info-server'
import { getCosUrl } from '@/utils/cos-utils'
import { jumpUrl } from '@/utils/tools'
export default {
    name: 'fund-notic',
    data() {
        return {
            noticeInfo: {},
            companyInfo: {
                companyName: '',
                logoUrl: ''
            },
            pdfPath: require('@/assets/img/fund/pdf.png'),
            htmlPath: require('@/assets/img/fund/html.png')
        }
    },
    async created() {
        await this.getFundNotice()
        await this.getListFundCompany()
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
        async getListFundCompany() {
            try {
                let data = await getListFundCompany({
                    pageNum: 1,
                    pageSize: 20,
                    companyId: this.noticeInfo.companyId
                })
                console.log(data)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        toJumpPage() {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-notice-disclaimers`
            jumpUrl(3, url)
        },
        async toJumpLink(path) {
            try {
                const res = await getCosUrl(path)
                window.location.href = res
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
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
    .info {
        display: flex;
        justify-content: space-between;
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
.fund-company {
    position: absolute;
    bottom: 20px;
}
</style>
