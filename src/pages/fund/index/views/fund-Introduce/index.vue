<template lang="pug">
.fund-introduce
    .fund-introduce-header
        van-tabs(
            v-model="active" 
            color="#2F79FF" 
            sticky
            :swipeable="swipeable"
            :line-width="width"
            title-inactive-color="rgba(25,25,25,0.5)"
            title-active-color="#2F79FF")
                van-tab(:title="$t('list')['fundIntroduce'].label" :name="0")
                    .fund-introduce-content(v-if="active===0")
                        .fund-introduce-list(
                            v-for="(item,index) of list"
                            :class="[item.flag == 2 ? 'activelist':'']"
                            :key="item.label")
                            span.left {{item.label}}
                            span.right(v-if="index != 'fundSize'") {{item.value}}
                            span.right(
                                v-if="index == 'fundSize' && lang != 'en'") {{currencyName}} {{(item.value/100000000).toFixed(2)}} {{$t('unit')}}
                            span.right(
                                v-if="index == 'fundSize' && lang == 'en' && item.value/100000000 >= 10") {{currencyName}} {{(item.value/100000000).toFixed(2)}}  Billion
                            span.right(
                                v-if="index == 'fundSize' && lang == 'en' && item.value/100000000 < 10") {{currencyName}} {{(item.value/100000000).toFixed(2)}}  Million
                    .fund-introduce-other(v-if="active===0")
                        .fund-introduce-objective(v-for="item in otherList")
                            .title {{item.label}}
                            .content {{item.value}}
                van-tab(:title="$t('list')['fundManager'].label" :name="1")
                    .fund-manager-container(v-if="active===1")
                        fund-manager(:managerList="managerList")
                van-tab(:title="$t('list')['fundFiles'].label" :name="2")
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
                van-tab(:title="$t('list')['dividendDeatail'].label" :name="1")
                    .dividend-detail-container(v-if="active===3")
                        dividend-detail
    
    

    

</template>
<script>
import './index.scss'
import { Introducelit, i18nIntroducelist, otherList } from './fund-introduce'
import dividendDetail from './dividend-detail'
import fundManager from './fund-manager'
import { transNumToThousandMark } from '@/utils/tools.js'
import {
    getFundDetail,
    getFundManagerData
} from '@/service/finance-info-server.js'
import Vue from 'vue'
import { List, Row, Col } from 'vant'
import { getCosUrl } from '@/utils/cos-utils'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
Vue.use(List)
export default {
    computed: {
        ...mapGetters(['lang'])
    },
    i18n: i18nIntroducelist,
    components: {
        dividendDetail,
        fundManager,
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
            managerList: [],
            currencyName: '',
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
        async getFundManagerData() {
            try {
                const res = await getFundManagerData({
                    fundId: this.$route.query.id
                })
                this.managerList = res
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
            }
        },
        async initState() {
            try {
                const {
                    fundHeaderInfoVO,
                    fundOverviewInfoVO,
                    fundTradeInfoVO,
                    fundCorrelationFileList
                } = await getFundDetail({
                    displayLocation: this.$route.query.displayLocation || 1,
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
                this.currencyName = fundOverviewInfoVO['currency'].name
                for (let key in this.list) {
                    this.list[key].value = fundOverviewInfoVO[key]
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
        this.active = this.$route.query.active
        this.initState()
        this.initIn18State()
        this.getFundManagerData()
    }
}
</script>
<style lang="scss" scoped></style>
