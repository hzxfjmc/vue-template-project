<template lang="pug">
    .mission-list
        template(v-if="dataList && dataList.length")
            mission-box(
            v-for="(item, index) in dataList"
            :key="index"
            :item="item"
            )
        template(v-if="doneList && doneList.length")
            p -------------&nbsp;&nbsp;已结束任务&nbsp;&nbsp;------------
            mission-box(
            v-for="(item, index) in doneList"
            :key="index"
            :item="item"
            )
        .empty(v-else)
            img(
            src="@/assets/img/marketing/ground-push/empty.png"
            )
            p 暂无记录
</template>
<script>
import missionBox from './mission-box'
import { taskList } from '@/service/marketing-manage'
export default {
    components: {
        missionBox
    },
    data: () => ({
        dataList: [],
        doneList: []
    }),
    async created() {
        let list = await taskList()
        let dataList = []
        // 未结束任务
        this.doneList = list.reduce((rs, item) => {
            if (item.status === 1 || item.status === 2) {
                dataList.push(item)
                return rs
            }
            rs.push(item)
            return rs
        }, [])
        // 已结束任务
        this.dataList = dataList
        console.log(this.dataList)
        console.log(this.doneList)
    }
}
</script>
<style lang="scss" scoped>
.mission-list {
    .empty {
        padding-top: 80px;
        color: $hk-text-color4;
        text-align: center;
        img {
            width: 130px;
            margin-bottom: 10px;
        }
    }
    p {
        text-align: center;
        color: $hk-text-color6;
        margin-bottom: 20px;
    }
}
</style>
