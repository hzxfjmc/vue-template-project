<template lang="pug">
.fund-introduce
    .fund-introduce-header
        van-tabs(
            v-model="active" 
            color="#2F79FF" 
            :swipeable="swipeable"
            :line-width="width"
            title-inactive-color="rgba(25,25,25,0.5)"
            title-active-color="#2F79FF")
                van-tab(:title="$t('list')['fundIntroduce'].label" :name="0")
                van-tab(:title="$t('list')['dividendDeatail'].label" :name="1")
                van-tab(:title="$t('list')['fundFiles'].label" :name="2")
    .fund-introduce-content(v-if="active===0")
        .fund-introduce-list(
            v-for="(item,index) of list"
            :class="[item.flag == 2 ? 'activelist':'']"
            :key="item.label")
            span.left {{item.label}}
            span.right(:ref="item.refs" :class="[item.flag  == 1 ? 'hiddenClass' :'showClass',item.flag == 0 ? '' : item.refs]") {{item.value}}
                span.active(
                    v-show="item.flag == 1 || item.flag == 2" 
                    @click="foldItem(index)" 
                    :class="[item.flag == 2 ? 'activeShow':'']") {{item.flag == 1 ? $t('zk') : $t('zq')}}
    .fund-introduce-other(v-if="active===0")
        .fund-introduce-objective(v-for="item in otherList")
            .title {{item.label}}
            .content {{item.value}}
    .dividend-detail-container(v-if="active===1")
        dividend-detail

    .dividend-detail-container(v-if="active===2")
        .fund-files
            .file-list(v-if="filelist.length != 0")
                van-row(gutter="20")
                    van-col(
                        span="11" 
                        class="span" 
                        :key="item.key"
                        v-for="item of filelist") 
                        .list-item(@click="toJumpLink(item)")
                            p {{item.fileName}}
                            span {{item.createTime}}
                            img(:src="item.ImgSrc")

            .no-bond-box(v-else)
                .no-bond {{$t('nomore')}}
    

</template>
<script>
import { Introducelit, i18nIntroducelist, otherList } from './fund-introduce'
import dividendDetail from './dividend-detail'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import Vue from 'vue'
import { List, Row, Col } from 'vant'
import { getCosUrl } from '@/utils/cos-utils'
import dayjs from 'dayjs'
Vue.use(List)
export default {
    i18n: i18nIntroducelist,
    components: {
        dividendDetail,
        Row,
        Col
    },
    data() {
        return {
            list: JSON.parse(JSON.stringify(Introducelit)),
            width: 30,
            showMoney: true,
            swipeable: true, //开启手势滑动
            currency: null,
            active: 0,
            filelist: [],
            otherList: JSON.parse(JSON.stringify(otherList))
        }
    },
    methods: {
        async toJumpLink(item) {
            try {
                const res = await getCosUrl(item.filePath)
                window.location.href = res
            } catch (e) {
                console.log('赎回页面-getCosUrl:error:>>>', e)
            }
        },
        foldItem(index) {
            this.list[index].flag = this.list[index].flag == 1 ? 2 : 1
        },
        async initState() {
            try {
                const {
                    fundHeaderInfoVO,
                    fundOverviewInfoVO,
                    fundTradeInfoVO,
                    fundCorrelationFileList
                } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.filelist = fundCorrelationFileList
                this.filelist.map((item, index) => {
                    item.createTime = dayjs(item.createTime).format(
                        'YYYY-MM-DD'
                    )
                    this.filelist[index].ImgSrc =
                        index % 2 == 0
                            ? require('@/assets/img/fund/pdf.png')
                            : require('@/assets/img/fund/html.png')
                })
                for (let key in this.list) {
                    this.list[key].value =
                        key === 'fundSize'
                            ? `${
                                  fundOverviewInfoVO.currency.name
                              } ${transNumToThousandMark(
                                  fundOverviewInfoVO[key]
                              )}`
                            : fundOverviewInfoVO[key]
                    if (key === 'fundRisk') {
                        this.list[
                            key
                        ].value = `A${fundHeaderInfoVO.fundRiskType} ${fundOverviewInfoVO[key]}`
                    }
                    if (key === 'fundNameCn') {
                        this.list[key].value = fundHeaderInfoVO.fundName
                    }
                    if (key === 'initialInvestAmount') {
                        this.list[key].value = `${
                            fundTradeInfoVO.currency.name
                        } ${transNumToThousandMark(fundHeaderInfoVO[key])}`
                    }
                    if (key === 'establishDay') {
                        this.list[key].value = !this.list[key].value
                            ? '--'
                            : dayjs(this.list[key].value).format('YYYY-MM-DD')
                    }
                }
                for (let key in this.otherList) {
                    this.otherList[key].value = fundOverviewInfoVO[key]
                }
            } catch (e) {
                console.log('getFundDetail:error:>>>', e)
            }
        },
        initIn18State() {
            for (let key in this.list) {
                this.list[key].label = this.$t('list')[key].label
            }
            for (let key in this.otherList) {
                this.otherList[key].label = this.$t('list')[key].label
            }
        }
    },
    mounted() {
        this.initState()
        this.initIn18State()
    }
}
</script>
<style lang="scss" scoped>
.fund-files {
    height: 96%;
    margin: 0 2%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .span {
        background: #fff;

        margin: 10px 0 0 10px;
        height: 110px;
        border-radius: 5px;
        box-shadow: 0px 2px 4px 0px rgba(231, 236, 248, 1);
        border-radius: 6px;
        position: relative;
        font-family: PingFangSC;
        padding: 10px;
        .list-item {
            width: 100%;
            height: 100%;
        }
        p {
            font-size: 0.28rem;
            width: 125px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        span {
            display: inline-block;
            color: $text-color5;
            position: absolute;
            bottom: 10px;
        }
        img {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 30px;
            height: 35px;
        }
    }
    .iconfont {
        color: red;
        font-size: 60px;
    }
}
.no-bond-box {
    padding-top: 150px;
    .no-bond {
        width: 130px;
        height: 120px;
        margin: 0 auto;
        padding-top: 100px;
        background: url('~@/assets/img/fund/icon-nofile.png') center 15px
            no-repeat;
        background-size: 99.5px 78px;
        color: $text-color3;
        font-size: 0.28rem;
        line-height: 20px;
        text-align: center;
        box-sizing: border-box;
        font-family: PingFangSC;
    }
}
.fund-introduce {
    background: $background-bottom-color;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.fund-introduce-header {
    border-bottom: 1px solid $text-color8;
}
.fund-introduce-content {
    padding: 20px 0;
    background: #fff;
}
.fund-introduce-list {
    padding: 5px 10px;
    display: flex;
    span {
        display: inline;
        font-size: 0.28rem;
    }
    .left {
        width: 100px;
        color: $text-color5;
    }
    .right {
        flex: 1;
        line-height: 24px;
        word-break: break-all;
        .active {
            position: absolute;
            bottom: 0;
            background: #fff;
            color: $text-link-color;
            display: inline-block;
            width: 40px;
            right: 0;
            text-align: left;
            line-height: 24px;
            height: 24px;
        }
        .activeShow {
            bottom: -24px;
        }
    }
    .hiddenClass,
    .showClass {
        text-align: left;
    }
    .hiddenClass {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        word-break: break-all;
        overflow: hidden;
    }
    .intd,
    .target {
        text-align: left;
    }
}
.fund-introduce-objective {
    padding: 20px 10px;
    margin-top: 6px;
    background-color: #fff;
    // flex: 1;
    .title {
        color: $text-color5;
        margin-bottom: 10px;
    }
}
.activelist {
    margin: 0 0 20px 0;
}
</style>
