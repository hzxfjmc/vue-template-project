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
                van-tab(title="基金介绍" :name="0")
                van-tab(title="派息详情" :name="1")
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
        van-list.dividend-record-list(v-model="loading" :finished="finished" :finished-text="$t('noMore')" @load="onLoad")
            van-cell(v-for="(item,index) in dividendDetailList" :key="index" class="van-cell-item" )
                template(slot-scope='scope')
                    .dividend-item.flex
                        span(class="left-title") {{$t('list')['dividendDate'].label}}
                        span(class="right-value") {{item.dividendDate}}
                    .dividend-item.flex
                        span(class="left-title") {{$t('list')['dividendRecord'].label}}
                        span(class="right-value") {{item.dividendRecord}}

</template>
<script>
import { Introducelit, i18nIntroducelist, otherList } from './fund-introduce'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import Vue from 'vue'
import { List } from 'vant'
Vue.use(List)
export default {
    i18n: i18nIntroducelist,
    data() {
        return {
            list: JSON.parse(JSON.stringify(Introducelit)),
            width: 30,
            showMoney: true,
            swipeable: true, //开启手势滑动
            currency: null,
            active: 0,
            otherList: JSON.parse(JSON.stringify(otherList)),
            dividendDetailList: [
                { dividendDate: '2019-2-1', dividendRecord: '1.00' },
                { dividendDate: '2019-2-1', dividendRecord: '1.00' },
                { dividendDate: '2019-2-1', dividendRecord: '1.00' }
            ],
            loading: false,
            finished: true
        }
    },
    methods: {
        foldItem(index) {
            this.list[index].flag = this.list[index].flag == 1 ? 2 : 1
        },
        async initState() {
            try {
                const {
                    fundHeaderInfoVO,
                    fundOverviewInfoVO
                } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
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
                            fundOverviewInfoVO.currency.name
                        } ${transNumToThousandMark(fundHeaderInfoVO[key])}`
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
        },
        onLoad() {}
    },
    mounted() {
        this.initState()
        this.initIn18State()
    }
}
</script>
<style lang="scss" scoped>
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
.dividend-detail-container {
    .left-title {
        color: rgba($text-color, 0.5);
        margin-bottom: 5px;
    }
}
</style>
