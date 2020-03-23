<template lang="pug">
.block__yxbao--page
    .block__yxbao--header
        .block__yxbao--content
            .block__yxbao--tip 持有资产(港币)
                em.iconfont(
                    @click="changeHidePadShow"
                    :class="[hidePadShow?'icon-icon-eye':'icon-icon-eye-hide']")
            .block__yxbao--num.block__amount(v-if="hidePadShow") {{positionMarketValue}}
            .block__yxbao--num(v-else) ****
            .block__yxbao--numtip 
                p 昨日收益 
                    em.num(v-if="hidePadShow") {{yesterdayEarnings}}
                    em.num(v-else) ****
                    em 元
            .block__yxbao--list
                .block__yxbao--item(@click="toYxbaoPage")
                    p.top 万元收益
                    p.bottom(v-if="hidePadShow") {{tenThousandApy}}
                    p.bottom(v-else) ****
                .block__yxbao--item(@click="toYxbaoPage")
                    p.top 七日年化(%)
                    p.bottom {{sevenDaysApy}}
                .block__yxbao--item
                    p.top 累计收益
                    p.bottom(v-if="hidePadShow") {{totalEarnings}}
                    p.bottom(v-else) ****
            .block__yxbao-btn
                van-button.btn-color-l(@click="jumpPage('transfer-out')") 转出
                van-button.btn-color-r(@click="jumpPage('transfer-into')") 转入
    .block__yx-tab
        .block__list--item
            em.iconfont.icon-rujin
            span 入金       
        .block__list--item
            em.iconfont.icon-shouru
            span 收益明细        
        .block__list--item
            em.iconfont.icon-zijin
            span 资金记录                

    .block-bannar-swiper
        van-swipe(:autoplay="3000")  
            van-swipe-item(
                v-for="(item, index) in banner_list" 
                @click="goBanner(item)"
                :key="index") 
                img(:src="item.picture_url") 

    .block__fund--list
        .block__title 精选基金
        fundCard(
            v-if="recommendList.length != 0"
            :recommendList="recommendList")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getBaoPostion } from '@/service/finance-server.js'
import {
    getBaoFundInfo,
    getFundRecommendList
} from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import fundCard from './fund-card.vue'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        fundCard
    },
    data() {
        return {
            banner_list: [],
            recommendList: [],
            hidePadShow: true,
            positionMarketValue: '',
            yesterdayEarnings: '',
            totalEarnings: '',
            fundId: '',
            tenThousandApy: '',
            sevenDaysApy: ''
        }
    },
    async created() {
        this.getBaoPostion()
        this.bannerAdvertisement()
        await this.getBaoFundInfo()
        this.getFundRecommendList()
    },
    methods: {
        //跳转
        jumpPage(path) {
            this.$router.push({
                name: path,
                query: {
                    id: this.fundId
                }
            })
        },
        async bannerAdvertisement() {
            try {
                const res = await bannerAdvertisement(26)
                this.banner_list = res.banner_list
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        toYxbaoPage() {
            this.$router.push({
                name: 'fund-details',
                query: { id: this.fundId, displayLocation: 3 }
            })
        },
        //获取推荐基金
        async getFundRecommendList() {
            try {
                const res = await getFundRecommendList({
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: this.fundId
                })
                this.recommendList = res
                this.recommendList.map(item => {
                    item.apy = Math.floor(item.apy * 10000) / 100
                })
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundRecommendList:error:>>>', e)
            }
        },
        //获取持仓数据
        async getBaoPostion() {
            try {
                const {
                    positionMarketValue,
                    yesterdayEarnings,
                    totalEarnings
                } = await getBaoPostion({
                    currency: 2
                })
                this.positionMarketValue = positionMarketValue
                this.yesterdayEarnings = yesterdayEarnings
                this.totalEarnings = totalEarnings
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取友信宝详情
        async getBaoFundInfo() {
            try {
                const {
                    sevenDaysApy,
                    tenThousandApy,
                    fundId
                } = await getBaoFundInfo({
                    currency: 2
                })
                this.fundId = fundId
                this.tenThousandApy = tenThousandApy
                this.sevenDaysApy = (sevenDaysApy * 100).toFixed(4)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        changeHidePadShow() {
            this.hidePadShow = !this.hidePadShow
        }
    }
}
</script>
<style lang="scss" scoped>
.block__fund--list {
    padding: 0 12px;
    margin: 0 0 20px 0;
}

.block__yxbao--header {
    width: 100%;
    height: 381px;
    display: flex;
    background: linear-gradient(
        360deg,
        rgba(31, 95, 155, 1) 0%,
        rgba(28, 99, 161, 1) 15%,
        rgba(15, 123, 196, 1) 100%
    );
    .block__yxbao--content {
        width: 351px;
        margin: 22px 12px;
        height: 299px;
        background: rgba(186, 211, 255, 0.22);
        box-shadow: -1px 1px 1px 0px rgba(255, 255, 255, 0.29);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        .block__tab--header {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }
        .block__yxbao--list,
        .block__yxbao-btn {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: space-around;
            .block__yxbao--item {
                display: flex;
                flex-direction: column;
                align-items: center;
                .top {
                    font-size: 14px;
                }
                .bottom {
                    font-size: 20px;
                    font-family: yxFontDINPro-Medium;
                }
            }
        }
        .block__yxbao--list {
            margin: 30px 0 0 0;
        }
        .block__yxbao-btn {
            margin: 30px 0 0 0;
            .van-button {
                width: 157px;
                padding: 0;
                border: none;
                font-size: 16px;
                color: rgba(255, 255, 255, 1);
            }
            .btn-color-l {
                background: rgba(4, 89, 162, 0.49);
            }
            .btn-color-r {
                background: rgba(255, 113, 39, 1);
            }
        }
        .block__yxbao--num {
            height: 49px;
            font-size: 38px;
            font-family: DINPro-Medium, DINPro;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 49px;
        }
        .block__amount {
            font-size: 30px;
        }
        .block__yxbao--tip {
            margin: 18px 0 0 0;
            .iconfont {
                font-size: 15px;
                margin: 0 5px;
            }
        }
        .block__yxbao--numtip {
            height: 26px;
            padding: 2px 10px;
            background: rgba(255, 255, 255, 0.19);
            border-radius: 2px 0px 0px 0px;
            line-height: 24px;
            font-size: 12px;
            position: relative;
            em {
                font-style: normal;
            }
            .num {
                color: #ff7127;
            }
        }
        .block__yxbao--numtip:after {
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid rgba(255, 255, 255, 0.19);
            content: '';
            position: absolute;
            width: 0;
            left: 50%;
            top: -6px;
            transform: translateX(-6px);
        }
    }
}
.block__yx-tab {
    width: 351px;
    height: 92px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    margin: -41px 12px 0 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .block__list--item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .iconfont {
            color: #1078c5;
            font-size: 25px;
        }
    }
}
.block-bannar-swiper {
    width: 351px;
    height: 70px;
    border-radius: 4px;
    display: flex;
    margin: 14px 12px;
    overflow: hidden;
    border: 1px solid red;
}
</style>
