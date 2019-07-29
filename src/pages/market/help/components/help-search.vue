<template lang="pug">
    .help-search
        van-search(:placeholder="$t('helpSearch.commonSearchPlace')" v-model="myValue" @focus="onFocus" class="common-search")
        van-popup(v-model="show" :class="'search-page'")
            .search-box
                .search-form
                    van-search(
                        :placeholder="$t('helpSearch.search')"
                        v-model="searchValue"
                        @input="onInput"
                        show-action @search="onSearch"
                        @cancel="onCancel"
                        class="search-input"
                        ref="search"
                    )
                        .search-btn(slot="action" @click="onCancel") {{$t('helpSearch.cancel')}}
                .filter-list-box(v-if="filterShow")
                    .filter-title {{$t('helpSearch.areYouSearch')}}：
                    ul
                        li.filter-list(
                            v-for="(item,index) in filterQuestionList"
                            :key="index"
                            @click="goDetail(item)"
                        )
                            span(v-html="item.title")
                .normal-question(v-else-if="normalQuestionList.length>0")
                    .question-title {{$t('helpSearch.normalQuestion')}}
                    ul
                        li.question-list(
                            v-for="(item,index) in normalQuestionList"
                            :key="index"
                            @click="goDetail(item)"
                        )
                            .question-text {{item.shortTitle}}
</template>

<script>
import { Search, Popup, Button, Toast } from 'vant'
import helpMixins from '../mixins/index'
import { getCommonQuestionList, autoSearchList } from '../../0-service/help'

let timer = null

export default {
    mixins: [helpMixins],
    i18n: {
        zhCHS: {
            helpSearch: {
                commonSearchPlace: '搜索您遇到的问题，或点击查看常见问题',
                search: '搜索',
                cancel: '取消',
                areYouSearch: '你是不是想找',
                normalQuestion: '常见问题'
            }
        },
        zhCHT: {
            helpSearch: {
                commonSearchPlace: '搜索您遇到的問題，或點擊查看常見問題',
                search: '搜索',
                cancel: '取消',
                areYouSearch: '你是不是想找',
                normalQuestion: '常見問題'
            }
        },
        en: {
            helpSearch: {
                commonSearchPlace: 'Search your question',
                search: 'Search',
                cancel: 'Cancel',
                areYouSearch: 'You want to search',
                normalQuestion: 'FAQ'
            }
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            myValue: this.value,
            searchValue: '', // 搜索值
            //show: false, //是否展示弹窗
            normalQuestionList: [], //常见问题列表
            filterShow: false, //匹配结果类别是否展示
            filterQuestionList: [] //搜索输入匹配问题列表
        }
    },
    mounted() {
        this.getCommonQuestionList()
    },
    computed: {
        show: {
            get() {
                const { searching = '' } = this.$route.query || {}
                return searching === '1'
            },
            set() {}
        }
    },
    methods: {
        getCommonQuestionList() {
            getCommonQuestionList({}).then((data = []) => {
                let list = data || []
                this.normalQuestionList = [...list]
            })
        },
        autoSearchList(params) {
            let keywords = params.keyword
            autoSearchList(params)
                .then((data = []) => {
                    this.filterShow = !!this.searchValue
                    let list = data || []
                    let titleReg = new RegExp(keywords, 'ig')
                    this.filterQuestionList = list.map(item => {
                        return {
                            id: item.id,
                            title: item.title.replace(titleReg, title => {
                                return `<span class="filter">${title}</span>`
                            })
                        }
                    })
                })
                .catch(e => Toast(e.msg || this.$t('serveError')))
        },
        // 点击搜索框，弹出蒙层
        onFocus: function() {
            //this.show = true
            this.$nextTick(() => {
                //输入框聚焦
                let searchDom = document.getElementsByClassName(
                    'search-input'
                )[0]
                let inputDom =
                    searchDom && searchDom.getElementsByTagName('input')[0]
                inputDom && inputDom.focus()
            })
            let query = this.$route.query || {}
            this.$router.push({
                query: {
                    ...query,
                    searching: '1'
                }
            })
        },
        onInput(value) {
            if (value) {
                let params = {
                    keyword: value,
                    index: 0,
                    size: 10
                }
                clearTimeout(timer)
                timer = setTimeout(() => {
                    this.autoSearchList(params)
                }, 300)
            } else {
                this.cancelSearch()
            }
        },
        // 跳转搜索页
        onSearch(value) {
            if (value) {
                this.searchValue = ''
                this.cancelSearch()
                this.$router.push({
                    path: '/result',
                    query: {
                        keyword: value
                    }
                })
            } else {
                Toast('请输入关键字')
            }
        },
        // 取消
        onCancel() {
            //this.show = false
            this.$router.go(-1)
        },
        // 取消弹窗搜索
        cancelSearch() {
            clearTimeout(timer)
            this.filterShow = false
        }
    },
    components: {
        [Search.name]: Search,
        [Popup.name]: Popup,
        [Button.name]: Button
    }
}
</script>

<style lang="scss">
.help-search {
    .van-search {
        .van-search__content {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0px 1px 9px 1px rgba(237, 239, 247, 0.5);
        }
        .van-cell {
            padding: 8px 10px;
            .van-cell__value {
                color: rgba(#353547, 0.2);
                input::-webkit-input-placeholder {
                    color: rgba(#353547, 0.2);
                }
            }
        }
    }
    .filter {
        color: #285ac8;
    }
    .common-search {
        padding: 0 28px;
        background: transparent !important;
    }

    .search-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        .search-form {
            .search-input {
                padding: 14px 12px;
                background: #f1f3f8 !important;
                .van-search__action {
                    padding-right: 0;
                }
            }
        }
        .filter-list-box,
        .normal-question {
            background: #fff;
        }
        .filter-list-box {
            flex: 1;
            .filter-title,
            .filter-list {
                padding: 8px 12px;
                font-size: 14px;
                line-height: 22px;
            }
            .filter-title {
                color: rgba(#353547, 0.7);
                border: 1px solid rgba(235, 235, 235, 0.5);
            }
            ul {
                padding: 0 12px;
                .filter-list {
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(235, 235, 235, 0.5);
                }
            }
        }

        .normal-question {
            .question-title,
            .question-list {
                padding: 8px 12px;
                font-size: 14px;
                line-height: 22px;
            }
            .question-title {
                color: rgba(#353547, 0.7);
                border: 1px solid rgba(235, 235, 235, 0.5);
            }
            ul {
                font-size: 0;
                .question-list {
                    position: relative;
                    display: inline-block;
                    vertical-align: middle;
                    width: 50%;
                    padding: 8px 12px;
                    font-size: 14px;
                    &:nth-of-type(2n + 1) {
                        &:before {
                            content: '';
                            position: absolute;
                            right: 0;
                            top: 50%;
                            width: 1px;
                            height: 20px;
                            margin-top: -10px;
                            background: rgba(235, 235, 235, 0.5);
                        }
                    }
                    &:nth-of-type(2n) {
                        &:before {
                            content: '';
                            position: absolute;
                            right: 12px;
                            bottom: 0;
                            width: calc(200% - 24px);
                            height: 1px;
                            background: rgba(235, 235, 235, 0.5);
                        }
                    }
                    .question-text {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }

        .btn-wrap {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            text-align: center;
            padding: 10px;
        }
    }

    .search-page {
        width: 100%;
        height: 100%;
        background: #f1f3f8;
    }
}
/*香港版*/
.is-hk {
    .help-search {
        .search-box {
            .search-form {
                .search-input {
                    background: #f8f8f8 !important;
                }
            }
        }
        .search-page {
            background: #f8f8f8;
        }
    }
}
</style>
