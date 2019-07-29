<template lang="pug">
   
</template>
<script>
import { getParams } from '../utils/common'
export default {
    data() {
        return {
            rightsId: '',
            activityType: ''
        }
    },
    created() {
        this.rightsId = getParams('rightsId')
        this.activityType = getParams('activityType')
    },
    mounted() {
        this.next()
    },
    methods: {
        next() {
            if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
                this.$confirm({
                    title: '是否跳转到友信智投APP',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                })
                    .then(() => {
                        let url = `${
                            window.location.origin
                        }/webapp/transaction/corporate-action.html#/${
                            this.activityType
                        }/${this.rightsId}`
                        let encodeUrl = encodeURIComponent(url)
                        window.open(
                            `yxstock://yx.stock.app/h5_page?url=${encodeUrl}&titleBarVisible=false`,
                            '_blank'
                        )
                    })
                    .catch(() => {
                        console.log('error')
                    })
            } else {
                window.open(`http://pgyer.com/IXQd`, '_blank')
            }
        }
    }
}
</script>
