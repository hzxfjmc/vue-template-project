// 简体
export const zhCHS = {
    stronger: {
        title: '强者恒强',
        description: '基于均线和K线，寻找强趋势的股票',
        logic: {
            title: '选股逻辑',
            description:
                '基于基本面及大数据，从港美股全市场优选高流动性、强趋势、适合短期操作的股票。通过算法优化选股和择时，寻求更优收益风险比值。'
        },
        history: {
            title: '历史表现',
            description:
                '据回测数据，近5年来策略胜率均保持在55%以上，年化收益率最低30.83%，最高可达90.83%。'
        },
        service: {
            title: '服务说明',
            details: [
                '交易标的：港股、美股',
                '推荐频次：每天一期（港、美股分开推送）',
                '持股周期：1-3天',
                '适合人群：不会选股、择时，无暇盯盘，风险承受力较高',
                '操作说明：'
            ],
            process: [
                '推荐日<br/>开盘价买入',
                '设止盈单',
                '止盈：自动卖出<br/>未止盈：期末手动卖出'
            ]
        },
        case: [
            {
                title: '案例'
                // title: '案例一（止盈）'
            },
            {
                title: '案例二（未止盈）'
            }
        ],
        team: {
            title: '团队介绍',
            description: [
                '趋势策略开发团队常年深耕于港美股市场，是一个依靠数学、计算机和现代金融理论进行投资研究的专业团队。',
                '成员均来自各大金融机构及知名高校科研团队，具备科技与金融双重背景。'
            ]
        },
        tip:
            '风险提示：本页面提供的信息为量化回测分析结果，仅供投资者参考，不构成任何投资建议。 '
    },
    bigData: {
        title: '大数据价值挖掘',
        summary: '掘金低估值，高潜力绩优好股',
        description:
            '该策略基于股票成长性、估值水平以及调整幅度等维度，运用大数据和人工智能技术，挖掘持续高增长低估值绩优好股。',
        logic: {
            title: '策略特点',
            list: [
                {
                    title: '低估值，高潜力',
                    description: 'PE/PB低于同行业，未来业绩可期，中长线首选'
                },
                {
                    title: '高标准，可预期',
                    description:
                        '高股息，高ROE，股神巴菲特评价优秀公司的顶级标准'
                },
                {
                    title: '稳定可持续，操作无忧',
                    description:
                        '依靠资深投研和人工智能深度学习十级筛选，定期择优最佳表现个股'
                }
            ]
        },
        kernel: {
            title: '核心优势',
            list: [
                '大数据挖掘<br/>实时监控',
                '海量因子库<br/>自动调优择优',
                '收益可期，完备<br/>交易风险控制'
            ]
        },
        history: {
            title: '历史表现',
            description:
                '据回测数据，统计期间，累计收益率达<span style="color: #FF0F7E; font-size: 20px;">150</span><span style="color: #FF0F7E; font-size: 14px;">%</span>，远超同期市场大盘表现！'
        },
        appropriate: {
            title: '适合人群',
            list: [
                '选股能力不足',
                '偏好中长线',
                '风险趋中稳健投资',
                '奶牛股爱好者'
            ]
        },
        honour: {
            title: '尊享服务',
            list: [
                '解锁持仓股票<br/>捕获市场机会',
                '人工智能监控<br/>自动计算盈亏',
                '调仓实时提醒<br/>紧跟买卖信号'
            ]
        },
        tip:
            '风险提示：本页面提供的信息为量化回测分析结果，仅供投资者参考，不构成任何投资建议。 '
    },
    casePanel: {
        name: '冠均国际控股',
        date: '入选日期',
        stop: '建议止盈'
    },
    steady: {
        title: '稳健长虹',
        intro:
            '基于大数据和人工智能量化策略，长期追踪ROE-PB走势，捕获业绩强势稀缺个股，寻求超越市场的稳定收益。',
        feature: '策略特色',
        featureTitle_1: '大数据选股',
        featureTitle_2: '业绩斐然，收益稳健',
        featureTitle_3: '严格准入，优中择优',
        featureDes_1: '全面监控股票变化，信息领先市场',
        featureDes_2: '行业龙头标杆，长期高ROE',
        featureDes_3: '全市场匹配，长期跟踪，筛选稀缺标的',
        history: '历史业绩',
        historyDes:
            '回测期间，累计收益率达<span><b>120</b>%</span>,年均复合增长高达21%。',
        service: '服务说明',
        serviceDes:
            '·适合人群<br>偏好中长线投资，寻求相对稳健收益的投资者<br>·服务方式<br>订阅后可随时查看持仓个股，接收实时调仓提醒，自动计算仓位盈亏',
        tips:
            '风险提示：本页面提供的信息为量化回测分析结果，仅供投资者参考，不构成任何投资建议。 '
    },
    valueBonus: {
        title: '高股息率',
        intro:
            '经营出色的公司一般都能够持续提供高回报。因此可以通过股息率挖掘优质股, 并定期运用大数据算法挑选估值较低、上涨潜力较大的股票',
        logic: '策略逻辑',
        logicTitle_1: '高股息率',
        logicDes_1: '持续高派息能力，未来收益可期',
        logicTitle_2: '分散投资',
        logicDes_2: '精选行业，优化配置，分散风险',
        logicTitle_3: '动态调整',
        logicDes_3: '紧贴市场行情，每月定期更新',
        history: '历史走势',
        hostoryItem_1: '收益率',
        hostoryItem_2: '扣成本',
        famous: '名人案例',
        famousPerson_1: '杰里米J.西格尔',
        famousDes_1:
            '1957-2003 年间高股息率组合（股息率前 20% ）年化收益率 14.27%',
        famousPerson_2: '约翰·聂夫',
        famousDes_2: '十分推崇高股息策略，31年间温莎基金的累计投资回报率近56倍',
        suit: '适合人群',
        suit_1: '偏好中长线',
        suit_2: '价值投资者',
        suit_3: '奶牛股爱好者',
        suit_4: '风险偏好稳中求胜',
        tips:
            '风险提示：本页面提供的信息为量化回测分析结果，仅供投资者参考，不构成任何投资建议。 '
    },
    alpha: {
        title: 'Alpha 一号',
        intro:
            '借鉴卷积网络学习的原理，构建技术指标组合图像样本，训练全市场历史大数据，寻找常见技术指标的组合特征，对股票短期趋势做出预测，选取短期上涨趋势股',
        advantage: '核心优势',
        advantage_1: '常见技术指标<br>组合特征',
        advantage_2: '卷积神经网络<br>趋势预测',
        advantage_3: '灵活止盈止损<br>适时调整',
        logic: '策略逻辑',
        logic_1: '从零学习',
        logic_2: '学习局部特征组合',
        logic_3: '类图像式记忆',
        logic_4: '发现短期趋势启动时机',
        service: '服务说明',
        service_1: '推荐频次：每天一期（港、美股分开推送）',
        service_2: '持股周期：1-5天',
        service_3: '适合人群：短线爱好者，风险承受能力高',
        service_4: '买入条件：入选日高开5%以内开盘价买入',
        case: '成功案例',
        thead: ['股票', '买入价<br>买入日期', '卖出价<br>卖出日期', '盈利'],
        tbody: [
            {
                col_1: '阅文集团<br>00772.HK',
                col_2: '38.45<br>2019/1/22',
                col_3: '39.95<br>2019/1/28',
                col_4: '3.90%'
            },
            {
                col_1: '星星地产<br>01560.HK',
                col_2: '2.53<br>2019/2/11',
                col_3: '2.62<br>2019/2/15',
                col_4: '3.56%'
            },
            {
                col_1: '长安仁恒<br>08139.HK',
                col_2: '12.49<br>2019/2/14',
                col_3: '16.17<br>2019/2/20',
                col_4: '29.46%'
            },
            {
                col_1: '安捷利实业<br>01639.HK',
                col_2: '1.61<br>2019/2/22',
                col_3: '1.69<br>2019/2/25',
                col_4: '4.97%'
            },
            {
                col_1: '港大零售<br>01255.HK',
                col_2: '9.16<br>2019/3/14',
                col_3: '10.72<br>2019/3/19',
                col_4: '17.03%'
            }
        ],
        tips:
            '风险提示：本页面提供的信息为量化回测分析结果，仅供投资者参考，不构成任何投资建议。 '
    },
    xgboost: {
        title: 'XGBoost多因子',
        intro:
            '基于大数据和人工智能，通过顶尖XGBoost极端梯度优化学习模型，挖掘交易机会，寻求超额收益',
        advantage: '核心优势',
        advantageTitle_1: '大数据挖掘',
        advantageDes_1: '全面关联市场信息和行情，实时监控个股变动',
        advantageTitle_2: 'BOOSTING优化',
        advantageDes_2:
            '基于机器学习，运用策略库和 多因子，深度优化，寻找更优买卖点',
        advantageTitle_3: '历史验证 收益可期',
        advantageDes_3: '穿越牛熊检验，10年回测率超60%，年平均收益25%',
        history: '历史胜率',
        historyDes: '据回测数据，统计期间，平均胜率达60%',
        service: '服务说明',
        serviceTitle_1: '适用人群',
        serviceDes_1: '偏好中长线投资，寻求相对稳健收益的投资者',
        serviceTitle_2: '服务方式',
        serviceDes_2:
            '订阅后可随时查看持仓个股，接收实时调仓提醒，自动计算仓位盈亏',
        tips:
            '风险提示：本页面提供的信息为量化回测分析结果，仅供投资者参考，不构成任何投资建议。'
    },
    multiAsset: {
        title: '多元资产专栏',
        etfTitle: '交易所买卖基金',
        etfDes: '分散风险的同时获得股票市场收益，可多可空',
        wrap_1: {
            title: '指数做多-看好后市，正向获利',
            children: [
                {
                    name: 'FL二南方恒指',
                    stock: '07200.HK',
                    des: '可以双倍看涨恒指的ETF，做多恒指的热门标的'
                },
                {
                    name: '标普500-2X看多',
                    stock: 'SSO.US',
                    des: '可以双倍看多标普500的ETF，做多美股优选'
                }
            ]
        },
        wrap_2: {
            title: '指数做空-看空后市，反向获利',
            children: [
                {
                    name: 'FI南方恒指',
                    stock: '07300.HK',
                    des: '一倍看空恒指的ETF，做空恒指的稳健选择'
                },
                {
                    name: 'FI二南方恒指',
                    stock: '07500.HK',
                    des: '双倍看空恒指的ETF，做空恒指的进取选择'
                },
                {
                    name: '标普500-2X看空',
                    stock: 'SDS.US',
                    des: '可以两倍看空标普500的ETF，做空美股优选'
                }
            ]
        },
        houseTitle: '房地产投资信托基金',
        houseDes: '房地产投资信托，投资于能够产生稳定租金收益的房产',
        wrap_3: {
            title: 'REITs-稳健投资首选',
            children: [
                {
                    name: '领展房产基金',
                    stock: '00823.HK',
                    des: '投资于商场及停车场业务，一个十年十倍的高息股'
                },
                {
                    name: '美国联邦不动产信托',
                    stock: 'FRT.US',
                    des:
                        '投资于高档购物中心和公寓，将稳定的租金收益以高分红反馈给投资者'
                }
            ]
        },
        bondTitle: '债券指数基金',
        bondDes: '全球高信誉债券，收益稳定，能抵御风险，穿越牛熊',
        wrap_4: {
            title: '债券指数基金-资产避险之选',
            children: [
                {
                    name: '美国短期国债ETF',
                    stock: 'SHV.US',
                    des: '走势平稳，风险低，适合短期避险'
                },
                {
                    name: '美国中期国债-Firstrade',
                    stock: 'BIV.US',
                    des: '适合熊市中长期避险'
                }
            ]
        },
        tips: '风险提示: 本页面提供的信息仅供参考，不构成任何投资建议。'
    }
}
