import jsBridge from '@/utils/js-bridge'
import { Toast } from 'vant'
export default {
    copy(content) {
        let toastHtml = `
            <div class="toast-box">
                <div class="content">${content}</div>
                <div class="copy-tips">已复制</div>
            </div>
            `
        jsBridge
            .callApp('command_copy_to_pasteboard', {
                content: content
            })
            .then(res => {
                if (res === 'success') {
                    Toast({
                        type: 'html',
                        message: toastHtml
                    })
                }
            })
    }
}
