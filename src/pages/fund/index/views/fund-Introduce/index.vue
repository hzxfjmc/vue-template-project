<template lang="pug">
.fund-introduce
    .fund-introduce-header(class="border-bottom")
        span.title {{ $t('fundIntroduceTitle')}}
    
    .fund-introduce-content
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
</template>
<script>
import { Introducelit, i18nIntroducelist } from './fund-introduce'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundDetail } from '@/service/finance-info-server.js'
export default {
    i18n: i18nIntroducelist,
    data() {
        return {
            list: JSON.parse(JSON.stringify(Introducelit))
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
                        key == 'fundSize'
                            ? `${
                                  fundOverviewInfoVO.currency.name
                              } ${transNumToThousandMark(
                                  fundOverviewInfoVO[key]
                              )}`
                            : fundOverviewInfoVO[key]
                    if (key == 'fundRisk') {
                        this.list[
                            key
                        ].value = `A${fundHeaderInfoVO.fundRiskType} ${fundOverviewInfoVO[key]}`
                    }
                    if (key == 'fundNameCn') {
                        this.list[key].value = fundHeaderInfoVO.fundName
                    }
                }
                setTimeout(() => {
                    this.initOffsetHeight()
                }, 100)
            } catch (e) {
                console.log('getFundDetail:error:>>>', e)
            }
        },
        initIn18State() {
            for (let key in this.list) {
                this.list[key].label = this.$t('list')[key].label
            }
        },
        initOffsetHeight() {
            if (this.$refs.intd[0].offsetHeight > 120) {
                this.list.companyProfile.flag = 1
            }
            if (this.$refs.target[0].offsetHeight > 120) {
                this.list.investObjective.flag = 1
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
.fund-introduce {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow-y: auto;
}
.fund-introduce-header {
    padding: 10px;
    .title {
        font-size: 0.32rem;
    }
}
.fund-introduce-content {
    margin: 5px 0 0 0;
}
.fund-introduce-list {
    padding: 5px 10px;
    float: left;
    span {
        display: inline;
        font-size: 0.28rem;
    }
    .left {
        width: 150px;
        color: $text-color5;
        float: left;
    }
    .right {
        float: right;
        text-align: right;
        width: 200px;
        line-height: 24px;
        display: block;
        position: relative;
        // overflow: hidden;
        word-break: break-all;
        .active {
            position: absolute;
            bottom: 0;
            background: #fff;
            color: $text-link-color;
            display: inline-block;
            width: 40px;
            right: 0;
            text-align: right;
            line-height: 24px;
            height: 24px;
        }
        .activeShow {
            bottom: -24px;
        }
    }

    .hiddenClass,
    .showClass {
        text-align: right;
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
.activelist {
    margin: 0 0 20px 0;
}
</style>
