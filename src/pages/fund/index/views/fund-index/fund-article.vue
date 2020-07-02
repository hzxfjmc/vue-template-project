<template lang="pug">
.block--article--wrapper(v-if="news_list.length != 0")  
    .block--article__title
        p {{$t(['基金看点','基金看點','Fund News'])}}
        //- span 查看更多
        //-     em.iconfont.icon-iconEBgengduoCopy
    .block--article--swipper
        slot(name="swipper")
    .block--article--list
            .block--item(
                v-for="(item,index) in news_list" 
                @click="goToWebViewSubjectDetails(item)"
                :class="[index != news_list.length-1?'border-bottom':'']")
                van-skeleton.block--item(
                    title 
                    :row="2" 
                    :loading="loading")
                    p.title {{item.title}}
                    template(v-if="item.stocks && item.stocks.length>0")
                        .content(
                            v-if="item.stocks[0].pctchng>0"
                            :class="stockColorType == 1 ? 'color-red color-red-bg' : 'color-green color-green-bg'"
                            )
                            span.name {{item.stocks[0].name}}
                            span.pctchng +{{Number(item.stocks[0].pctchng/100).toFixed(2)}}%
                        .content(
                            v-if="item.stocks[0].pctchng<0"
                            :class="stockColorType == 1 ? 'color-green color-green-bg' : 'color-red color-red-bg'"
                            )
                            span.name {{item.stocks[0].name}}
                            span.pctchng {{Number(item.stocks[0].pctchng/100).toFixed(2)}}%
                        .content.color-black.color-black-bg(
                            v-if="item.stocks[0].pctchng===0"
                            )
                            span.name {{item.stocks[0].name}}
                            span.pctchng {{Number(item.stocks[0].pctchng).toFixed(2)}}%
                    .bottom 
                        span {{item.source}}
                        span.time {{item.release_time}}
</template>
<script>
import { getStockColorType } from '@/utils/html-utils.js'
import { hkauthorfeature } from '@/service/news-relatedwithstock'
import { getSpSubjectDetail } from '@/service/news-msgdisplay'
import scheme from '@/utils/scheme'
import dayjs from 'dayjs'
import { appType } from '@/utils/html-utils.js'
export default {
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        appType() {
            return appType
        }
    },
    created() {
        this.getSpSubjectDetail()
    },
    methods: {
        goToWebViewSubjectDetails(item) {
            scheme.gotoNewsDetail(item.newsid)
        },
        //基金资讯
        async getSpSubjectDetail() {
            try {
                let data
                if (appType.Ch) {
                    data = await getSpSubjectDetail({
                        subject_id: 37,
                        last_score: 0,
                        page_size: 3
                    })
                } else {
                    data = await hkauthorfeature({
                        author_id: 37,
                        newsid: 0,
                        page_size: 3
                    })
                }
                this.loading = false
                this.news_list = data.news_list
                this.news_list.map(item => {
                    item.release_time = dayjs(item.release_time * 1000).format(
                        'MM-DD HH:mm'
                    )
                })
            } catch (e) {
                this.$toast(e.msg)
                console.log(e)
            }
        }
    },
    data() {
        return {
            loading: true,
            news_list: []
        }
    }
}
</script>
<style lang="scss" scoped>
.block--article--wrapper {
    width: 351px;
    background: #fff;
    margin: 10px auto;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 14px 12px;
    .van-skeleton {
        padding: 0;
    }
    .block--article__title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        p {
            font-size: 18px;
            line-height: 25px;
            font-weight: 500;
        }
        span {
            font-weight: 400;
            line-height: 25px;
            color: rgba(25, 25, 25, 0.65);
            em {
                font-size: 15px;
            }
        }
    }
}
.block--article--list {
    padding: 14px 0 0 0;
}
.block--item {
    padding: 14px 0 13px 0;
    .title {
        font-size: 16px;
        font-weight: 400;
    }
    .content {
        margin: 10px 0 0 0;
        font-size: 12px;
        display: inline-block;
        padding: 0px 4px;
        .pctchng {
            margin: 0 0 0 7px;
        }
    }
    .bottom {
        margin: 6px 0 0 0;
        color: rgba(25, 25, 25, 0.65);
        font-size: 12px;
        line-height: 17px;
        .time {
            margin: 0 0 0 5px;
        }
    }
}
.block--item:last-child {
    padding: 14px 0 0 0;
}
.block--item:first-child {
    padding: 0 0 13px 0;
}
</style>
