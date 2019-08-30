<template lang="pug">
.fund-list-item
    h3.fund-title {{title}}
    span.fund-subtitle {{subtitle}}
    FundStep
    FundCell(:cellList="cellList")
</template>
<script>
import FundStep from '../common/fund-step'
import FundCell from '../common/fund-cell'
export default {
    components: {
        FundStep,
        FundCell
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        subtitle: {
            type: String,
            default: ''
        },
        cellList: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.fund-list-item {
    background: #fff;
    padding: 10px;
    .fund-title {
        line-height: 50px;
        border-bottom: 1px solid #e1e1e1;
    }
    .fund-subtitle {
        display: inline-block;
        line-height: 50px;
    }
}
</style>
