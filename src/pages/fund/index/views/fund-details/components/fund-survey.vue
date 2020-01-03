<template lang="pug">
.block__fund--survey
    .block__fundheader--survey(@click="tofundSurvey")
        em.iconfont.icon-icon-gaishu
        span.title {{$t('survey')}}
        .block__list--right
            span {{$t('surveytips')}}
            em.iconfont.icon-iconEBgengduoCopy

    .block__fundcontent--list
        .block__fund--item
            .block__fund--title {{$t('fundCompanyName')}}
            p {{fundOverviewInfoVO.fundCompanyName}}
        .block__fund--item
            .block__fund--title {{$t('assetSubType')}}
            p {{fundOverviewInfoVO.assetSubType}}
        .block__fund--item
            .block__fund--title {{$t('investArea')}}
            p {{fundOverviewInfoVO.investArea}}
        .block__fund--item
            .block__fund--title {{$t('fundSize')}}
            p(v-if="lang != 'en'") {{fundOverviewInfoVO.currencyName}} {{fundOverviewInfoVO.fundSize/100000000}} {{$t('unit')}}
            p(v-if="lang == 'en' && fundOverviewInfoVO.fundSize/100000000 >= 10 ") {{fundOverviewInfoVO.currencyName}} {{fundOverviewInfoVO.fundSize/1000000000}} Billion
            p(v-if="lang == 'en' && fundOverviewInfoVO.fundSize/100000000 < 10 ") {{fundOverviewInfoVO.currencyName}} {{fundOverviewInfoVO.fundSize/10000000}} Million
</template>
<script>
import { jumpUrl, transNumToThousandMark } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['lang'])
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    i18n: {
        zhCHS: {
            unit: '亿',
            survey: '基金概况',
            surveytips: '概況、分红、文件',
            fundCompanyName: '基金公司',
            assetSubType: '资产类别',
            investArea: '投资地区',
            fundSize: '基金规模'
        },
        zhCHT: {
            unit: '億',
            survey: '基金概況',
            surveytips: '概況、分紅、文件',
            fundCompanyName: '基金公司',
            assetSubType: '資產類別',
            investArea: '投資地區',
            fundSize: '基金規模'
        },
        en: {
            unit: 'B ',
            survey: 'Fund Overview',
            surveytips: 'Details、Dividend、DOC',
            fundCompanyName: 'Fund Company',
            assetSubType: 'Asset Class',
            investArea: 'Geographical Allocation',
            fundSize: 'Fund Size'
        }
    },
    props: {
        fundOverviewInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        tofundSurvey() {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-introduce?id=${this.fundOverviewInfoVO.fundId}`
            jumpUrl(3, url)
        }
    }
}
</script>
<style lang="scss" scoped>
.block__fundcontent--list {
    .block__fund--item {
        margin: 10px 0;
        .block__fund--title {
            font-size: 12px;
            color: #999999;
        }
        p {
            font-size: 14px;
            color: #666666;
        }
    }
    .block__fund--item:first-child {
        margin: 0;
    }
}

.block__fund--survey {
    width: 100%;
    padding: 0 3% 5px 3%;
    margin: 6px 0 0 0;
    background: #fff;
    .block__fundheader--survey {
        display: flex;
        flex-direction: row;
        padding: 15px 0;
        line-height: 22px;
        .icon-icon-gaishu {
            font-size: 20px;
        }
        .title {
            font-size: 16px;
            margin: 0 0 0 10px;
        }
        .block__list--right {
            margin-right: auto;
            flex-grow: 1; //这三个元素只有它在有空余空间时可伸缩，也就是它占据了所有剩余空间
            display: flex; //将它设置为flex,就可以单独对他进行主轴右对齐
            justify-content: flex-end;
            text-align: right;
            span {
                font-size: 14px;
                color: #666666;
            }
            .iconfont {
                font-size: 15px;
                line-height: 25px;
            }
        }
    }
}
</style>
