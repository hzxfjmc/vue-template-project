<template lang="pug">
    yx-container.mission-detail
        .main(slot="main")
            .title
                p 任务名称：{{baseInfo.taskName || '-'}}
                p 任务时间：{{baseInfo.beginTime}}-{{baseInfo.endTime}}
                p 完成情况：{{baseInfo.progressCount || 0}}人/{{baseInfo.kpiCount || 0}}人
            ul
                li(
                v-for="(listItem, index) in list"
                :key="index"
                ) {{index + 1}}. {{listItem.name}} 完成时间 {{listItem.time}}
        .footer(slot="bottom")
            van-button(
            type="primary"
            size="large"
            @click="back"
            ) 返回
</template>
<script>
import { taskDetail } from '@/service/marketing-manage'
export default {
    data: () => ({
        baseInfo: {},
        list: []
    }),
    async created() {
        let { baseInfo, list } = await taskDetail({
            id: this.$route.params.id
        })
        this.baseInfo = baseInfo || {}
        this.list = (list && list.list) || []
    },
    methods: {
        back() {
            history.back(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.mission-detail {
    .main {
        padding: 30px $global-padding;
    }
    .title {
        font-size: 18px;
    }
    ul {
        margin-top: 22px;
        li {
            line-height: 32px;
        }
    }
    .footer {
        padding: $global-padding;
    }
}
</style>
