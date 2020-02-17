/**
 * @author jonas
 * @description 盯盘指标相关信息，包括指标类型、触发的条件code值、
 * 盯盘帮助中的文字配置及图片文件名、埋点事件名
 * 不要随便修改
 * 语言类型为中文（大陆,简称zh_CN）
 */


/**
 * 获取触发条件，每个盯盘的触发条件都不一样
 */
const warningConditionData = {
    // 价格盯盘
    price: [
        {
            data: [{
                text: '价格上涨',
                value: '500',
            }, {
                text: '价格下跌',
                value: '501',
            }],
            descriptions: {
                characteristic: `<p>预设理想的支撑或阻力位价格，达到预设价格后极速提醒，把握价格波动机会。</p><p>
               IAI Trade基于1小时周期平均真实波幅ATR（ATR参数：14，K线周期：1小时）,为您提供多个支撑位和阻力位。</p>
                <p>由ATR倍数计算的支撑、阻力位，可视为有效的入场点，以及持仓后的止损、止盈点；ATR倍数越大，表示距现价越远，短期触破的机率越低。</p>`,
                dealCase: [
                    {
                        title: '提醒买入案例',
                        content: '<p>Lili 喜欢炒黄金，但是平时忙碌没有时间看盘。价格在跌，但Lili判断行情即将接近底部，最终选择【最新价-1倍ATR】作为支撑位设置盯盘（此时现价1332.80，ATR为10.0，盯盘价为1322.80），当Lili收到价格已下跌到1322.80的盯盘通知时，下单买入；</p><p>Lili 买入开仓后，判断即将有大涨行情，于是同时设置了以【最新价-3倍ATR】做为止损点、以【最新价+3倍ATR】做为止盈点的价格盯盘。</p>',
                        imagesPath: ['a_key-drawing_1.1.1_price@2x.png', 'illu_steps_1.1_price@2x.png']
                    },
                    {
                        title: '提醒卖出案例',
                        content: '<p>Lili 喜欢炒黄金，但是平时忙碌没有时间看盘。价格在涨，但Lili判断行情即将接近顶部，最终选择【最新价+1倍ATR】作为阻力位设置盯盘（此时现价1332.80，ATR为10.0，盯盘价为1342.80），当Lili收到价格已上涨到1342.80的盯盘通知时，下单卖出；</p><p>Lili 卖出开仓后，判断将有大跌行情，于是同时设置了以【最新价+3倍ATR】做为止损点、以【最新价-3倍ATR】做为止盈点的价格盯盘。</p>',
                        imagesPath: ['a_key-drawing_1.1.2_price@2x.png', 'illu_steps_1.1_price@2x.png']
                    }
                ],
            },
            trackPrefix: "Current_Price_Warning",
            code: '101'
        },
        {
            data: [{
                text: '上涨超过',
                value: '502'
            }, {
                text: '下跌超过',
                value: '503'
            }],
            descriptions: {
                characteristic: `<p>监控大涨或大跌异动行情，抓住市场趋势机会。</p><p>为方便您精准捕获趋势机会，IAI Trade根据1小时平均真实波幅ATR倍数（ATR参数：14，K线周期：1小时），为您提供多个支撑、阻力位。</p><p>由ATR倍数计算的支撑、阻力位，可视为有效的入场点，以及持仓后的止损、止盈点；ATR倍数越大，表示距现价越远，短期触破的机率越低。</p>`,
                dealCase: [
                    {
                        title: '提醒买入案例',
                        content: '<p>Lili 喜欢炒黄金，但是平时忙碌没有时间看盘。价格开始上涨，Lili判断行情即将大涨，为再次确定入场机会，最终选择【0.3倍日内波幅】作为上涨幅度设置盯盘（此时现价1332.80，0.3倍日内波幅为50.0点，盯盘价为1337.80），当Lili收到点数已上涨超50.0点的盯盘通知时，下单买入；</p><p>Lili买入开仓后，担心行情过快回落，于是同时设置了以【上涨超过 1.0倍日内波幅】做为止盈点、以【下跌超过 1.0倍日内波幅】做为止损点的涨跌盯盘。</p>',
                        imagesPath: ['a_key-drawing_1.2.1_up_and_down@2x.png', 'illu_steps_1.2_up_and_down@2x.png']
                    },
                    {
                        title: '提醒卖出案例',
                        content: `<p>Lili 喜欢炒黄金，但是平时忙碌没有时间看盘。价格开始下跌，Lili判断行情即将大跌，为再次确定入场机会，最终选择【0.3倍日内波幅】作为下跌幅度设置盯盘（此时现价1332.80，0.3倍日内波幅为50.0点，盯盘价为1327.80），当Lili收到点数已下跌超50.0点的盯盘通知时，下单买入；</p><p>Lili 卖出开仓后，担心行情过快反弹，于是同时设置了以【下跌超过 1.0倍日内波幅】做为止盈点、以【上涨超过 1.0倍日内波幅】做为止损点的涨跌盯盘。</p>`,
                        imagesPath: ['a_key-drawing_1.2.2_up_and_down@2x.png', 'illu_steps_1.2_up_and_down@2x.png']
                    }
                ],
            },
            trackPrefix: "Up_And_Down_Warning",
            code: '102'
        },
        {
            data: [{
                text: '累计反弹点数',
                value: '504',
            }],
            descriptions: {
                characteristic: "反弹企稳后盯盘，把握底部买入机会。",
                dealCase: [],
                example: 'Lili 喜欢炒黄金，但是平时忙碌没有时间看盘。现在价格在跌，Lili 想要下跌企稳后买入，Lili 判底部价位在1331.62左右，又担心买入后会继续下跌，于是Lili 设置价格到达1331.62开始监控，累计反弹50点时提醒买入',
                imagesPath: ['a_key-drawing_1.3_rebound@2x.png', 'illu_steps_1.3_rebound@2x.png']
            },
            trackPrefix: "Bounce_Warning",
            code: '103'
        },
        {
            data: [{
                text: '累计回落点数',
                value: '505',
            }],
            descriptions: {
                characteristic: "回落企稳后盯盘，把握高点卖出机会。",
                dealCase: [],
                example: 'Lili 喜欢炒黄金，但是平时忙碌没有时间看盘。现在价格在涨，Li Li想要上涨企稳后卖出，Lili 判压力价位在1330.15左右，又担心卖出后会继续上涨，于是Lili 设置价格到达1330.15开始监控，并且累计回落50点时提醒卖出。',
                imagesPath: ['a_key-drawing_1.4_fall_after_rise@2x.png', 'illu_steps_1.4_fall_after_rise@2x.png']
            },
            trackPrefix: "Fallback_Warning",
            code: '104'
        },

    ],
    index: [
        // MACD震荡指标
        {
            data: [
                {
                    text: 'MACD金叉',
                    value: '600',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准买入时机",
                        principle: '当DIF指标线上穿DEA指标线出现金叉，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（12、26、9）。',
                        example: 'LiLi想要通过MACD指标寻找做多的入场机会，于是LiLi设置了30分钟周期的MACD金叉，当出现金叉时及时提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_2.1_MACD@2x.png', 'illu_steps_3.1.1.1_MACD@2x.png']
                    },
                    triggerDescription: '当DIF指标线上穿DEA指标线出现金叉，买入信号。',
                    emptyOrMore: '看涨'
                },
                {
                    text: 'MACD死叉',
                    value: '601',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准卖出时机",
                        principle: 'DIF指标线下穿DEA指标线出现死叉，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（12、26、9）。',
                        example: 'Lili想通过MACD指标寻找做空的入场机会，于是Lili设置了30分钟周期的MACD死叉，当出现死叉时及时提醒，Lili大胆做空，之后行情下跌，盈利可观。',
                        imagesPath: ['a_key-drawing_3.1.1.2_MACD@2x.png', 'illu_steps_3.1.1.2_MACD@2x.png']
                    },
                    triggerDescription: 'DIF指标线下穿DEA指标线出现死叉，卖出信号。',
                    emptyOrMore: '看跌'
                },
                {
                    text: 'MACD为正',
                    value: '602',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准买入时机",
                        principle: 'DIF和DEA指标线值都由负变正时，此时视为市场进入做多趋势，可以视为买入信号。',
                        example: 'Lili在学习了MACD指标之后，了解到MACD为正也可以作为入场信号，于是Lili设置了30分钟周期的MACD为正，当出现为正时及时提醒，Lili大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_3.1.1.3_MACD@2x.png', 'illu_steps_3.1.1.3_MACD@2x.png']
                    },
                    triggerDescription: 'DIF和DEA指标线值都由负变正时，买入信号。',
                    emptyOrMore: '看涨'
                },
                {
                    text: 'MACD为负',
                    value: '603',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准卖出时机",
                        principle: 'DIF和DEA指标线值都由正变负时，此时视为市场进入做空趋势，可以视为卖出信号',
                        example: 'LiLi想要通过MACD指标寻找做多的入场机会，于是LiLi设置了30分钟周期的MACD金叉，当出现金叉时及时提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_3.1.1.4_MACD@2x.png', 'illu_steps_3.1.1.4_MACD@2x.png']
                    },
                    triggerDescription: 'DIF和DEA指标线值都由正变负时，卖出信号。',
                    emptyOrMore: '看跌'
                }],
            trackPrefix: "Indicator_Warning_MACD",
            code: '201'
        },
        // RSI震荡指标
        {
            data: [{
                text: 'RSI超买',
                value: '604',
                descriptions: {
                    characteristic: "预期价格将见顶回落，适合做区间交易",
                    principle: 'RSI指标的原理指出任何市价的大涨或大跌，均在0-100之间变动。当RSI>=70，市场已到达超买状态，至此市场价格自然会回落调整，做空信号。默认参数（14）。',
                    example: 'LiLi想要通过RSI指标寻找做空的入场机会，于是LiLi设置了30分钟周期的RSI超买区，当RSI出现做空信号并盯盘时，LiLi及时做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_2.2.1_RSI@2x.png', 'illu_steps_3.1.2.1_RSI@2x.png']
                },
                triggerDescription: '当RSI>=70，市场已到达超买状态，卖出信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'RSI超卖',
                value: '605',
                descriptions: {
                    characteristic: "预期价格见底反弹，适合做区间交易。",
                    principle: 'RSI指标的原理指出任何市价的大涨或大跌，均在0-100之间变动。当RSI<=30，市场已到达超卖状态，至此市场价格自然会回升调整，做多信号。默认参数（14）。',
                    example: 'LiLi想要通过RSI指标寻找做多的入场机会，于是LiLi设置了30分钟周期的RSI超买区，当RSI出现做空信号并盯盘时，LiLi及时做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_2.2.2_RSI@2x.png', 'illu_steps_3.1.2.2_RSI@2x.png']
                },
                triggerDescription: '当RSI<=30，市场已到达超卖状态，买入信号。',
                emptyOrMore: '看涨'
            }],
            trackPrefix: "Indicator_Warning_RSI",
            code: '202'
        },
        // W&R震荡指标
        {
            data: [{
                text: 'W&R超买',
                value: '606',
                descriptions: {
                    characteristic: "能研判市场是否过度买入/过度卖出，并预测市场价格相反趋势的能力。",
                    principle: 'W&R>=-20，市场已到达超买状态，至此市场价格自然会回落调整，做空信号。默认参数（14）。',
                    example: 'Lili比较关注日内短期交易，但没有时间看盘。于是LiLi设置了30分钟周期的W&R指标超买区，当W&R>=-20市场已到达超买状态时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.3.1_WR@2x.png', 'illu_steps_3.1.3.1_WR@2x.png']
                },
                triggerDescription: 'W&R>=-20，市场已到达超买状态，卖出信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'W&R超卖',
                value: '607',
                descriptions: {
                    characteristic: "能研判市场是否过度买入/过度卖出，并预测市场价格相反趋势的能力。",
                    principle: 'W&R<=-80，市场已到达超卖状态，至此市场将出现反弹回升，做多信号。默认参数（14）。',
                    example: 'Lili比较关注日内短期交易，但没有时间看盘。于是LiLi设置了30分钟周期多DEM指标低风险区，DEM<=0.3已到达低风险区时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.3.2_WR@2x.png', 'illu_steps_3.1.3.2_WR@2x.png']
                },
                triggerDescription: 'W&R<=-80，市场已到达超卖状态，买入信号。',
                emptyOrMore: '看涨'
            }],
            trackPrefix: "Indicator_Warning_WR",
            code: '203'
        },
        // KD震荡指标
        {
            data: [{
                text: 'KD金叉',
                value: '608',
                descriptions: {
                    characteristic: "研究价格之间的关系，直观研判行情，适用于中短期趋势分析。",
                    principle: 'K指标线上穿D指标线出现金叉，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（5,3,3）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的KD指标金叉，当出现金叉时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.4.1_KD@2x.png', 'illu_steps_3.1.4.1_KD@2x.png']
                },
                triggerDescription: 'K指标线上穿D指标线出现金叉，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: 'KD死叉',
                value: '609',
                descriptions: {
                    characteristic: "研究价格之间的关系，直观研判行情，适用于中短期趋势分析。",
                    principle: 'K指标线下穿D指标线出现死叉，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（5，3，3）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期多KD指标死叉，当出现死叉信号时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.4.2_KD@2x.png', 'illu_steps_3.1.4.2_KD@2x.png']
                },
                triggerDescription: 'K指标线下穿D指标线出现死叉，卖出信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'KD超买',
                value: '611',
                descriptions: {
                    characteristic: "研究价格之间的关系，直观研判行情，适用于中短期趋势分析。",
                    principle: 'K>=80，市场已到达超买状态，至此市场价格自然会回落调整，做空信号。默认参数（5，3，3）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期KD指标超买区，当k>=80出现超买信号时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.4.3_KD@2x.png', 'illu_steps_3.1.4.3_KD@2x.png']
                },
                triggerDescription: 'K>=80，市场已到达超买状态，买入信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'KD超卖',
                value: '612',
                descriptions: {
                    characteristic: "研究价格之间的关系，直观研判行情，适用于中短期趋势分析。",
                    principle: 'K<=20，市场已到达超卖状态，至此市场将出现反弹回升，做多信号。默认参数（5，3，3）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期KD指标超卖区，当k<=20出现超卖信号时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.4.4_KD@2x.png', 'illu_steps_3.1.4.4_KD@2x.png']
                },
                triggerDescription: 'K<=20，市场已到达超卖状态，卖出信号。',
                emptyOrMore: '看涨'
            }],
            code: '204',
            trackPrefix: "Indicator_Warning_KD",
        },
        // Alligator震荡指标
        {
            data: [{
                text: '价格在Alligator三线之上',
                value: '613',
                descriptions: {
                    characteristic: "Alligator指标即鳄鱼指标，是使用分型集合学和非线性动力学的均衡线的组合，三线组合有助于趋势研判。",
                    principle: '当价格在分开的三条线之上时，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（13,8,5）。',
                    example: 'LiLi持仓周期比较短，于是Lili设置了30分钟周期的Alligator指标，当价格处在指标上方,当价格在分开的三条线之上时及时提醒，LiLi及时做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.5.1_Alligator@2x.png', 'illu_steps_3.1.5.1_Alligator@2x.png']
                },
                triggerDescription: '当价格在分开的三条线之上，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: '价格在Alligator三线之下',
                value: '614',
                descriptions: {
                    characteristic: "Alligator指标即鳄鱼指标，是使用分型集合学和非线性动力学的均衡线的组合，三线组合有助于趋势研判。",
                    principle: '当价格在分开的三条线之下时，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（13,8,5）。',
                    example: 'LiLi持仓周期比较短，于是LiLi设置了30分钟周期的Alligator指标，当价格处在指标下方，当价格在分开的三条线之下时及时盯盘，LiLi及时做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.5.2_Alligator@2x.png', 'illu_steps_3.1.5.2_Alligator@2x.png']
                },
                triggerDescription: '当价格在分开的三条线之下时，卖出信号。',
                emptyOrMore: '看跌'
            }],
            code: '205',
            trackPrefix: "Indicator_Warning_Alligator",
        },
        // AO震荡指标
        {
            data: [{
                text: 'AO柱形上穿零线',
                value: '615',
                descriptions: {
                    characteristic: "价格变动作为基础元素，测量当前市场驱动力处于加速或减速，可作为早期信号变换识别。",
                    principle: '当柱形图从下往上穿越零轴线时，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（5,34）。',
                    example: 'Lili比较关注日内交易，但没有时间看盘。于是LiLi设置了30分钟周期的AO指标，当柱状图上穿零轴线时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.6.1_AO@2x.png', 'illu_steps_3.1.6.1_AO@2x.png']
                },
                triggerDescription: '当柱形图从下往上穿越零轴线时，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: 'AO柱形下穿零线',
                value: '616',
                descriptions: {
                    characteristic: "价格变动作为基础元素，测量当前市场驱动力处于加速或减速，可作为早期信号变换识别。",
                    principle: '当柱形图从上往下穿越零轴线时，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（5，34）。',
                    example: 'Lili比较关注日内交易，但没有时间看盘。于是LiLi设置了30分钟周期AO指标，当柱状图下穿零轴线时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.6.2_AO@2x.png', 'illu_steps_3.1.6.2_AO@2x.png']
                },
                triggerDescription: '当柱形图从上往下穿越零轴线时，卖出信号。',
                emptyOrMore: '看跌'
            }],
            code: '206',
            trackPrefix: "Indicator_Warning_AO",

        },
        // DEM震荡指标
        {
            data: [{
                text: 'DEM到达高风险区',
                value: '617',
                descriptions: {
                    characteristic: "指明市场趋势潜在改变的时机，可作为进场的时机研判。",
                    principle: 'DEM>=0.7，市场价格已到达高风险区，至此市场价格自然会回落调整，做空信号。默认参数（14）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的DEM指标高风险区，当DEM>=0.7时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.7.1_DEM@2x.png', 'illu_steps_3.1.7.1_DEM@2x.png']
                },
                triggerDescription: 'DEM>=0.7，市场价格已到达高风险区，买入信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'DEM到达低风险区',
                value: '618',
                descriptions: {
                    characteristic: "指明市场趋势潜在改变的时机，可作为进场的时机研判。",
                    principle: 'DEM<=0.3，市场价格已到达低风险区，至此市场价格将出现反弹回升，做多信号。默认参数（14）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期多DEM指标低风险区，DEM<=0.3已到达低风险区时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.7.2_DEM@2x.png', 'illu_steps_3.1.7.2_DEM@2x.png']
                },
                triggerDescription: 'DEM<=0.3，市场价格已到达低风险区，卖出信号。',
                emptyOrMore: '看涨'
            }],
            code: '207',
            trackPrefix: "Indicator_Warning_DEM",
        },
        // OSMA震荡指标
        {
            data: [{
                text: 'OSMA开始下降',
                value: '619',
                descriptions: {
                    characteristic: "研判 MACD是否加速，识别买卖时机，且有效去除了频繁发出假信号的缺陷。",
                    principle: 'OSMA指标位于零轴上方且停止递增，开始下降时，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（12，26，9）。',
                    example: 'Lili比较关注日内交易，但没有时间看盘。于是LiLi设置了30分钟周期的OSMA指标，当柱状图上穿零轴线时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.8.1_OSMA@2x.png', 'illu_steps_3.1.8.1_OSMA@2x.png']
                },
                triggerDescription: 'OSMA指标位于零轴上方且停止递增，开始下降时，卖出信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'OSMA开始上升',
                value: '620',
                descriptions: {
                    characteristic: "研判 MACD是否加速，识别买卖时机，且有效去除了频繁发出假信号的缺陷。",
                    principle: 'OSMA指标位于零轴下方且停止递减，开始上升时，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（12，26，9）。',
                    example: 'Lili比较关注日内交易，但没有时间看盘。于是LiLi设置了30分钟周期OSMA指标，当柱状图下穿零轴线时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.8.2_OSMA@2x.png', 'illu_steps_3.1.8.2_OSMA@2x.png']
                },
                triggerDescription: 'OSMA指标位于零轴下方且停止递减，开始上升时，买入信号。',
                emptyOrMore: '看涨'
            }],
            code: '208',
            trackPrefix: "Indicator_Warning_OSMA"
        },
        // RVI震荡指标
        {
            data: [{
                text: 'RVI金叉',
                value: '621',
                descriptions: {
                    characteristic: "以价格的方差为基础，测量价格相对波动的强度与发散的趋势程度。",
                    principle: 'RVI指标线从下向上穿过信号线出现金叉，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（10）。',
                    example: 'Lili比较日内短期交易，但没有时间看盘。于是LiLi设置了30分钟周期的RVI指标金叉，当RVI指标线从下向上穿过信号线出现金叉时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.9.1_RVI@2x.png', 'illu_steps_3.1.9.1_RVI@2x.png']
                },
                triggerDescription: 'RVI指标线从下向上穿过信号线出现金叉，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: 'RVI死叉',
                value: '622',
                descriptions: {
                    characteristic: "以价格的方差为基础，测量价格相对波动的强度与发散的趋势程度。",
                    principle: 'RVI指标线从上向下穿过信号线出现死叉，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（10）。',
                    example: 'Lili比较关注日内短期交易，但没有时间看盘。于是LiLi设置了30分钟周期多RVI指标死叉，RVI指标线从上向下穿过信号线出现死叉时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.1.9.2_RVI@2x.png', 'illu_steps_3.1.9.2_RVI@2x.png']
                },
                triggerDescription: 'RVI指标线从上向下穿过信号线出现死叉，卖出信号。',
                emptyOrMore: '看跌'
            }], code: '209',
            trackPrefix: "Indicator_Warning_RVI",
        },
        // SAR震荡盯盘
        {
            data: [{
                text: 'SAR金叉',
                value: '623',
                descriptions: {
                    characteristic: "利用SAR把握中短期趋势行情，买点明确，适合波段操作。",
                    principle: '当价格从SAR底下上穿到SAR上方（SAR金叉）时，预示着新一轮上升行情即将展开，可视为市场进入做多趋势，买入信号。SAR默认参数（0.02，0.2）。',
                    example: 'Lili由于平时忙碌没有时间看盘，于是Lili设置了30分钟K线周期的价格上穿SAR，当收到【SAR金叉】的盯盘通知时，Lili大胆买入做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_2.3.1_SAR@2x.png', 'illu_steps_3.2.1.1_SAR@2x.png']
                },
                triggerDescription: '当价格从SAR指标线下方突破到上方时，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: 'SAR死叉',
                value: '624',
                descriptions: {
                    characteristic: "利用SAR把握中短期趋势行情，买点明确，适合波段操作。",
                    principle: '当价格从SAR上方下穿到SAR下方（SAR死叉）时，预示着新一轮下跌行情即将展开，可视为市场进入做空趋势，卖出信号。SAR默认参数（0.02，0.2）。',
                    example: 'Lili由于平时忙碌没有时间看盘，于是Lili设置了30分钟K线周期的价格下穿SAR，当收到【SAR死叉】的盯盘通知时，Lili大胆卖出做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_2.3.2_SAR@3x.png', 'illu_steps_3.2.1.2_SAR@2x.png']
                },
                triggerDescription: '当价格从SAR指标线上方突破到下方时，卖出信号。',
                emptyOrMore: '看跌'
            }],
            trackPrefix: "Indicator_Warning_SAR",
            code: '210'
        },
        // Envelopes趋势指标
        {
            data: [{
                text: 'Envelopes超买',
                value: '625',
                descriptions: {
                    characteristic: "预测市场价格在平均价格上下波动的范围，研判价格达到极端的状态下，创建买卖信号指引。",
                    principle: '当价格在Envelopes指标线上轨通道上方时，市场已到达超买状态，至此市场价格自然会回落调整，做空信号。默认参数（14）。',
                    example: 'Lili比较关注短期日内交易，但没有时间看盘。于是LiLi设置了30分钟周期的Envelopes指标超买区，当价格在Envelopes指标线上轨通道上方时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.5.1_Envelopes@2x.png', 'illu_steps_3.2.5.1_Envelopes@2x.png']
                },
                triggerDescription: '当价格在Envelopes指标线上轨通道上方时，市场已到达超买状态，卖出信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'Envelopes超卖',
                value: '626',
                descriptions: {
                    characteristic: "预测市场价格在平均价格上下波动的范围，研判价格达到极端的状态下，创建买卖信号指引。",
                    principle: '当价格在Envelopes指标线下轨通道下方时，市场已到达超卖状态，至此市场价格自然会反弹回升调整，做多信号。默认参数（14）。',
                    example: 'Lili比较关注短期日内交易，但没有时间看盘。于是LiLi设置了30分钟周期Envelopes指标超卖区，当价格在Envelopes指标线下轨通道下方时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.5.2_Envelopes@2x.png', 'illu_steps_3.2.5.2_Envelopes@2x.png']
                },
                triggerDescription: '当价格在Envelopes指标线下轨通道下方时，市场已到达超卖状态，买入信号。',
                emptyOrMore: '看涨'
            }],
            trackPrefix: "Indicator_Warning_Envelopes",
            code: '211'
        },
        // BOLL震荡盯盘
        {
            data: [{
                text: '价格突破BOLL上轨',
                value: '627',
                descriptions: {
                    characteristic: "随着价格波动幅度的大小而变化，具有灵活性、直观性和研判中长期趋势的特点。",
                    principle: '当价格从BOLL指标线下方向上突破上轨线时，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（20）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的BOLL指标，当出现价格上穿指标线时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.6.1_BOLL@2x.png', 'illu_steps_3.2.6.1_BOLL@2x.png']
                },
                triggerDescription: '当价格从BOLL指标线下方向上突破上轨线时，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: '价格突破BOLL下轨',
                value: '628',
                descriptions: {
                    characteristic: "随着价格波动幅度的大小而变化，具有灵活性、直观性和研判中长期趋势的特点。",
                    principle: '当价格从BOLL指标线上方向下突破下轨线时，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（20）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期BOLL指标，当出现价格下穿指标线时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.6.2_BOLL@2x.png', 'illu_steps_3.2.6.2_BOLL@2x.png']
                },
                triggerDescription: '当价格从BOLL指标线上方向下突破下轨线时，卖出信号。',
                emptyOrMore: '看跌'
            }],
            code: '212',
            trackPrefix: "Indicator_Warning_BOLL",
        },
        // MA独立趋势指标
        {
            data: [{
                text: '价格上穿20日MA线',
                value: '629',
                descriptions: {
                    characteristic: "趋势追踪，找准机会入场做多",
                    principle: '当价格上穿MA指标线时，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（20）',
                    example: '在上升趋势中，Lili 倾向通过均线确认做多信号，于是Lili设置了30分钟周期的价格上穿20日MA均线，当价格上穿20日均线时，Lili大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_2.4.1_MA@3x.png', 'illu_steps_3.2.2.1_MA@2x.png']
                },
                triggerDescription: '当价格上穿MA指标线时，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: '价格下穿20日MA线',
                value: '630',
                descriptions: {
                    characteristic: "趋势追踪，找准机会入场做空",
                    principle: '当价格下穿MA指标线时，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（20）',
                    example: '在下跌趋势中，Lili 倾向通过均线确认做空信号，于是Lili设置了30分钟周期的价格下穿20日MA均线，当价格下穿20日均线时，Lili大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_2.4.2_MA@3x.png', 'illu_steps_3.2.2.2_MA@2x.png']
                },
                triggerDescription: '当价格下穿MA指标线时，卖出信号。',
                emptyOrMore: '看跌'
            }],
            trackPrefix: "Indicator_Warning_MAS",
            code: '213'
        },
        // MA组合趋势指标
        {
            data: [{
                text: '5日MA上穿20日MA',
                value: '631',
                descriptions: {
                    characteristic: "稳定追踪趋势交易，过滤虚假信号，有效识别买入的时机点。",
                    principle: '短期MA指标线从下往上穿越长期指标线出现金叉，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（5，20）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的多MA指标金叉，当出现金叉时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.3.1_MAs@2x.png', 'illu_steps_3.2.3.1_MAs@2x.png']
                },
                triggerDescription: '短期MA指标线从下往上穿越长期MA指标线出现金叉，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: '5日MA下穿20日MA',
                value: '632',
                descriptions: {
                    characteristic: "稳定追踪趋势交易，过滤虚假信号，有效识别卖出的时机点。",
                    principle: '短期MA指标线从上往下穿越长期指标线出现死叉，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（5，20）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期多MA指标死叉，当出现死叉信号时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.3.2_MAs@2x.png', 'illu_steps_3.2.3.1_MAs@2x.png']
                },
                triggerDescription: '短期MA指标线从上往下穿越长期MA指标线出现死叉，卖出信号。',
                emptyOrMore: '看跌'
            }],
            trackPrefix: "Indicator_Warning_TwoMA",
            code: '214'
        },
        // CCI趋势指标
        {
            data: [{
                text: 'CCI超买',
                value: '633',
                descriptions: {
                    characteristic: "对急涨行情检测相对准确，适合短线操作",
                    principle: 'CCI>=100，市场已到达超买状态，至此市场价格自然会回落调整，做空信号。默认参数（14）。',
                    example: 'LiLi持仓周期比较短，但又想捕捉大行情，于是Lili设置了30分钟周期的CCI超买区，当CCI出现做空信号并盯盘时，LiLi及时做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_2.6.1_CCI@3x.png', 'illu_steps_3.2.4.1_CCI@2x.png']
                },
                triggerDescription: 'CCI>=100，市场已到达超买状态，卖出信号。',
                emptyOrMore: '看跌'
            }, {
                text: 'CCI超卖',
                value: '634',
                descriptions: {
                    characteristic: "对急跌行情检测相对准确，适合短线操作",
                    principle: '当CCI<=-100，市场已到达超卖状态，至此市场将出现反弹回升，做多信号。默认参数（14）。',
                    example: 'LiLi持仓周期比较短，但又想捕捉大行情，于是LiLi设置了30分钟周期的CCI超卖区，当CCI出现做多信号并盯盘时，LiLi及时做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_2.6.2_CCI@3x.png', 'illu_steps_3.2.4.2_CCI@2x.png']
                },
                triggerDescription: '当CCI<=-100，市场已到达超卖状态，买入信号。',
                emptyOrMore: '看涨'
            }],
            trackPrefix: "Indicator_Warning_CCI",
            code: '215'
        },
        // DMI趋势盯盘
        {
            data: [{
                text: 'DMI金叉',
                value: '635',
                descriptions: {
                    characteristic: "利用多空趋向之变化差离与总和判定价格变动的平均趋势，从而识别市场趋势。",
                    principle: '+DI指标线从下往上穿越-DI指标线出现金叉，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（14）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的DMI指标金叉，当出现金叉时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.7.1_ADX@2x.png', 'illu_steps_3.2.7.1_DMI@2x.png']
                },
                triggerDescription: '+DI指标线从下往上穿越-DI指标线出现金叉，买入信号。',
                emptyOrMore: '看涨'
            }, {
                text: 'DMI死叉',
                value: '636',
                descriptions: {
                    characteristic: "利用多空趋向之变化差离与总和判定价格变动的平均趋势，从而识别市场趋势。",
                    principle: '+DI指标线从上往下穿越-DI指标线出现死叉，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数（14）。',
                    example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期DMI指标死叉，当出现死叉信号时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                    imagesPath: ['a_key-drawing_3.2.7.2_ADX@2x.png', 'illu_steps_3.2.7.2_DMI@2x.png']
                },
                triggerDescription: '+DI指标线从上往下穿越-DI指标线出现死叉，卖出信号。',
                emptyOrMore: '看跌'
            }],
            code: '216',
            trackPrefix: "Indicator_Warning_ADX",
        },
    ],
    combination: [
        //SAR与MA组合
        {
            data: [
                {
                    text: 'SAR金叉且价格在20日MA上方',
                    value: '700',
                    descriptions: {
                        characteristic: "SAR与MA组合增强验证信号，买点明确，把握中短期趋势，适合波段操作。",
                        principle: '当价格从SAR底下上穿到SAR上方（SAR金叉）且价格位于MA指标线上方时，进一步增强验证信号：上升行情即将展开，可视为市场进入做多趋势，买入信号。MA默认参数（20），SAR默认参数（0.02，0.2）。',
                        example: 'Lili由于平时忙碌没有时间看盘，于是Lili设置了30分钟K线周期的【SAR金叉且价格在20日MA上方】盯盘，当收到【SAR金叉且价格在20日MA上方】的盯盘通知时，Lili大胆买入做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_4.1.1_SAR+MA@2x.png', 'illu_steps_4.1.1_SAR+MA@2x.png']
                    },
                    triggerDescription: '当价格从下往上穿越SAR指标并且位于MA指标线上方，买入信号。',
                    emptyOrMore: '看涨'
                }, {
                    text: 'SAR死叉且价格在20日MA下方',
                    value: '701',
                    descriptions: {
                        characteristic: "SAR与MA组合增强验证信号，卖点明确，把握中短期趋势，适合波段操作。",
                        principle: '当价格从SAR上方下穿到SAR下方（SAR死叉）且价格位于MA指标线下方时，进一步增强验证信号：下跌行情即将展开，可视为市场进入做空趋势，卖出信号。MA默认参数（20），SAR默认参数（0.02，0.2）。',
                        example: 'Lili由于平时忙碌没有时间看盘，于是Lili设置了30分钟K线周期的【SAR死叉且价格在20日MA下方】盯盘，当收到【SAR死叉且价格在20日MA下方】的盯盘通知时，Lili大胆卖出做空，之后行情下跌，盈利可观。',
                        imagesPath: ['a_key-drawing_4.1.2_SAR+MA@2x.png', 'illu_steps_4.1.1_SAR+MA@2x.png']
                    },
                    triggerDescription: '当价格从上往下穿越SAR指标线且位于MA指标线的下方，卖出信号。',
                    emptyOrMore: '看跌'
                },
            ],
            trackPrefix: "Combined_Warning_SARMA",
            code: '301'
        },
        //MACD与DMI组合
        {
            data: [
                {
                    text: 'MACD为正且ADX>20',
                    value: '702',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准买入时机，并结合多空动能识别趋势强度。",
                        principle: 'DIF和DEA指标线值均为正，且DMI指标中ADX值大于20，此时可视为市场进入做多趋势，提供买入信号。默认参数MACD(12、26、9)，DMI(14)。',
                        example: 'LiLi平时的持仓周期比较短，于是LiLi设置了30分钟周期的MACD与DMI组合，当出现MACD为正且ADX值大于20时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_4.2.1_MACD+ADX@2x.png', 'illu_steps_4.2.1_MACD+DMI@2x.png']
                    },
                    triggerDescription: 'DIF和DEA指标值均由负转正 且 ADX值 >20，买入信号。',
                    emptyOrMore: '看涨'
                }, {
                    text: 'MACD为负且ADX>20',
                    value: '703',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准卖出时机，并结合多空动能识别趋势强度。",
                        principle: 'DIF和DEA指标线值均为负，且DMI指标中ADX值大于20，此时可视为市场进入做空趋势，提供卖出信号。默认参数MACD(12、26、9)，DMI(14)。',
                        example: 'LiLi平时的持仓周期比较短，于是LiLi设置了30分钟周期的MACD与DMI组合，当出现MACD为负且ADX值大于20时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                        imagesPath: ['a_key-drawing_4.2.2_MACD+ADX@2x.png', 'illu_steps_4.2.2_MACD+DMI@2x.png']
                    },
                    triggerDescription: 'DIF和DEA指标值均由正转负 且 ADX值 >20，卖出信号。',
                    emptyOrMore: '看跌'
                },
                {
                    text: 'MACD、DMI同时金叉',
                    value: '704',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准买入时机，并结合多空动能识别趋势强度。",
                        principle: 'MACD出现金叉（即DIF线上穿DEA线），同时DMI出现金叉（+DI线上穿越-DI线），此时可视为市场进入做多趋势，提供买入信号。',
                        example: 'LiLi平时的持仓周期比较短，于是LiLi设置了30分钟周期的MACD与DMI组合，当出现MACD金叉且+DI上穿-DI时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_4.2.3_MACD+ADX@2x.png', 'illu_steps_4.2.3_MACD+DMI@2x.png']
                    },
                    triggerDescription: 'DIF线上穿DEA线 且 +DI线上穿-DI线 ，买入信号。',
                    emptyOrMore: '看涨'
                },
                {
                    text: 'MACD、DMI同时死叉',
                    value: '705',
                    descriptions: {
                        characteristic: "排除虚假信号，抓准卖出时机，并结合多空动能识别趋势强度。",
                        principle: 'MACD出现死叉（即DIF线下穿DEA线），同时DMI出现死叉（+DI线下穿-DI线），此时可视为市场进入做空趋势，提供卖出信号。',
                        example: 'LiLi平时的持仓周期比较短，于是LiLi设置了30分钟周期的MACD与DMI组合，当出现MACD死叉且+DI下穿-DI时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                        imagesPath: ['a_key-drawing_4.2.4_MACD+ADX@2x.png', 'illu_steps_4.2.4_MACD+DMI@2x.png']
                    },
                    triggerDescription: 'DIF线下穿DEA线 且 +DI线下穿-DI线 ，卖出信号。',
                    emptyOrMore: '看跌'
                },
            ],
            trackPrefix: "Indicator_Warning_MACDADX",
            code: '302'
        },
        //KD与ADX组合
        {
            data: [
                {
                    text: 'KD金叉且+DI大于-DI',
                    value: '706',
                    descriptions: {
                        characteristic: "价格关系与多空动能相结合，直观研判行情从而识别市场趋势，适用于中短期趋势分析",
                        principle: 'K线上穿D线出现金叉且+DI大于-DI，同时ADX值>20，此时可视为市场进入做多趋势，提供买入信号。默认参数KD（5，3，3），DMI(14)。',
                        example: 'LiLi比较关注日内趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的KD与DMI组合，当KD金叉且+DI大于-DI时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_4.3.1_KD+ADX@2x.png', 'illu_steps_4.3.1_KD+DMI@2x.png']
                    },
                    triggerDescription: 'K线上穿D线出现金叉 且 +DI>-DI，同时 ADX值 >20，买入信号。',
                    emptyOrMore: '看涨'
                }, {
                    text: 'KD死叉且+DI小于-DI',
                    value: '707',
                    descriptions: {
                        characteristic: "研判多空动能从而识别市场趋势，受价格波动由均衡到失衡的循环。",
                        principle: 'K线下穿D线出现死叉且+DI小于-DI，同时ADX值>20，此时可视为市场进入做空趋势，提供卖出信号。默认参数KD（5，3，3），DMI(14)。',
                        example: 'LiLi比较关注日内趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期的KD与DMI组合，当KD死叉且+DI小于-DI时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                        imagesPath: ['a_key-drawing_4.3.2_KD+ADX@2x.png', 'illu_steps_4.3.2_KD+DMI@2x.png']
                    },
                    triggerDescription: 'K线下穿D线出现金叉 且 +DI<-DI，同时 ADX值 >20，卖出信号。',
                    emptyOrMore: '看跌'
                },
            ],
            trackPrefix: "Indicator_Warning_KDADX",
            code: '303'
        },
        //Fractals与Alligator组合
        {
            data: [
                {
                    text: 'Fractals在Alligator牙齿之上',
                    value: '708',
                    descriptions: {
                        characteristic: "Alligator三线组合作为趋势研判基准，并结合Fractals指标测算底线或者顶线，有效把握趋势精准进场。",
                        principle: '分型指标在Alligator指标线的红色线条（代表鳄鱼的牙齿）上方，此时可以视为市场进入做多趋势，可以视为买入信号。默认参数（14）。',
                        example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期Fractals与Allogator组合，分型指标在Alligator指标红色线条上方时及时盯盘提醒，LiLi大胆做多，之后行情上涨，盈利可观。',
                        imagesPath: ['a_key-drawing_4.4.1_Fractals+Alligator@2x.png', 'illu_steps_4.4.1_Fractals+Alligator@2x.png']
                    },
                    triggerDescription: '分型指标在Alligator指标线的红色线条（代表鳄鱼的牙齿）上方，买入信号。',
                    emptyOrMore: '看涨'
                }, {
                    text: 'Fractals在Alligator牙齿之下',
                    value: '709',
                    descriptions: {
                        characteristic: "Alligator三线组合作为趋势研判基准，并结合Fractals指标测算底线或者顶线，有效把握趋势精准进场。",
                        principle: '分型指标在Alligator指标线的红色线条（代表鳄鱼的牙齿）下方，此时可以视为市场进入做空趋势，可以视为卖出信号。默认参数Alligator（13,8,5）。',
                        example: 'Lili比较关注趋势交易，但没有时间看盘。于是LiLi设置了30分钟周期Fractals与Allogator组合，分型指标在Alligator指标红色线条下方时及时盯盘提醒，LiLi大胆做空，之后行情下跌，盈利可观。',
                        imagesPath: ['a_key-drawing_4.4.2_Fractals+Alligator@2x.png', 'illu_steps_4.4.2_Fractals+Alligator@2x.png']
                    },
                    triggerDescription: '分型指标在Alligator指标线的红色线条（代表鳄鱼的牙齿）下方，卖出信号。',
                    emptyOrMore: '看跌'
                },
            ],
            trackPrefix: "Indicator_Warning_FractalsAlligator",
            code: '304'
        },
    ]
}

/**
 * 盯盘类型数据
 */
const waringData = {
    // 价格盯盘
    priceListData: [
        {
            title: '现价盯盘',
            desction: '提供支撑、阻力位选择，价格到达理想价位时，实时提醒买卖',
            link: {
                name: 'dataWarningDetail',
                query: { code: 101 }
            },
        },
        {
            title: '涨跌盯盘',
            desction: '提供支撑、阻力位选择，预设涨跌幅度，实时提醒买卖',
            link: {
                name: 'dataWarningDetail',
                query: { code: 102 }
            },
        },
        {
            title: '反弹盯盘',
            desction: '预设反弹幅度，出现反弹时提醒',
            link: {
                name: 'dataWarningDetail',
                query: { code: 103, }
            },
        },
        {
            title: '回落盯盘',
            desction: '预设回落幅度，出现回落后提醒',
            link: {
                name: 'dataWarningDetail',
                query: { code: 104 }
            },
        },
    ],
    // 组合盯盘-data
    combinationListData: [
        {
            title: 'SAR与MA组合',
            desction: '组合增强验证信号，把握中短期趋势，买卖明确，适合波段操作',
            link: {
                name: 'dataWarningDetail',
                query: { code: 301 }
            },
        },
        {
            title: 'MACD与DMI组合',
            desction: '排除虚假信号，抓准买卖时机，并结合多空动能识别趋势强度',
            link: {
                name: 'dataWarningDetail',
                query: { code: 302 }
            },
        },
        {
            title: 'KD与DMI组合',
            desction: '价格关系与多空动能相结合，适用于中短期趋势分析',
            link: {
                name: 'dataWarningDetail',
                query: { code: 303 }
            },
        },
        {
            title: 'Fractals与Alligator组合',
            desction: 'Alligator指标为趋势研判基准，Fractals指标测算底线或者顶线，精准把握趋势',
            link: {
                name: 'dataWarningDetail',
                query: { code: 304 }
            },
        },
    ],
    // 指标盯盘
    indexListData: [
        {
            title: 'MACD指标盯盘',
            desction: '排除虚假信号，找准买入、卖出时机',
            link: {
                name: 'dataWarningDetail',
                query: { code: 201 }
            },
            // type:1震荡盯盘、type:2趋势盯盘
            type: 1
        },
        {
            title: 'RSI指标盯盘',
            desction: '预期价格见顶回落或者见底反弹，适合做区间交易',
            link: {
                name: 'dataWarningDetail',
                query: { code: 202 }
            },
            type: 1
        },
        {
            title: 'W&R指标盯盘',
            desction: '能研判市场是否过度卖出/买入，并预测市场价格相反趋势的能力',
            link: {
                name: 'dataWarningDetail',
                query: { code: 203 }
            },
            type: 1
        },
        {
            title: 'KD指标盯盘',
            desction: '研究价格之间的关系，适用于中短期趋势分析',
            link: {
                name: 'dataWarningDetail',
                query: { code: 204 }
            },
            type: 1
        },
        {
            title: 'Alligator指标盯盘',
            desction: 'Alligator指标即鳄鱼指标，三线组合有助于趋势研判',
            link: {
                name: 'dataWarningDetail',
                query: { code: 205 }
            },
            type: 1
        },
        {
            title: 'AO指标盯盘',
            desction: '测量当前市场驱动力处于加速或减速，早期信号变换识别',
            link: {
                name: 'dataWarningDetail',
                query: { code: 206 }
            },
            type: 1
        },
        {
            title: 'DEM指标盯盘',
            desction: '指明市场趋势潜在改变的时机，可作为进场的时机研判',
            link: {
                name: 'dataWarningDetail',
                query: { code: 207 }
            },
            type: 1
        },
        {
            title: 'OSMA指标盯盘',
            desction: '研判 MACD是否加速，有效去除频繁发出假信号的缺陷',
            link: {
                name: 'dataWarningDetail',
                query: { code: 208 }
            },
            type: 1
        },
        {
            title: 'RVI指标盯盘',
            desction: '以价格的方差为基础，测量价格相对波动的强度与发散的趋势程度',
            link: {
                name: 'dataWarningDetail',
                query: { code: 209 }
            },
            type: 1
        },
        {
            title: 'SAR指标盯盘',
            desction: '买卖点明确，避免长期套牢的危险，同时又能避免错失行情',
            link: {
                name: 'dataWarningDetail',
                query: { code: 210 }
            },
            type: 2
        },
        {
            title: 'Envelopes指标盯盘',
            desction: '预测市场价格上下波动的范围，当价格达到上下边缘时发出买卖信号',
            link: {
                name: 'dataWarningDetail',
                query: { code: 211 }
            },
            type: 2
        },
        {
            title: 'BOLL指标盯盘',
            desction: '随着价格波动幅度的大小而变化，灵活直观，适合研判中长期趋势',
            link: {
                name: 'dataWarningDetail',
                query: { code: 212 }
            },
            type: 2
        },
        {
            title: 'MA独立指标盯盘',
            desction: '趋势追踪，找准机会入场做多或做空',
            link: {
                name: 'dataWarningDetail',
                query: { code: 213 }
            },
            type: 2
        },
        {
            title: 'MA组合指标盯盘',
            desction: '稳定追踪趋势交易，过滤虚假信号，有效识别买卖的时机点',
            link: {
                name: 'dataWarningDetail',
                query: { code: 214 }
            },
            type: 2
        },
        {
            title: 'CCI指标盯盘',
            desction: '对急涨急跌行情检测相对准确，适合短线操作',
            link: {
                name: 'dataWarningDetail',
                query: { code: 215 }
            },
            type: 2
        },
        {
            title: 'DMI指标盯盘',
            desction: '利用多空趋向的变化差离与总和，判定价格变动的平均趋势',
            link: {
                name: 'dataWarningDetail',
                query: { code: 216 }
            },
            type: 2
        },
    ]
}

/**
 * 盯盘设置-选择select options参数
 */
const selectOptions = {
    // 产品名 symbol或货币对
    product: [],
    // 周期
    cycle: [
        // {
        //     text: '1分钟',
        //     value: '1'
        // },
        {
            text: '5分钟',
            value: '7'
        },
        {
            text: '15分钟',
            value: '9'
        },
        {
            text: '30分钟',
            value: '11'
        },
        {
            text: '1小时',
            value: '2'
        },
        {
            text: '4小时',
            value: '13'
        },
        {
            text: '1天',
            value: '3'
        },
    ],
    //频率
    frequency: [
        {
            text: '仅提醒一次',
            value: '1'
        },
        {
            text: '触发即提醒',
            value: '0'
        },
    ],
    //
    expiry: [
        // {
        //     text: '一次有效',
        //     value: 'once'
        // },
        // {
        //     text: '当日有效',
        //     value: 'day'
        // },
        {
            text: '七天有效',
            value: 'week'
        },
        // {
        //     text: '当月有效',
        //     value: 'month'
        // },
    ],
    // 价格盯盘_提醒频率
    priceFrequency: [
        {
            text: '仅提醒一次',
            value: '1'
        },
        {
            text: '每天提醒一次',
            value: '0'
        },
    ]
}
// 价格预警单独分离出来版本，配置信息
const newPriceWarningConfig = {
    // 频率
    frequencies: [
        // {
        //     text: '触发即提醒',
        //     value: 0
        // },

        {
            text: '仅提醒一次',
            value: 1,
            defaultSelect: true,
        },

        {
            text: '每日一次',
            value: 2
        },
        // {
        //     text: '1分钟最多一次',
        //     value: 3
        // },
        {
            text: '1小时最多一次',
            value: 4
        },
    ],
    triggerData: [
        //最新价上涨
        {
            type: 5001,
            text: '最新价上涨至',
            placeholder: '不低于最新价',
            triggerType: 500,
            warning_type: 101,
            name: 'now_new_price_up',
            basePrice:0//基准价（0：最新价、1：买入价、2：卖出价）
        },
        // 卖价上涨
        {
            type: 5002,
            text: '卖出价上涨至',
            placeholder: '不低于卖出价',
            triggerType: 500,
            warning_type: 101,
            name: 'now_ask_price_up',
            flag: 1,//0百分比 1点数,
            basePrice:2
        },
        // 买价上涨
        {
            type: 5003,
            text: '买入价上涨至',
            placeholder: '不低于买入价',
            triggerType: 500,
            warning_type: 101,
            name: 'now_bid_price_up',
            flag: 1,
            basePrice:1
        },
        // 最新价下跌
        {
            type: 5011,
            text: '最新价下跌至',
            placeholder: '不高于最新价',
            triggerType: 501,
            warning_type: 101,
            name: 'now_new_price_down',
            basePrice:0
        },
        // 卖价下跌
        {
            type: 5012,
            text: '卖出价下跌至',
            placeholder: '不高于卖出价',
            triggerType: 501,
            warning_type: 101,
            name: 'now_ask_price_down',
            flag: 1,
            basePrice:2
        },
        // 买价下跌
        {
            type: 5013,
            text: '买入价下跌至',
            placeholder: '不高于买入价',
            triggerType: 501,
            warning_type: 101,
            name: 'now_bid_price_down',
            flag: 1,
            basePrice:1
        },
        //1分钟内上涨
        {
            type: 5101,
            text: '1分钟内上涨',
            triggerType: 510,
            warning_type: 101,
            name: 'min_1_up',
            flag: 1,
            basePrice:0
        },
        // 5分钟内上涨
        {
            type: 5102,
            text: '5分钟内上涨',
            triggerType: 510,
            warning_type: 101,
            name: 'min_5_up',
            flag: 1,
            basePrice:0
        },
        // 30分钟内上涨
        {
            type: 5103,
            text: '30分钟内上涨',
            triggerType: 510,
            warning_type: 101,
            name: 'min_30_up',
            flag: 1,
            basePrice:0
        },
        // 1分钟内下跌
        {
            type: 5111,
            text: '1分钟内下跌',
            triggerType: 511,
            warning_type: 101,
            name: 'min_1_down',
            flag: 1,
            basePrice:0
        },
        // 5分钟内下跌
        {
            type: 5112,
            text: '5分钟内下跌',
            triggerType: 511,
            warning_type: 101,
            name: 'min_5_down',
            flag: 1,
            basePrice:0
        },
        // 30分钟下跌
        {
            type: 5113,
            text: '30分钟内下跌',
            triggerType: 511,
            warning_type: 101,
            name: 'min_30_down',
            flag: 1,
            basePrice:0
        },
        // 上涨超过
        {
            type: 502,
            text: '上涨超过',
            placeholder: '0.0',
            triggerType: 502,
            warning_type: 102,
            name: '',
            flag: 1,
            basePrice:0
        },
        // 下跌超过
        {
            type: 503,
            text: '下跌超过',
            placeholder: '0.0',
            triggerType: 503,
            warning_type: 102,
            name: '',
            flag: 1,
            basePrice:0
        },
    ],
    // 添加预警数据
    addPriceWarningData: [
        {
            text: '价格上涨至',
            defaultType: 5001,
            placeholder: '不低于最新价',
            // 包含类型
            nodes: [5001, 5002, 5003]
        },
        {
            text: '价格下跌至',
            defaultType: 5011,
            placeholder: '不高于最新价',
            nodes: [5011, 5012, 5013]
        },
        {
            text: '分钟内上涨',
            defaultType: 5103,
            placeholder: '0.00',
            nodes: [5101, 5102, 5103]
        },
        {
            text: '分钟内下跌',
            defaultType: 5113,
            placeholder: '0.00',
            nodes: [5111, 5112, 5113]
        },
        {
            text: '上涨超过',
            defaultType: 502,
            placeholder: '0.00'
        },
        {
            text: '下跌超过',
            defaultType: 503,
            placeholder: '0.00'
        },
    ],
}
export default {
    warningConditionData,
    waringData,
    selectOptions,
    newPriceWarningConfig
}
