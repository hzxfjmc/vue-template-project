<template lang="pug">
    .fund-notice
        van-list.fund-notice-list(
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            :finished-text="finishedText" 
        )
            .notic-card(
                v-for="item in list" 
                :key="item.id"
                @click="handleToDetail(item.id)"
            )
                .left
                    .name {{item.title}}
                        span {{$t('fundNotic')}}
                    .date {{item.publishDate}}
                .right(v-if="item.show")
                    img(:src="item.logoUrl ? item.logoUrl : defaultLogo")
</template>
<script>
import { getListFundNotice } from '@/service/finance-info-server'
import { getCosUrl } from '@/utils/cos-utils'
import { jumpUrl } from '@/utils/tools'
import { List } from 'vant'
export default {
    name: 'fund-notice',
    components: {
        [List.name]: List
    },
    data() {
        return {
            finishedText: '',
            finished: true,
            loading: false,
            pageNum: 1,
            pageSize: 20,
            total: 0,
            defaultLogo: require('@/assets/img/fund/notice_default_logo.png'),
            list: []
        }
    },
    created() {
        this.getListFundNotice()
    },
    methods: {
        onLoad() {
            if (this.list.length < this.total && !this.lockOnload) {
                this.pageNum = this.pageNum + 1
                this.getListFundNotice()
            }
        },
        async getListFundNotice() {
            try {
                const params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getListFundNotice(params)
                this.list = this.list.concat(list)
                this.total = Number(total)
                this.pageNum = pageNum
                this.pageSize = pageSize
                if (this.list.length === this.total) {
                    this.finished = true
                }
                this.list.forEach(async item => {
                    if (item.iconUrl) {
                        let url = await getCosUrl(item.iconUrl)
                        item.show = true
                        this.$set(item, 'logoUrl', url)
                    } else {
                        item.show = true
                    }
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handleToDetail(id) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-notice-detail?id=${id}`
            jumpUrl(3, url)
        }
    }
}
</script>
<style lang="scss">
.fund-notice {
    margin: 12px;
}
.notic-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    .right {
        width: 102px;
        height: 52px;
        background: #fff;
        img {
            width: 102px;
            height: 52px;
        }
    }
}
</style>
