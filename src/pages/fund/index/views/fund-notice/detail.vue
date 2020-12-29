<template lang="pug">
    .fund-notice-detail
        yx-container
            .block__header(v-if="noticeInfo.title" slot="top")
                .title {{noticeInfo.title}}{{$t('detail')}}
                .info
                    .date {{noticeInfo.publishDate}}
                    .tip(@click="toJumpPage") {{$t('disclaimers')}}
            div(slot="main")
                .fund-file(
                    v-for="item,i in noticeInfo.docUrlList" 
                    @click="toJumpLink(item)"
                    :key="i"
                )
                    .file-name {{item | fileName}}
                    img(:src="isPdfFile(item) ? pdfPath : htmlPath")
            //- id为-1 时为没有关联基金公司
            .fund-company-notice(
                slot="bottom"
                v-if="noticeInfo.companyId != '-1'" 
                @click="toFundCompany(noticeInfo.companyId)"
            )
                .left
                    .logo
                        img(:src="noticeInfo.logoUrl")
                    .name {{noticeInfo.companyName}}
                .right
                    span.iconfont.icon-iconEBgengduoCopy

</template>
<script>
import { getFundNotice } from '@/service/finance-info-server'
import { getCosUrl } from '@/utils/cos-utils'
import { jumpUrl } from '@/utils/tools'
export default {
    name: 'fund-notic',
    data() {
        return {
            noticeInfo: {},
            pdfPath: require('@/assets/img/fund/pdf.png'),
            htmlPath: require('@/assets/img/fund/html.png'),
            defaultLogo: require('@/assets/img/fund/notice_default_logo.png')
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
                if (this.noticeInfo.iconUrl) {
                    let url = await getCosUrl(this.noticeInfo.iconUrl)
                    this.$set(this.noticeInfo, 'logoUrl', url)
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        toFundCompany(id) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-company-detail?id=${id}`
            jumpUrl(3, url)
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
.fund-company-notice {
    padding: 10px 10px 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 3px 6px 1px rgba(228, 228, 228, 0.5);
    .left {
        display: flex;
        line-height: 20px;
        align-items: center;
    }
    .name {
        padding-left: 15px;
        font-size: 12px;
    }
    .logo {
        width: 102px;
        height: 52px;
    }
    img {
        width: 102px;
        height: 52px;
    }
}
</style>
