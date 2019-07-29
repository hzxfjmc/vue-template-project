<template lang="pug">
yx-container.award-center(:class="appType==1?'ch-award':'hk-award'")
    .header(slot="top")
       van-tabs(@click="onClick" :line-width="32")
         van-tab(v-for="(item,index) in titleList" :key="index")
            span(slot="title")
               span(class='navItem') {{item}}
               span(class="number" v-if="index==0 && total>0") {{list[0].couponList.length}}
    .main(slot="main")
        van-list(v-model="list[tabindex].loading"
                :finished="list[tabindex].finished"
                :finished-text="list[tabindex].finishedtext"
                :immediate-check="false"
                @load="onLoad(tabindex)"
            )
                .emptys(v-if="list[tabindex].couponList.length===0")
                    img(:src="empty")
                    .noCard {{$t('noCard')}}
                    .goToActive(@click="goToCenter") {{$t('gotoCenter')}}
                div(v-else v-for="(item,index) in list[tabindex].couponList" :key="index")
                    ChItem(:cardData="item" :index='tabindex' @updateData="updateData" @buttonHandle='buttonHandle(item)')
        HkPopup(v-model='show' :popData="popData" @listenConfirm='updateData')
</template>

<script>
import { couponList } from '@/service/product-server.js'
import ChItem from '../../components/ch-item.vue'
import HkPopup from '../../components/award-popup.vue'
import empty from '@/assets/img/marketing/award-center/empty.png'
import { Tab, Tabs, List } from 'vant'
import { getAppType } from '@/utils/html-utils'
export default {
    name: 'ch',
    components: {
        ChItem,
        HkPopup,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [List.name]: List
    },
    data() {
        return {
            appType: '',
            active: 1,
            tabindex: 0,
            show: false,
            popData: {},
            empty,
            selectType: 1, //默认待使用
            total: 0, //默认是0
            list: [
                {
                    couponList: [],
                    loading: false,
                    finished: false,
                    pageNum: 2,
                    finishedtext: ''
                },
                {
                    couponList: [],
                    loading: false,
                    finished: false,
                    pageNum: 2,
                    finishedtext: ''
                },
                {
                    couponList: [],
                    loading: false,
                    finished: false,
                    pageNum: 2,
                    finishedtext: ''
                }
            ]
        }
    },
    created() {
        this.initData(0)
        this.appType = getAppType()
    },
    computed: {
        //因为这个要多语言所以放在computed里
        titleList() {
            return [
                this.$t('toBeUsed'),
                this.$t('hasUsed'),
                this.$t('hasExpire')
            ]
        }
        //这里为什么要搞成三个onload，是因为如果写成一个会互相影响。详情见这里
        // 不建议多个 List 组件共用同一个 loading 和 finished 状态，建议通过不同变量区分
        //https://github.com/youzan/vant/issues/2115
    },
    mounted() {},
    methods: {
        async onClick(index) {
            this.tabindex = index
            this.selectType = index + 1
            this.initData(index)
        },
        async initData(index) {
            try {
                let params = {}
                //待使用加载100张
                if (index === 0) {
                    params = {
                        pageNum: 1,
                        pageSize: 100,
                        selectType: this.selectType
                    }
                } else {
                    params = {
                        pageNum: 1,
                        pageSize: 5,
                        selectType: this.selectType
                    }
                }
                this.$loading()
                let { list, total } = await couponList(params)
                this.$close()
                //这里切换太快的话可能上一个的list给下一个的couponList
                //补救办法加loading
                if (index === 0) {
                    this.total = total
                }
                //第一次进去要值
                if (
                    Array.isArray(list) &&
                    this.list[this.tabindex].couponList.length === 0
                ) {
                    this.list[this.tabindex].couponList = list
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async onLoad(index) {
            try {
                //这里有个坑，list返回null 如果写list.length会报错
                let params = {}
                //待使用每次加载10张，其他的5张
                if (index === 0) {
                    params = {
                        pageNum: this.list[index].pageNum,
                        pageSize: 100,
                        selectType: this.selectType
                    }
                } else {
                    params = {
                        pageNum: this.list[index].pageNum,
                        pageSize: 5,
                        selectType: this.selectType
                    }
                }
                let { list } = await couponList(params)
                if (Array.isArray(list) && list.length) {
                    this.list[index].pageNum++
                    this.list[index].couponList = this.list[
                        index
                    ].couponList.concat(list)
                } else {
                    this.list[index].finished = true
                    this.list[index].finishedtext = this.$t('noMore')
                }
                this.list[index].loading = false
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        buttonHandle(item) {
            this.popData = Object.assign({}, item)
            this.show = true
        },
        async updateData() {
            let params = {
                pageNum: 1,
                pageSize: 1000,
                selectType: 1
            }
            let { list, total } = await couponList(params)
            //list有可能为null
            this.list[0].couponList = !list ? [] : list
            this.total = total
            this.list[0].finished = false
        },
        goToCenter() {
            this.$router.push({ name: 'activity-center' })
        }
    }
}
</script>

<style lang="scss" scoped>
.award-center {
    background-color: $background-bottom-color;
    .header {
        width: 100%;
        color: #393939;
    }
    .main {
        background-color: $background-bottom-color;
        padding: $global-padding $global-padding 0;
        height: 100%;
    }
    .active {
        background: rgba(40, 90, 200, 1);
    }
    .navItem {
        font-size: 16px;
    }
    .number {
        position: absolute;
        top: 4px;
        right: 22px;
        width: 12px;
        height: 12px;
        background: #ff4a4a;
        border-radius: 6px;
        line-height: 12px;
        color: #fff;
        font-size: 10px;
    }

    .noCard {
        color: #b1b1b1;
    }
    .goToActive {
        width: 130px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        color: #fff;
        background: rgba(1, 33, 220, 1);
        border-radius: 6px;
        margin-top: 20px;
    }
    .van-list > div:not(:first-child) {
        margin-top: 20px;
    }
}
.hk-award {
    .goToActive {
        background: $hk-primary-color;
    }
}
</style>
<style lang="scss">
.hk-award {
    .van-tab--active {
        color: $hk-primary-color;
    }
    .van-tabs__line {
        background: $hk-primary-color;
    }
}
.ch-award {
    .van-tab--active {
        color: $primary-color;
    }
    .van-tabs__line {
        background: $primary-color;
    }
}
//自定义样式写在scoped有问题，我也不知道为啥
.emptys {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 400px;
    img {
        width: 130px;
    }
}
</style>
