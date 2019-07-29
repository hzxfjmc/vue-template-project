<template lang="pug">
    .help-list-page
        search
        .help-list-box
            .help-list(v-for="(item) in list" :key="item.id")
                .list-title {{item.name}}
                .list-content
                    .content-list(v-for="(childItem) in item.list" :key="childItem.id")
                        .list-inner(@click="goDetail(childItem)")
                            span.title-text {{childItem.title}}
                            van-icon(name="arrow" class="icon")
</template>

<script>
import { setTitle } from '@/utils/html-utils'
import { Icon, Toast } from 'vant'
import search from '../components/help-search'
import helpMixins from '../mixins/index'
import { getCategoryHomePage } from '../../0-service/help'
export default {
    mixins: [helpMixins],
    data() {
        return {
            id: '',
            list: []
        }
    },
    created() {
        this.id = this.$route.params.id
        setTitle(this.$route.query.title)
        this.getList()
    },
    watch: {
        '$route.params': {
            handler(params = {}) {
                const { id = '' } = params
                this.id = id
                if (id) {
                    this.getList()
                }
            },
            deep: true
        },
        '$route.query': {
            handler(query = {}) {
                const { title = '' } = query
                if (title) {
                    setTitle(title)
                }
            },
            deep: true
        }
    },
    methods: {
        getList() {
            let params = {
                id: this.id
            }
            getCategoryHomePage(params)
                .then((data = {}) => {
                    const { homepagelist = [] } = data || {}
                    let list = homepagelist || []
                    this.list = [...list]
                })
                .catch(e => Toast(e.msg || this.$t('serveError')))
        }
    },
    components: {
        search,
        [Icon.name]: Icon
    }
}
</script>

<style lang="scss">
.help-list-page {
    min-height: 100%;
    background: #f1f3f8;
    .help-search {
        .common-search {
            padding: 14px 12px;
        }
    }
    .help-list-box {
        .help-list {
            padding: 14px 12px 0;
            color: #353547;
            background: #fff;
            & + .help-list {
                margin-top: 10px;
            }
            .list-title {
                margin-bottom: 12px;
                line-height: 22px;
                font-size: 16px;
                font-weight: 500;
            }
            .list-content {
                .content-list {
                    padding: 10px 0;
                    font-size: 14px;
                    line-height: 24px;
                    & + .content-list {
                        border-top: 1px solid rgba(235, 235, 235, 0.5);
                    }
                    .list-inner {
                        position: relative;
                        display: block;
                        color: rgba(#353547, 0.85);
                        .icon {
                            position: absolute;
                            right: 0;
                            top: 50%;
                            margin-top: -6px;
                            color: rgba(#353547, 0.2);
                        }
                    }
                }
            }
        }
    }
}
/*香港版*/
.is-hk {
    .help-list-page {
        background: #f8f8f8;
    }
}
</style>
