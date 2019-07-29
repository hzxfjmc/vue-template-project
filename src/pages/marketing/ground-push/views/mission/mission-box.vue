<template lang="pug">
    .mission-box(@click="goDetail")
        p 任务名称：{{item.taskName}}
        p 任务时间：{{item.period}}
        p 完成情况：{{item.progressCount || 0}}人/{{item.kpiCount || 0}}人
</template>
<script>
import mixins from '../../util/mixins'
export default {
    mixins: [mixins],
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        goDetail() {
            this.$router.push(`/mission/${this.item.id}`)
        }
    }
}
</script>
<style lang="scss" scoped>
.mission-box {
    /*border: 1px dashed $border-color;*/
    border-radius: 10px;
    /*height: 140px;*/
    margin-bottom: 20px;
    padding: 15px;
    line-height: 28px;
    box-shadow: 0 2px 4px 0 rgba(57, 57, 57, 0.05);
    border: 1px solid rgb(247, 247, 247);
    background-color: #fff;
}
</style>
