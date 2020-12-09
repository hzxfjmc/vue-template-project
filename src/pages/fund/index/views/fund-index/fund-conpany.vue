<template lang="pug">
    .fund-company
        .block__header
            .title {{$t('fundCompany')}}
            .more(@click="toFundCompany") {{$t('viewMore')}}
                span.iconfont.icon-iconEBgengduoCopy
        .block__content
            .fund__info(v-for="item in fundCompanyList")
                img(:src="item.src")
                .name {{$t([item.companySampleNameCn, item.companySampleNameHk, item.companySampleNameEn])}}
</template>
<script>
import { jumpUrl } from '@/utils/tools'
export default {
    name: 'fund-company',
    props: {
        fundCompanyList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        toFundCompany() {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-company`
            jumpUrl(3, url)
        }
    }
}
</script>
<style lang="scss" scoped>
.fund-company {
    max-height: 185px;
    margin: 12px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    background: #fff;
}
.block__header {
    display: flex;
    justify-content: space-between;
    padding: 14px;
    .title {
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
    }
    .more {
        color: rgba(25, 25, 25, 0.65);
        line-height: 20px;
    }
}
.block__content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .fund__info {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 10px 0 5px 0;
        background: #ffffff;
        box-shadow: 0px 3px 6px 1px rgba(228, 228, 228, 0.5);
        border-radius: 2px;
    }
    img {
        width: 102px;
        height: 52px;
    }
    .name {
        padding-top: 3px;
        width: 83px;
        height: 31px;
    }
}
</style>
