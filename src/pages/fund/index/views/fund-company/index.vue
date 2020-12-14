<template lang="pug">
    .fund-company
        .log(
            v-for="item in fundCompanyList" 
            @click="toFundCompanyDetail(item.companyId)"
            :key="item.companyId"
        )
            img(:src="item.iconUrl" v-if="item.iconUrl")
            .name {{$t([item.companySampleNameCn, item.companySampleNameHk, item.companySampleNameEn])}}
</template>
<script>
import { getListFundCompany } from '@/service/finance-info-server'
import { getCosUrl } from '@/utils/cos-utils'
import { jumpUrl } from '@/utils/tools'
export default {
    name: 'fund-company',
    data() {
        return {
            fundCompanyList: [],
            pageNum: 1,
            pageSize: 20,
            total: 0
        }
    },
    created() {
        this.getListFundCompany()
    },
    methods: {
        async getListFundCompany() {
            try {
                let data = await getListFundCompany({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                this.fundCompanyList = data.list
                this.total = data.total
                this.fundCompanyList.forEach(async item => {
                    let url = await getCosUrl(item.iconUrl)
                    item.iconUrl = url
                })
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        toFundCompanyDetail(id) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-company-detail?id=${id}`
            jumpUrl(3, url)
        }
    }
}
</script>
<style lang="scss" scoped>
.fund-company {
    height: 100%;
    padding: 20px 12px;
    display: grid;
    grid-row-gap: 12px;
    grid-column-gap: 22px;
    grid-template-columns: repeat(auto-fill, 102px);
    grid-template-rows: repeat(auto-fill, 62px);
    background: linear-gradient(180deg, #f3f3f3 0%, #ffffff 100%);
}
.log {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 10px 0 5px 0;
    background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(228, 228, 228, 0.5);
    border-radius: 2px;
    img {
        width: 83px;
        height: 31px;
    }
    .name {
        padding-top: 3px;
    }
}
</style>
