<template lang="pug">
    .fund-notic
        .notic-card(v-for="item in fundNoticList" :key="item.fundId")
            .name {{item.fundName}}
                span {{$t('fundNotic')}}
            .date {{item.date}}
</template>
<script>
export default {
    name: 'fund-notic',
    data() {
        return {
            fundNoticList: [
                {
                    fundName: '易方达',
                    fundId: '2',
                    date: '2020-10-23 10:00:00'
                },
                {
                    fundName: '易方达2',
                    fundId: '1',
                    date: '2020-10-23 10:00:00'
                }
            ]
        }
    }
}
</script>
<style lang="scss">
.fund-notic {
    margin: 12px;
}
.notic-card {
    padding: 16px 12px;
    margin-bottom: 8px;
    background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(25, 25, 25, 0.05);
    border-radius: 4px;
    .name {
        font-size: 16px;
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
</style>
