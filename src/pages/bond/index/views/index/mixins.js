import { Swipe, SwipeItem } from 'vant'
import { getBondList } from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
export default {
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    created() {
        this.handleSetupResult()

        // 滑动到底触发更新数据
        // window.addEventListener('scroll', this.pullRequest)
    },
    mounted() {
        this.$refs.bondIndexWrapper.addEventListener('scroll', this.pullRequest)
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

            // 回显浏览器滚动距离
            document.querySelector(
                '.bond-index-wrapper'
            ).scrollTop = this.$LS.get('bond-index-scrollTop')
        },
        // 拉取债券banner
        async handleGetBondBanner() {
            try {
                let data = await bannerAdvertisement(20)
                this.bannerUrl = (data && data.banner_list) || []
                // this.bannerUrl = ['/wealth/']
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
                // 存储页面滚动距离，用于回显滚动距离
                this.$LS.put(
                    'bond-index-scrollTop',
                    document.querySelector('.bond-index-wrapper').scrollTop
                )

                // let htmlEle = document.querySelector('html')
                let htmlEle = this.$refs.bondIndexWrapper
                let winHeight = this.$refs.bondIndexWrapper.clientHeight
                let winScrollTop = this.$refs.bondIndexWrapper.scrollTop
                // console.log('winHeight :', winHeight)
                // console.log('winScrollTop :', winScrollTop)
                // console.log('htmlEle.scrollHeight :', htmlEle.scrollHeight)
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
        this.$refs.bondIndexWrapper.removeEventListener(
            'scroll',
            this.pullRequest
        )

        // window.removeEventListener('scroll', this.pullRequest)
    }
}
