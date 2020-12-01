<template lang="pug">
    .fund-notic-detail
        .block__header
            .title 易方达基金公告详情
            .date 2020-09-15
        .fund-file(v-for="item in list")
            .file-name {{item.name}}
            img(:src="item.type === 'pdf' ? pdfPath : htmlPath")

</template>
<script>
export default {
    name: 'fund-notic',
    data() {
        return {
            pdfPath: require('@/assets/img/fund/pdf.png'),
            htmlPath: require('@/assets/img/fund/html.png'),
            list: [
                {
                    id: '1',
                    name: '2020Q3财务报表',
                    type: 'pdf'
                },
                {
                    id: '2',
                    name: '2020Q2财务报表',
                    type: 'html'
                }
            ]
        }
    }
}
</script>
<style lang="scss">
.fund-notic-detail {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 12px 14px;
}
.block__header {
    margin-bottom: 14px;
    .name {
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
