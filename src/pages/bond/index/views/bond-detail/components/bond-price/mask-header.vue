<template lang="pug">
    van-panel.mask-header(:title="title")
        col-msg(
            :colData="colData"
            :descStyle="descStyle"
        )
</template>

<script>
import { Panel } from 'vant'
import ColMsg from '@/pages/bond/index/biz-components/col-msg'
export default {
    name: 'MaskHeader',
    components: {
        [Panel.name]: Panel,
        ColMsg
    },
    props: {
        maskData: {
            type: Object,
            defatult: () => {}
        }
    },
    data() {
        return {
            descStyle: {}
        }
    },
    computed: {
        title() {
            return this.maskData && this.maskData.title
        },
        colData() {
            return this.maskData && this.maskData.colData
        }
    }
}
</script>

<style lang="scss" scoped>
.mask-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding-bottom: 10px;
    background-color: #f4f8ff;
}
.van-panel {
    .van-panel__header {
        padding: 0.28rem 0.24rem;
        background-color: #f4f8ff;
        font-size: 0.28rem;
        line-height: 20px;
        &:after {
            display: none;
        }
    }
    &:after {
        display: none;
    }
}
.col-column {
    padding: 0 0.24rem 0 0.24rem;
    margin-top: -0.04rem;
}
</style>
