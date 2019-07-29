<template lang="pug">
    .question-result-box
        .search-input-wrap
            van-search(:placeholder="$t('searchPlace')" v-model="searchValue" @search="onSearch")
        .result-box
            .result-notice(
                v-if="langType!=='en'"
            )
                | {{$t('helpResult.searchGet')}}
                span.result-name {{keyword}}
                | {{$t('helpResult.searchResult')}}{{total}}{{$t('helpResult.many')}}
            .result-notice(
                v-else
            )
                | {{total}} search results for
                span.result-name {{keyword}}
            .result-list-box
                van-list(
                    v-model="loading"
                    :finished="finished"
                    :finished-text="$t('helpResult.none')"
                    @load="getList"
                )
                    .result-list(
                        v-for="(item,index) in questionList"
                        :key="index"
                        @click="goDetail(item)"
                    )
                        .result-title(v-html="item.title")
                        .result-content(v-html="item.contentText")
</template>

<script>
import { mapGetters } from 'vuex'
import { setTitle } from '@/utils/html-utils'
import { Search, List, Toast } from 'vant'
import helpMixins from '../mixins/index'
import { getSearchList } from '../../0-service/help'
export default {
    mixins: [helpMixins],
    i18n: {
        zhCHS: {
            helpResult: {
                searchPlace: '搜索您遇到的问题',
                searchGet: '搜索到与', //部分字段需要高亮显示
                searchResult: '相关的结果有',
                many: '条',
                none: '没有更多了'
            }
        },
        zhCHT: {
            helpResult: {
                searchPlace: '搜索您遇到的問題',
                searchGet: '搜索到與',
                searchResult: '相關的結果有',
                many: '條',
                none: '没有更多了'
            }
        },
        en: {
            helpResult: {
                searchPlace: 'Search your question',
                searchGet: 'search get',
                searchResult: 'relative question has ',
                many: ' ',
                none: 'No More'
            }
        }
    },
    data() {
        return {
            searchValue: '', //搜索框的值
            keyword: '', //搜索结果值
            size: 20,
            index: 0,
            total: 0, // 搜索结果条数
            loading: false,
            finished: false,
            questionList: []
        }
    },
    created() {
        let keyword = this.$route.query.keyword || ''
        this.keyword = keyword
        this.searchValue = keyword
        setTitle(keyword)
        this.getList()
    },
    watch: {
        '$route.query': {
            handler(query = {}) {
                const { keyword = '' } = query
                this.searchValue = keyword
                this.refreshList(keyword)
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters(['langType'])
    },
    methods: {
        getList() {
            let params = {
                keyword: this.keyword,
                size: this.size,
                index: this.index
            }
            this.loading = true
            getSearchList(params)
                .then((data = {}) => {
                    const { data_list = [], total = 0 } = data || {}
                    let list = data_list || []
                    if (this.index === 0) {
                        this.total = total
                    }
                    this.loading = false
                    let titleReg = new RegExp(this.keyword, 'ig')
                    let questionList =
                        list.map(item => {
                            return {
                                id: item.id,
                                title: item.title.replace(titleReg, title => {
                                    return `<span class="filter">${title}</span>`
                                }),
                                contentText: item.contentText.replace(
                                    titleReg,
                                    contentText => {
                                        return `<span class="filter">${contentText}</span>`
                                    }
                                )
                            }
                        }) || []
                    this.questionList = [...this.questionList, ...questionList]
                    if (
                        this.questionList.length >= this.total ||
                        list.length === 0
                    ) {
                        this.finished = true
                    }
                    this.index += this.size
                })
                .catch(e => Toast(e.msg || this.$t('serveError')))
        },
        onSearch(value) {
            if (value) {
                this.refreshList(value)
            } else {
                Toast('请输入搜索关键字')
            }
        },
        refreshList(value) {
            if (value) {
                setTitle(value)
                this.keyword = value
                this.index = 0
                this.questionList = []
                this.finished = false
                this.getList()
            }
        }
    },
    components: {
        [Search.name]: Search,
        [List.name]: List
    }
}
</script>

<style lang="scss" scoped>
@mixin line-ellipsis($number: 2) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $number;
    overflow: hidden;
    text-overflow: ellipsis;
}
.question-result-box {
    min-height: 100%;
    background-color: #fff;

    .result-box {
        .result-notice {
            padding: 8px 15px;
            font-size: 14px;
            line-height: 22px;
            color: rgba(#353547, 0.7);
            border-bottom: 1px solid rgba(235, 235, 235, 0.5);
            .result-name {
                margin: 0 5px;
                color: rgba(#285ac8, 0.7);
            }
        }
        .result-list-box {
            padding: 0 14px;
            .result-list {
                padding: 14px 0 10px;
                border-bottom: 1px solid rgba(235, 235, 235, 0.5);
                .result-title,
                .result-content {
                    font-size: 14px;
                    line-height: 24px;
                    color: #353547;
                }
                .result-title {
                    margin-bottom: 4px;
                }
                .result-content {
                    @include line-ellipsis(5);
                }
            }
        }
    }
}
</style>

<style lang="scss">
/*修改vant样式*/
.question-result-box {
    .filter {
        color: #285ac8;
    }
    .van-search {
        padding: 14px 12px;
        background: #f1f3f8 !important;
        .van-search__content {
            background-color: #fff;
            border-radius: 5px;
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
        .van-icon-search {
            color: #edeff7;
        }
    }
}
/*香港版*/
.is-hk {
    .question-result-box {
        .van-search {
            background: #f8f8f8 !important;
        }
    }
}
</style>
