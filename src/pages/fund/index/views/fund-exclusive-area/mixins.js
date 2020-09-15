import { commitReserveProductRecordV1 } from '@/service/customer-relationship-server'

export default {
    i18n: {
        zhCHS: {
            reserveNow: '即刻预约',
            verifyNow: '立即认证',
            detail: '查看详情',
            reserveSuccessful: '预约成功',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系',
            ecmSubscribing: '国际配售认购中',
            ipoReservation: 'IPO预约中',
            viewNow: '立即查看',
            more: '查看更多',
            onlyPi: '以下内容仅PI可见'
        },
        zhCHT: {
            reserveNow: '即刻預約',
            verifyNow: '立即認證',
            detail: '查看詳情',
            reserveSuccessful: '預約成功',
            bookInfo:
                '我們已經收到您的預約，您對應的專屬客戶經理會盡快和您取得聯系',
            ecmSubscribing: '國際配售認購中',
            ipoReservation: 'IPO預約中',
            viewNow: '立即查看',
            more: '查看更多',
            onlyPi: '以下內容僅PI可見'
        },
        en: {
            reserveNow: 'Reserve Now',
            verifyNow: 'Verify Now',
            detail: 'Detail',
            reserveSuccessful: 'Reserve Successful',
            bookInfo: 'The following content is visible only to PI',
            ecmSubscribing: 'ECM Subscribing',
            ipoReservation: 'IPO Reservation',
            viewNow: 'View Now',
            more: 'More',
            onlyPi: 'The following content is visible only to PI'
        }
    },
    methods: {
        async handleBook(id) {
            try {
                await commitReserveProductRecordV1({ productId: id })
                this.$dialog.alert({
                    title: this.$t('reserveSuccessful'),
                    message: this.$t('bookInfo'),
                    confirmButtonText: this.$t('iknow'),
                    confirmButtonColor: '#3c78fa'
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
