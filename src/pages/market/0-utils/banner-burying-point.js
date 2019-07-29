import sensors from '../0-third/sensors'

export default function(options) {
    sensors.track(
        'yxstock_web_ad_click',
        {
            prop_view_page: options.view_page,
            prop_ad_type: options.ad_type,
            prop_ad_id: options.banner_id
        },
        function() {
            if (options.jump_url) {
                location.href = options.jump_url
            }
        }
    )
}
