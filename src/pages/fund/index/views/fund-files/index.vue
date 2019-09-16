<template lang="pug">
.fund-files
    .file-list(v-if="list.length != 0")
        van-row(gutter="20")
            van-col(
                span="11" 
                class="span" 
                :key="item.key"
                v-for="item of list") 
                p {{item.fileName}}
                span {{item.createTime}}
                img(:src="item.ImgSrc")

    .no-bond-box(v-else)
        .no-bond {{$t('nomore')}}
</template>
<script>
import { Row, Col } from 'vant'
import dayjs from 'dayjs'
export default {
    i18n: {
        zhCHS: {
            nomore: '暂无文件'
        },
        zhCHT: {
            nomore: '暫無文件'
        },
        en: {
            nomore: 'No Document'
        }
    },
    components: {
        Row,
        Col
    },
    data() {
        return {
            list: []
        }
    },
    mounted() {
        this.list = JSON.parse(this.$route.query.data)
        this.list.map((item, index) => {
            item.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
            this.list[index].ImgSrc =
                index % 2 == 0
                    ? require('@/assets/img/fund/pdf.png')
                    : require('@/assets/img/fund/html.png')
        })
    }
}
</script>
<style lang="scss" scoped>
.fund-files {
    margin: 0 10px;
    .span {
        background: #fff;
        margin: 10px 0 0 10px;
        height: 110px;
        border-radius: 5px;
        box-shadow: 0px 2px 4px 0px rgba(231, 236, 248, 1);
        border-radius: 6px;
        position: relative;
        padding: 10px;
        p {
            font-size: 0.28rem;
            width: 125px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        span {
            display: inline-block;
            color: $text-color5;
            position: absolute;
            bottom: 10px;
        }
        img {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 30px;
            height: 35px;
        }
    }
    .iconfont {
        color: red;
        font-size: 60px;
    }
}
.no-bond-box {
    padding-top: 150px;
    .no-bond {
        width: 130px;
        height: 120px;
        margin: 0 auto;
        padding-top: 100px;
        background: url('~@/assets/img/bond/icon-nobond.png') center 15px
            no-repeat;
        background-size: 110px;
        color: $text-color3;
        font-size: 0.28rem;
        line-height: 20px;
        text-align: center;
        box-sizing: border-box;
    }
}
</style>
