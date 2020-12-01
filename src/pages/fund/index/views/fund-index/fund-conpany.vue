<template lang="pug">
    .fund-company
        .block__header
            .title {{$t('fundCompany')}}
            .more {{$t('viewMore')}}
                span.iconfont.icon-iconEBgengduoCopy
        .block__content
            .fund__info(v-for="item in fundCompanyList")
                img(:src="item.src")
</template>
<script>
export default {
    name: 'fund-company',
    props: {
        fundCompanyList: {
            type: Array,
            default: () => []
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
    img {
        width: 102px;
        height: 52px;
    }
}
</style>
