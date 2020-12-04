<template lang="pug">
    .fund-company-detail
        .block__header
            .log
                img(:src="companyInfo.logUrl")
            .name {{companyInfo.longName}}
        .block__content
            .desc(:class="{all: !showMore}") PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理有洋投资管理有限公司限管理有限公司限
            .btn(@click="showMore=!showMore") {{showMore ? '展开' : '收起'}}
</template>
<script>
import { getListFundCompany } from '@/service/finance-info-server'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    name: 'fund-company-detail',
    data() {
        return {
            companyInfo: {},
            showMore: true
        }
    },
    methods: {
        async getListFundCompany() {
            try {
                let data = await getListFundCompany({
                    companyId: this.$route.params.id
                })
                this.companyInfo = data.list[0]
                this.companyInfo.longName = this.$t([
                    this.companyInfo.companyNameCn,
                    this.companyInfo.companyNameHk,
                    this.companyInfo.companyNameEn
                ])
                this.companyInfo.desc = this.$t([
                    this.companyInfo.descCn,
                    this.companyInfo.descHk,
                    this.companyInfo.descEn
                ])
                let url = await getCosUrl(this.companyInfo.iconUrl)
                this.companyInfo.logUrl = url
            } catch (e) {
                this.message.error(e.msg || '网络开小差了，请稍后再试')
            }
        }
    }
}
</script>
<style lang="scss">
.block__header {
    width: 100%;
    height: 147px;
    background: url('~@/assets/img/fund/fund_company_bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.block__content {
    position: relative;
    display: flex;
    top: -35px;
    width: 100%;
    padding: 20px 14px;
    background: linear-gradient(180deg, #f3f3f3 0%, #ffffff 100%);
    border-radius: 10px 10px 0px 0px;
    .desc {
        width: 93%;
        line-height: 24px;
        text-align: justify;
        white-space: pre-line;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        &.all {
            display: flex;
        }
    }
    .btn {
        display: flex;
        color: #2177ff;
        font-size: 12px;
        align-items: flex-end;
    }
}
</style>
