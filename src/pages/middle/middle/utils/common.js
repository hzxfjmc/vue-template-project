export const getParams = field => {
    let url = window.location.href,
        param = {},
        splitArray = url.split('?'),
        searchLocation =
            splitArray.length <= 1 ? '' : splitArray[1].split('#')[0],
        searchParams = searchLocation.split('&'),
        value,
        key
    for (var i = 0, leni = searchParams.length; i < leni; i++) {
        key = searchParams[i].split('=')[0]
        value = searchParams[i].split('=')[1]
        if (!key) {
            continue
        }
        param[key] = value
    }
    return field ? param[field] : param
}
