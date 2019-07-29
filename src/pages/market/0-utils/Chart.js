// this下的属性说明
// dataLength: 0, // 数据的长度，以最长的为准
// xAxisValueHeight: 0, // todo：x轴坐标值的高度，待优化删除
// yAxisValueWidth: 0, // todo：y轴坐标值的宽度，待优化删除
// yAxisMax: 0, // y轴坐标的最大值
// yAxisMin: 0, // y轴坐标的最小值
// originLeft: 0, // 坐标区域左下角位置left
// originTop: 0, // 坐标区域左下角位置top
// zeroLeft: 0, // todo：原点位置left，暂时只能从0开始
// zeroTop: 0, // 原点位置top
// yUnitLength: 0, // y轴线每单位物理长度
// xAxisLength: 0, // x轴线物理长度
// yAxisLength: 0, // y轴线物理长度
// yEqual: 2 // y轴分段数

// options参数说明
// options.series：打点的数据列表
// options.series[i].type：图表类型，暂支持：line-折线图
// options.series[i].data：数据列表
// options.xAxisData：x轴坐标数据，按数量平均分配
// options.color：图表颜色列表
// options.axisColor：轴线颜色,
// options.axisValueColor：轴线颜色,
// options.yAxisMax：y轴坐标最大值
export default class Chart {
    constructor(canvas, options) {
        // 默认选项
        const defaultOptions = {
            axisColor: 'rgba(57,57,57,0.4)',
            axisValueColor: 'rgba(57,57,57,0.4)'
        }
        options = { ...defaultOptions, ...options }

        // 优化x轴左边值的数量
        const countList = options.series.map(serie => serie.data.length)
        const maxCount = Math.max.apply(null, countList)
        const needOpti =
            maxCount === 1 && options.xAxisData && options.xAxisData.length >= 2
        if (needOpti) {
            options.xAxisData = options.xAxisData.slice(0, 1)
        }
        // 实例属性挂载
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.dpi = window.devicePixelRatio || 1
        this.yEqual = 2
        // 宽高
        const {
            width: cssWidth,
            height: cssHeight
        } = this.canvas.getBoundingClientRect()
        this.canvas.width = cssWidth * this.dpi
        this.canvas.height = cssHeight * this.dpi
        this.width = this.canvas.width
        this.height = this.canvas.height
        // 边距
        this.topPadding = 20 * this.dpi
        this.leftPadding = 0
        this.rightPadding = 0
        this.bottomPadding = 10 * this.dpi

        // 清除重繪
        this.ctx.clearRect(0, 0, this.width, this.height)

        // x轴坐标值所占的高度 和 y轴坐标值所占的宽度
        // todo：可通过计算自适应
        this.xAxisValueHeight = 20 * this.dpi
        this.yAxisValueWidth = 40 * this.dpi

        // 坐标轴原点的起始位置
        this.originLeft = this.leftPadding + this.yAxisValueWidth
        this.originTop =
            this.height - this.bottomPadding - this.xAxisValueHeight

        this.yAxisMax = options.yAxisMax || 0
        this.series = options.series

        // 优化坐标系的最大值和最小值
        const maxList = options.series.map(serie =>
            Math.max.apply(null, serie.data)
        )
        const max = Math.max.apply(null, maxList)
        const minList = options.series.map(serie =>
            Math.min.apply(null, serie.data)
        )
        const min = Math.min.apply(null, minList)
        this.optimizeYAxisValues(max, min)

        // 轴线长度
        this.yAxisLength = this.originTop - this.topPadding
        this.xAxisLength = this.width - this.originLeft - this.rightPadding

        // x轴线位置
        this.zeroTop =
            (this.yAxisLength * this.yAxisMin) / (this.yAxisMin - this.yAxisMax)

        // x轴y轴单位长度
        this.yUnitLength = this.yAxisLength / (this.yAxisMax - this.yAxisMin)
        this.dataLength = Math.max.apply(
            null,
            options.series.map(serie => serie.data.length)
        )
        this.xUnitLength = this.xAxisLength / this.dataLength

        // 画图
        this.drawXAxis(options.axisColor)
        this.drawXPoint(options.xAxisData, options.axisValueColor)
        this.drawYPoint(options.axisValueColor)
        options.series.forEach((serie, i) => {
            this.drawLineChart(serie.data, options.color[i])
        })
    }
    // 优化图表y轴最大值、最小值
    optimizeYAxisValues(max, min) {
        max = max < 0 ? 0 : max
        min = min > 0 ? 0 : min
        if (min === 0 && max === 0) {
            max = 1
        }

        // 计算正负轴分段数
        let section = (max * this.yEqual) / (max - min)
        let plusSections =
            section * 2 < this.yEqual ? Math.ceil(section) : Math.floor(section)
        let minusSections = this.yEqual - plusSections

        // 计算y轴分段对应的值
        const basePlus = this.optimizeBaseValue(max, plusSections)
        const baseMinus = this.optimizeBaseValue(-min, minusSections)
        let base, pow
        if (max > -min) {
            base = basePlus
            pow = 10 ** Math.floor(Math.log(max) / Math.log(10))
            const yAxisMax = (base * pow) / 10
            this.yAxisMax = yAxisMax > this.yAxisMax ? yAxisMax : this.yAxisMax
            const yUnitWidth = this.yAxisMax / plusSections
            this.yAxisMin = -minusSections * yUnitWidth
        } else {
            base = baseMinus
            pow = 10 ** Math.floor(Math.log(-min) / Math.log(10))
            this.yAxisMin = -(base * pow) / 10
            const yUnitWidth = -this.yAxisMin / minusSections
            const yAxisMax = plusSections * yUnitWidth
            this.yAxisMax = yAxisMax > this.yAxisMax ? yAxisMax : this.yAxisMax
        }
    }
    // 优化基数值
    optimizeBaseValue(value, section) {
        const pow = 10 ** Math.floor(Math.log(value) / Math.log(10))
        let base = Math.ceil((value / pow) * 10)
        if (section > base) {
            return 1
        } else {
            for (let i = 0; i < 10; i++) {
                let remainder = (base + i) % section
                if (remainder === 0) {
                    return base + i
                }
            }
        }
        return base
    }
    // 画折线图
    drawLineChart(data, color = '#000000') {
        const list = []
        this.ctx.save()
        this.ctx.strokeStyle = color
        this.ctx.fillStyle = color
        data.forEach((item, i) => {
            // 獲取坐標點
            list[i] = {}
            list[i].left = this.originLeft + this.xUnitLength * (i + 0.5)
            list[i].top = isFinite(this.yUnitLength)
                ? this.originTop - (data[i] - this.yAxisMin) * this.yUnitLength
                : (this.originTop - this.topPadding) / 2 + this.topPadding
            if (data.length === 1) {
                // 畫圓
                list.forEach(item => {
                    this.ctx.beginPath()
                    this.ctx.arc(item.left, item.top, 2, 0, 360)
                    this.ctx.fill()
                    this.ctx.stroke()
                })
            } else {
                // 畫線
                this.ctx.beginPath()
                if (i !== 0) {
                    this.ctx.moveTo(list[i].left, list[i].top)
                    this.ctx.lineTo(list[i - 1].left, list[i - 1].top)
                }
                this.ctx.stroke()
            }
        })
        this.ctx.restore()
    }
    // 画x轴线
    drawXAxis(color) {
        const xbase = this.originTop - this.zeroTop
        this.ctx.save()
        this.ctx.beginPath()
        if (this.zeroTop !== 0) {
            this.ctx.setLineDash([14, 5])
        }
        this.ctx.strokeStyle = color
        this.ctx.moveTo(this.originLeft, xbase)
        this.ctx.lineTo(this.width - this.rightPadding, xbase)
        this.ctx.stroke()
        this.ctx.restore()
    }
    // 画X轴坐标值
    drawXPoint(xAxisData, color) {
        if (!xAxisData || xAxisData.length === 0) {
            return
        }
        const xUnitCount = xAxisData.length - 1
        const perWidth = (this.xAxisLength - this.xUnitLength) / xUnitCount
        const startLeft = this.originLeft + this.xUnitLength / 2

        this.ctx.save()
        this.ctx.fillStyle = color
        this.ctx.font = 10 * this.dpi + 'px PingFang SC'
        this.ctx.textAlign = 'center'
        xAxisData.forEach((item, i) => {
            if (xAxisData.length > 1) {
                if (i === 0) {
                    this.ctx.textAlign = 'left'
                } else if (i === xAxisData.length - 1) {
                    this.ctx.textAlign = 'right'
                }
            }
            this.ctx.fillText(
                item,
                startLeft + (perWidth * i || 0), // 防止 perWidth 无穷大
                this.originTop + 24
            )
        })
        this.ctx.restore()
    }
    // 画Y轴坐标值
    drawYPoint(color) {
        this.ctx.save()
        this.ctx.fillStyle = color
        this.ctx.font = 10 * this.dpi + 'px "Microsoft Yahei"'
        this.ctx.textAlign = 'left'
        this.ctx.textBaseline = 'middle'

        for (let i = 0; i <= this.yEqual; i++) {
            const start = this.yAxisMin
            const range = this.yAxisMax - this.yAxisMin
            const step = range / this.yEqual
            const value = parseFloat((start + step * i).toFixed(10)) // 精度问题，不考虑极大数，可简单处理
            this.ctx.fillText(
                value,
                this.leftPadding,
                this.originTop - (this.yAxisLength / this.yEqual) * i
            )
        }
        this.ctx.restore()
    }
}
