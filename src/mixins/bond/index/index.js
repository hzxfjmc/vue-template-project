import { Swipe, SwipeItem } from 'vant'
import { getBondList } from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import BondCard from '@/biz-components/bond-card/index.vue'
export default {
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        BondCard
    },
    created() {
        this.handleSetupResult()

        // 滑动到底触发更新数据
        window.addEventListener('scroll', this.pullRequest)
    },
    data() {
        return {
            hasData: true,
            bannerUrl: [],
            bondList: [],
            timer: null,
            isShowPage: false,
            pageSize: 30, // 每页条数
            pageNum: 1 // 当前页数
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            await Promise.all([
                this.handleGetBondBanner(),
                this.handleGetBondList()
            ])
            this.isShowPage = true
        },
        // 拉取债券banner
        async handleGetBondBanner() {
            try {
                // this.bannerUrl = ['/wealth/']
                let data = await bannerAdvertisement(20)
                this.bannerUrl = (data && data.banner_list) || []
                console.log('getBondBanner:error:>>>', data)
            } catch (error) {
                console.log('getBondBanner:error:>>>', error)
            }
        },
        // 获取债券列表
        async handleGetBondList() {
            try {
                let { bondInfoAndCurrentPriceApiResponses } = await getBondList(
                    {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                )
                let listArray = bondInfoAndCurrentPriceApiResponses || []
                if (!listArray || listArray.length === 0) {
                    // this.$dialog.alert({
                    //     message: '没有更多数据了'
                    // })
                    this.hasData = false
                    return
                } else {
                    this.hasData = true
                }
                this.bondList = this.bondList.concat(listArray)
                console.log(
                    'getBondList:data:>>> ',
                    bondInfoAndCurrentPriceApiResponses
                )
            } catch (e) {
                console.log('getBondList:error:>>>', e)
            }
        },
        // 防抖，获取债券列表数据
        pullRequest() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                let htmlEle = document.querySelector('html')
                let winHeight = window.innerHeight
                let winScrollTop = window.scrollY
                if (winScrollTop + winHeight >= htmlEle.scrollHeight - 100) {
                    console.log('到底了 :')
                    this.pageNum++
                    this.handleGetBondList()
                }
            }, 300)
        }
    },
    beforeDestroy() {
        // 滑动到底触发更新数据
        window.removeEventListener('scroll', this.pullRequest)
    }
}
