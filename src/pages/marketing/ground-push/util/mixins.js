import { getParameter } from '@/utils/tools'
export default {
    data: () => ({
        companyId: getParameter('companyId'),
        companyName: getParameter('companyName')
    })
}
