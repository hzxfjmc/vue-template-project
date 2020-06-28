<template lang="pug">
.block__fund--survey
    .block__fundheader--survey
        em.iconfont.icon-icon-gaishu
        span.title {{$t('survey')}}

    .block__fundcontent--list
        .block__fund--item
            .block__fund--title {{$t('fundIntro')}}
            .block__fund--content(@click="tofundSurvey(0)") {{establishDay}}
                i.iconfont.icon-iconEBgengduoCopy
        .block__fund--item
            .block__fund--title {{$t('fundManager')}}
            .block__fund--content(@click="tofundSurvey(1)") {{managerNameList}}
                i.iconfont.icon-iconEBgengduoCopy
        .block__fund--item
            .block__fund--title {{$t('docs')}}
            .block__fund--content(@click="tofundSurvey(2)") {{fundFileList}}
                i.iconfont.icon-iconEBgengduoCopy
        .block__fund--item
            .block__fund--title {{$t('dividend')}}
            .block__fund--content(@click="tofundSurvey(3)") {{dividendDetail}}
                i.iconfont.icon-iconEBgengduoCopy
</template>
<script>
import { jumpUrl, transNumToThousandMark } from '@/utils/tools.js'
import {
    getFundManagerData,
    getFundDividendList
} from '@/service/finance-info-server'
import { getUaValue } from '@/utils/html-utils'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
    data() {
        return {
            managerList: [],
            dividendPaymentDate: ''
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
                return nameList.slice(0, 2).join('、')
            } else {
                return this.$t('noData')
            }
        },
        fundFileList() {
            if (this.fundCorrelationFileList.length) {
                let fliterList = this.fundCorrelationFileList.map(item => {
                    return item.fileName.split('.')[0]
                })
                return fliterList.slice(0, 2).join('、')
            } else {
                return this.$t('noDocs')
            }
        },
        dividendDetail() {
            if (this.dividendPaymentDate) {
                return `${this.$t('latestDividend')}：${
                    this.dividendPaymentDate
                }`
            } else {
                return this.$t('noDividend')
            }
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    i18n: {
        zhCHS: {
            survey: '基金概况',
            fundIntro: '基金档案',
            fundManager: '基金经理',
            docs: '基金文件',
            noDocs: '暂无文件',
            dividend: '派息详情',
            establishDay: '成立日期',
            noData: '暂无数据',
            noDividend: '暂无派息',
            latestDividend: '最新派息',
            fundDes: '基金介绍'
        },
        zhCHT: {
            survey: '基金概況',
            fundIntro: '基金簡介',
            fundManager: '基金經理',
            docs: '基金文件',
            noDocs: '暫無文件',
            dividend: '派息详情',
            establishDay: '成立日期',
            noData: '暫無數據',
            noDividend: '暫無派息',
            latestDividend: '最新派息',
            fundDes: '基金介紹'
        },
        en: {
            survey: 'Fund Overview',
            fundIntro: 'Fund Intro.',
            fundManager: 'Fund Manager',
            docs: 'Docs',
            noDocs: 'no Docs',
            dividend: 'Dividend',
            establishDay: 'Establishment Day',
            noData: 'No Data',
            noDividend: 'No Dividend',
            latestDividend: 'Latest Dividend',
            fundDes: 'Fund Intro.'
        }
    },
    props: {
        fundOverviewInfoVO: {
            type: Object,
            default: () => {}
        },
        fundCorrelationFileList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        tofundSurvey(val) {
            let params = getUaValue('langType')
            let url = `${window.location.origin}/wealth/fund/index.html?langType=${params}#/fund-introduce?id=${this.fundOverviewInfoVO.fundId}&active=${val}`
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
        },
        async getFundDividendListFun() {
            try {
                let params = {
                    fundId: this.$route.query.id,
                    pageNum: 1,
                    pageSize: 20
                }
                let res = await getFundDividendList(params)
                this.dividendPaymentDate = res.list.length
                    ? dayjs(res.list[0].dividendPaymentDate).format(
                          'YYYY-MM-DD'
                      )
                    : ''
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
            } finally {
                this.loading = false
            }
        }
    },
    created() {
        this.getFundManagerData()
        this.getFundDividendListFun()
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
            border: 0;
        }
        &:last-child {
            border: 0;
        }
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
