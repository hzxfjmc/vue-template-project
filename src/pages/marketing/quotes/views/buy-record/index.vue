<template lang="pug">
    quotes-layout.buy-record(
    :title="$t('buyRecord.title')"
    )
        .main(slot="main")
            .empty(v-if="!list || !list.length")
                img(
                src="@/assets/img/marketing/quotes/no-record.svg"
                )
                p {{$t('buyRecord.noRecord')}}
            template(v-else)
                ul.title
                    li {{$t('buyRecord.date')}}
                    li {{$t('buyRecord.time')}}
                    li {{$t('buyRecord.price')}}
                    li {{$t('buyRecord.status')}}
                ul.content(
                v-for="item in list"
                :key="item.id"
                )
                    li {{item.createTime | date-format('YYYY-MM-DD')}}
                    li {{item.months}}{{$t('buyRecord.month')}}
                    li {{item.actualAmount}}HKD
                    li(
                    :class="statusClassName(item.status)"
                    ) {{item.status | statusFilter($t)}}
                .more(v-show="pages > pager.pageNum")
                    span.more-btn(@click="getMore") {{$t('buyRecord.more')}}
                        img(
                        src="@/assets/img/marketing/quotes/arrow-right.svg"
                        )
        footer(slot="bottom")
                button.contact(@click="contact")
                    img(
                    src="@/assets/img/marketing/quotes/contact.png"
                    )
                    span {{$t('buyRecord.contact')}}
</template>
<script>
import { orderStatusMap } from '../../utils/map'

export default {
    data: () => ({
        pager: {
            pageNum: 1,
            pageSize: 10
        },
        pages: 0,
        list: []
    }),
    created() {
        this.loadData()
    },
    filters: {
        statusFilter(status, $t) {
            if (orderStatusMap.CONFIRMING.includes(status)) {
                return $t('buyRecord.statusMap.confirming')
            } else if (status === orderStatusMap.SUCCESS) {
                return $t('buyRecord.statusMap.success')
            } else if (status === orderStatusMap.FAIL) {
                return $t('buyRecord.statusMap.fail')
            }
            return ''
        }
    },
    methods: {
        async loadData() {
            let data = await this.$quotesService.getUserQuotationOrderInfo(
                this.pager
            )
            let list = data.list || []
            this.list = [...this.list, ...list]
            this.pages = data.pages
        },
        statusClassName(status) {
            if (orderStatusMap.CONFIRMING.includes(status)) {
                return 'confirming'
            } else if (status === orderStatusMap.SUCCESS) {
                return 'success'
            } else if (status === orderStatusMap.FAIL) {
                return 'fail'
            }
            return ''
        },
        getMore() {
            this.pager.pageNum++
            this.loadData()
        },
        contact() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://customer_service')
        }
    }
}
</script>
<style lang="scss" scoped>
.buy-record {
    .main {
        padding: 14px $global-padding 0;
        ul {
            display: flex;
            li {
                padding: 18px 4px;
                text-align: right;
                &:nth-child(1) {
                    width: 28%;
                    text-align: left;
                }
                &:nth-child(2) {
                    width: 18%;
                }
                &:nth-child(3) {
                    width: 28%;
                }
                &:nth-child(4) {
                    width: 26%;
                }
                &.confirming {
                    color: #4bbe79;
                }
                &.success {
                    color: #2587eb;
                }
                &.fail {
                    color: #58687f;
                }
            }
            &.title {
                color: $hk-text-color6;
                li {
                    padding: 0 4px;
                }
            }
            &.content {
                color: $hk-text-color;
                font-size: 16px;
                border-bottom: 1px dashed $hk-text-color1;
            }
        }
        .more {
            text-align: center;
            margin-top: 20px;
            .more-btn {
                color: $hk-text-color6;
                img {
                    margin-left: 5px;
                    vertical-align: middle;
                    position: relative;
                    bottom: 1px;
                }
            }
        }
        .empty {
            text-align: center;
            margin-top: 80px;
            img {
                width: 130px;
            }
            p {
                color: $hk-text-color4;
                margin-top: 9px;
            }
        }
    }
    footer {
        text-align: center;
        padding: 20px 0;
        .contact {
            img {
                vertical-align: middle;
                width: 20px;
                margin-right: 8px;
            }
            color: rgba($hk-primary-color, 0.6);
            font-size: 12px;
            width: 110px;
            height: 40px;
            line-height: 38px;
            text-align: center;
            background-color: #fff;
            border: 1px solid rgba($hk-primary-color, 0.1);
            border-radius: 6px;
        }
    }
}
</style>
