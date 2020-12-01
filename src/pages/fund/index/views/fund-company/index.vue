<template lang="pug">
    .fund-company
        .company(v-for="item in fundCompanyList")
            img(:src="item.src")
</template>
<script>
export default {
    name: 'fund-company',
    data() {
        return {
            fundCompanyList: []
        }
    }
}
</script>
<style lang="scss">
.fund-company {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #f3f3f3 0%, #ffffff 100%);
}
.company {
    width: 102px;
    height: 52px;
    background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(228, 228, 228, 0.5);
    border-radius: 2px;
}
</style>
