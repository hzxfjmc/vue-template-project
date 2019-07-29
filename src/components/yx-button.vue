<script>
import { Button } from 'vant'
export default {
    name: Button.name,
    extends: Button
}
</script>

<style lang="scss" scoped>
.van-button {
    border-radius: 6px;
}
.van-button--round {
    border-radius: 10em;
}
.van-button--normal {
    font-size: 16px;
}
.van-button--default {
    color: rgba(#353547, 0.7);
    border-color: rgba(#353547, 0.5);
}
</style>
