<template lang="pug">
    .record
        .btnList
            p(
                v-for="item in action " 
                @click="changeType(item.type)" 
                :class="type==item.type ? 'act':''") 已{{item.name}}
        .table
            .loadingWrap(v-if="showLoading")
                van-loading(type="spinner" class="loading")        
            .noRecord(v-if="noRecord && !showLoading")
                img(src='~@/assets/img/marketing/mgm-ch/noRecord.png')
                p 暂无好友完成{{currentStatus}}
                p 快去邀请好友吧！
            table(v-if="!noRecord && !showLoading")
                tbody
                    tr.tHead
                        td: p
                            img(src='~@/assets/img/marketing/mgm-ch/tdBg1.svg')
                            span 好友 
                        td: p
                            img(src='~@/assets/img/marketing/mgm-ch/tdBg2.svg')
                            span 当前状态
                        td: p
                            img(src='~@/assets/img/marketing/mgm-ch/tdBg2.svg')
                            span 我的奖励
                    tr(v-for="item in recordList")
                        td: p {{item.customerName}}
                        td: p {{item.status}}
                        td: p {{item.reward}}
</template>

<script>
import { Loading } from 'vant'
import { getRecord } from '@/service/customer-relationship-server.js'
import { getParameter } from '@/utils/tools'
export default {
    data() {
        return {
            activityId: '',
            recordList: [],
            type: '',
            action: [
                {
                    type: '1',
                    name: '注册'
                },
                {
                    type: '2',
                    name: '开户'
                },
                {
                    type: '3',
                    name: '入金/转仓'
                }
            ],
            noRecord: false,
            currentStatus: '',
            showLoading: true
        }
    },
    components: {
        [Loading.name]: Loading
    },
    created() {
        // 获取活动id
        let id = getParameter('id') || getParameter('register-cid')
        this.activityId = id
        // 获取当前tab类型
        this.type = this.$route.query.recordType || '1'
        // 获取邀请记录
        this.init()
    },
    methods: {
        async init() {
            try {
                let res = await getRecord({
                    activityId: this.activityId,
                    tagType: this.type
                })
                this.recordList = [...res]
                this.noRecord = this.recordList.length <= 0 ? true : false
                this.showLoading = false
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // tab切换
        changeType(type) {
            this.type = type
            this.currentStatus = this.action.find(v => v.type == type).name
            this.init()
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font($size: 0.24rem, $weight: 400, $color: #b95f22) {
    font: {
        size: $size;
        weight: $weight;
    }
    color: $color;
}
.record {
    min-height: 100%;
    background: #ffc020;
    padding-bottom: 20px;
    .btnList {
        display: flex;
        justify-content: space-between;
        padding: 19px 43px 9px 40px;
        p {
            width: 94px;
            height: 34px;
            background: #ffe595;
            border-radius: 17px;
            @include font(0.28rem, 500, #fff);
            line-height: 34px;
            text-align: center;
        }
        .act {
            background: #ff7219;
        }
    }
    .table {
        width: 347px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 3px 0px rgba(255, 231, 181, 1);
        padding: 0 14px;
        border-radius: 10px;
        margin: 0 auto;
        .loadingWrap {
            padding: 50px 0;
            .loading {
                margin: 0 auto;
            }
        }
        .noRecord {
            padding-bottom: 44px;
            img {
                display: block;
                width: 130px;
                margin: 24px auto 20px;
            }
            p {
                @include font($color: rgba(255, 192, 32, 1));
                line-height: 17px;
                text-align: center;
            }
        }
        table {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        tbody {
            tr {
                border-top: 1px solid #f8efe8;
                @include font($color: rgba(185, 95, 34, 1));
                td {
                    p {
                        padding: 10px 0;
                    }
                }
            }
            .tHead {
                padding: 10px 0;
                @include font(0.28rem, 500, rgba(185, 95, 34, 1));
                border: none;
                td {
                    p {
                        padding: 12px 0 8px 0;
                        img {
                            vertical-align: middle;
                            margin-right: 5px;
                        }
                        span {
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
}
</style>
