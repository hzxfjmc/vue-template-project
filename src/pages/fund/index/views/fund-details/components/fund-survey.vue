<template lang="pug">
.block__fund--survey
    .block__fundheader--survey(@click="tofundSurvey")
        em.iconfont.icon-icon-gaishu
        span.title {{$t('survey')}}
        //- .block__list--right
        //-     span {{$t('surveytips')}}
        //-     em.iconfont.icon-iconEBgengduoCopy

    .block__fundcontent--list
        .block__fund--item
            .block__fund--title {{$t('fundIntro')}}
            .block__fund--content {{establishDay}}
                i.iconfont.icon-iconEBgengduoCopy
        .block__fund--item
            .block__fund--title {{$t('fundManager')}}
            .block__fund--content {{managerNameList}}
                i.iconfont.icon-iconEBgengduoCopy
        .block__fund--item
            .block__fund--title {{$t('docs')}}
            .block__fund--content {{$t('summary')}}
                i.iconfont.icon-iconEBgengduoCopy
        .block__fund--item
            .block__fund--title {{$t('dividend')}}
</template>
<script>
import { jumpUrl, transNumToThousandMark } from '@/utils/tools.js'
import { getFundManagerData } from '@/service/finance-info-server'
import { getUaValue } from '@/utils/html-utils'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
    data() {
        return {
            managerList: []
        }
    },
    computed: {
        ...mapGetters(['lang']),
        establishDay() {
            if (this.fundOverviewInfoVO.establishDay) {
                let establishDay = dayjs(
                    this.fundOverviewInfoVO.establishDay
                ).format('YYYY-MM-DD')
                return `${this.$t('establishDay')}: ${establishDay}`
            } else {
                return this.$t('fundDes')
            }
        },
        managerNameList() {
            if (this.managerList.length) {
                let nameList = this.managerList.map(item => {
                    return item.managerName
                })
                return nameList.join('、')
            } else {
                return this.$t('noData')
            }
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    i18n: {
        zhCHS: {
            unit: '亿',
            survey: '基金概况',
            surveytips: '概況、分红、文件',
            fundIntro: '基金档案',
            fundManager: '基金经理',
            docs: '基金文件',
            dividend: '派息详情',
            fundCompanyName: '基金经理',
            fundDes: '基金介绍',
            establishDay: '成立日期',
            noData: '暂无数据',
            summary: '基金简报、基金概要',
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
            surveytips: 'Details,Dividend,Docs',
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
            let params = getUaValue('langType')
            let url = `${window.location.origin}/wealth/fund/index.html?langType=${params}#/fund-introduce?id=${this.fundOverviewInfoVO.fundId}`
            jumpUrl(3, url)
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
        }
    },
    created() {
        this.getFundManagerData()
    }
}
</script>
<style lang="scss" scoped>
.block__fundcontent--list {
    .block__fund--item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid $text-color8;
        .block__fund--title {
            color: $text-color5;
        }
        .iconfont {
            margin-left: 6px;
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
