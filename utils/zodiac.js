/**
 * 根据生日获取星座
 * @param {Number} month 月份 (1-12)
 * @param {Number} day 日期 (1-31)
 * @returns {Object} 星座对象，包含名称、英文名称和日期范围
 */
export function getZodiacSign(month, day) {
    month = parseInt(month);
    day = parseInt(day);

    const zodiacSigns = [
        { name: '水瓶座', engName: 'aquarius', startDate: { month: 1, day: 20 }, endDate: { month: 2, day: 18 } },
        { name: '双鱼座', engName: 'pisces', startDate: { month: 2, day: 19 }, endDate: { month: 3, day: 20 } },
        { name: '白羊座', engName: 'aries', startDate: { month: 3, day: 21 }, endDate: { month: 4, day: 19 } },
        { name: '金牛座', engName: 'taurus', startDate: { month: 4, day: 20 }, endDate: { month: 5, day: 20 } },
        { name: '双子座', engName: 'gemini', startDate: { month: 5, day: 21 }, endDate: { month: 6, day: 21 } },
        { name: '巨蟹座', engName: 'cancer', startDate: { month: 6, day: 22 }, endDate: { month: 7, day: 22 } },
        { name: '狮子座', engName: 'leo', startDate: { month: 7, day: 23 }, endDate: { month: 8, day: 22 } },
        { name: '处女座', engName: 'virgo', startDate: { month: 8, day: 23 }, endDate: { month: 9, day: 22 } },
        { name: '天秤座', engName: 'libra', startDate: { month: 9, day: 23 }, endDate: { month: 10, day: 23 } },
        { name: '天蝎座', engName: 'scorpio', startDate: { month: 10, day: 24 }, endDate: { month: 11, day: 22 } },
        { name: '射手座', engName: 'sagittarius', startDate: { month: 11, day: 23 }, endDate: { month: 12, day: 21 } },
        { name: '摩羯座', engName: 'capricorn', startDate: { month: 12, day: 22 }, endDate: { month: 1, day: 19 } }
    ];

    for (let i = 0; i < zodiacSigns.length; i++) {
        const sign = zodiacSigns[i];

        // 处理摩羯座跨年的特殊情况
        if (i === 11) { // 摩羯座
            if ((month === 12 && day >= sign.startDate.day) || (month === 1 && day <= sign.endDate.day)) {
                return sign;
            }
        }
        // 处理其他星座
        else if (
            (month === sign.startDate.month && day >= sign.startDate.day) ||
            (month === sign.endDate.month && day <= sign.endDate.day)
        ) {
            return sign;
        }
    }

    // 默认返回水瓶座（正常情况下不会到这里）
    return zodiacSigns[0];
}

/**
 * 获取元素信息（风火水土）
 * @param {String} engName 星座英文名称
 * @returns {Object} 元素信息，包含类型和颜色
 */
export function getZodiacElement(engName) {
    const elements = {
        // 风象星座
        'gemini': { type: 'air', color: '#B2DFEE' },
        'libra': { type: 'air', color: '#B2DFEE' },
        'aquarius': { type: 'air', color: '#B2DFEE' },

        // 火象星座
        'aries': { type: 'fire', color: '#FF6347' },
        'leo': { type: 'fire', color: '#FF6347' },
        'sagittarius': { type: 'fire', color: '#FF6347' },

        // 土象星座
        'taurus': { type: 'earth', color: '#8B6914' },
        'virgo': { type: 'earth', color: '#8B6914' },
        'capricorn': { type: 'earth', color: '#8B6914' },

        // 水象星座
        'cancer': { type: 'water', color: '#1E90FF' },
        'scorpio': { type: 'water', color: '#1E90FF' },
        'pisces': { type: 'water', color: '#1E90FF' }
    };

    return elements[engName] || { type: 'unknown', color: '#FFFFFF' };
}