<script>
export default {
    methods: {
        // 去详情
        goDetail(item = {}) {
            window.location.href = `/webapp/market/generator.html?id=${item.id}`
        }
    }
}
</script>
