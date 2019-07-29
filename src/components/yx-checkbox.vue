<script>
import { Checkbox } from 'vant'
export default {
    name: Checkbox.name,
    props: {
        shape: {
            type: String,
            default: 'square'
        }
    },
    extends: Checkbox
}
</script>

<style lang="scss" scoped>
.van-checkbox__icon {
    height: 16px;
    border-radius: 2px;
    overflow: hidden;
    .van-icon {
        width: 16px;
        height: 16px;
        line-height: 16px;
        background-color: #e1e1e1;
    }
}
.van-checkbox__icon--checked {
    .van-icon {
        background-color: #2f79ff;
    }
}
.van-checkbox__icon--round .van-icon {
    border-radius: 50%;
}
</style>
