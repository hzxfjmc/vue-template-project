<template lang="pug">
.fund-list-item
    h3.fund-title(class="border-bottom") {{title}}
    span.fund-subtitle {{subtitle}}
    slot(name="fundStep")
    //- FundStep(
    //-     :oneStep="oneStepContent"
    //-     :twoStep="twoStepContent"
    //-     :threeStep="threeStepContent")
    FundCell(:cellList="cellList")
</template>
<script>
import FundCell from '../common/fund-cell'
export default {
    components: {
        // FundStep,
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
        },
        oneStepContent: {
            type: Object
        },
        twoStepContent: {
            type: Object
        },
        threeStepContent: {
            type: Object
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
    }
    .fund-subtitle {
        display: inline-block;
        line-height: 50px;
    }
}
</style>
