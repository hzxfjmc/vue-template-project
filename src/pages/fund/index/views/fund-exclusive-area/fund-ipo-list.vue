<template lang="pug">
    .ipo__list
        .block__card(v-for="i in 5")
            .left
                img(:src="img2")
                .info
                    p.title 农夫山泉IPO锚定基金
                    p.desc 这个基金有点“甜
            .btn(@click="handleBook") {{$t('bookNow')}}
</template>
<script>
import { listPiColumnMoreProductV1 } from '@/service/customer-relationship-server'
import { commitReserveProductRecordV1 } from '@/service/customer-relationship-server'
export default {
    name: 'ipo-list',
    data() {
        return {
            img2: require('@/assets/img/fund/img/2.png'),
            productList: [],
            pageNum: 1,
            pageSize: 20
        }
    },
    i18n: {
        zhCHS: {
            bookNow: '即刻预约',
            bookSucess: '预约成功',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        },
        zhCHT: {
            bookSucess: '预约成功',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        },
        en: {
            bookSucess: '预约成功',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        }
    },
    created() {
        this.getProductList()
    },
    methods: {
        handleBook() {
            this.$dialog.alert({
                title: this.$t('bookSucess'),
                message: this.$t('bookInfo'),
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#3c78fa'
            })
        },
        async getProductList() {
            let param = {
                id: 0,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            try {
                let res = await listPiColumnMoreProductV1(param)
                this.productList = res
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async productRecord(id) {
            try {
                await commitReserveProductRecordV1({ productId: id })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.ipo__list {
    padding: 12px;
}
.block__card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    background: $background-color;
    box-shadow: 0px 2px 6px 0px rgba(25, 25, 25, 0.2);
    .left {
        display: flex;
    }
    .info {
        padding-left: 8px;
        .title {
            padding-bottom: 4px;
            font-weight: 600;
        }
        .desc {
            font-size: 12px;
            color: $text-color6;
        }
    }
    .btn {
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #cf9562;
        border-radius: 4px;
    }
    img {
        width: 91px;
        height: 51px;
        border-radius: 2px;
    }
}
</style>
