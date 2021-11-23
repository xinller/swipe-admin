import { String } from "core-js"

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
    return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
    let len = Math.min(arr1.length, arr2.length)
    let i = -1
    let res = []
    while (++i < len) {
        const item = arr2[i]
        if (arr1.indexOf(item) > -1) res.push(item)
    }
    return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
    return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }
    return false
}



/** 
 * 日期转换 
 * @param date date对象
 * @param format 日期格式
 * @return 例如  2016-7-16 16:24:58 
 **/
export function formatDate(date, format) {
    let paddNum = function(num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
    };
    //指定格式字符
    let cfg = {
        yyyy: date.getFullYear(), //年 : 4位
        yy: date.getFullYear().toString().substring(2), //年 : 2位
        M: date.getMonth() + 1, //月 : 如果1位的时候不补0
        MM: paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
        d: date.getDate(), //日 : 如果1位的时候不补0
        dd: paddNum(date.getDate()), //日 : 如果1位的时候补0
        hh: paddNum(date.getHours()), //时 : 如果1位的时候补0
        mm: paddNum(date.getMinutes()), //分 : 如果1位的时候补0
        ss: paddNum(date.getSeconds()), //秒 : 如果1位的时候补0
        ms: paddNum(date.getMilliseconds()) //毫秒 : 如果1位的时候补0
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function(m) { return cfg[m]; });
}

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
    if (key) return key in obj
    else {
        let keysArr = Object.keys(obj)
        return keysArr.length
    }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
    const keysArr1 = Object.keys(obj1)
    const keysArr2 = Object.keys(obj2)
    if (keysArr1.length !== keysArr2.length) return false
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true
        /* eslint-disable-next-line */
    else return !keysArr1.some(key => obj1[key] != obj2[key])
}



/**
 * @param {*} size 对象
 * @description 根据配置转换表格尺寸值
 */
export const tableChangeSize = (size) => {
    let val = "middle"
    switch (size) {
        case "default":
            val = "middle"
            break;
        case "large":
            val = "default"
            break;
        case "small":
            val = "small"
            break;
    }
    return val;
}


/**
 * @param {*} size 表格尺寸
 * @param {*} height 表格高度 
 * @description 计算懒加载表格需求加载条数
 */
export const countTableLimt = (size, height) => {
    const tableRowHeight = {
        default: 38,
        middle: 30,
        small: 24
    }
    let limt = _.ceil(height / tableRowHeight[size]);
    return limt + 1;
}


/**
 * @param {*} record 表格数据
 * @param {*} index 表格索引
 * @description 表格斑马纹
 */
export const tableZebraStripe = (record, index) => {
    if (index % 2 !== 0) {
        //偶数
        return "odd-table-row";
    }
    return "";
}

/**
 * @param {*} arr 去重的数组
 * @description 数组去重
 */
export const format_unique = (arr) => {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
        }
    }
    return array;
}


export function timestampToTime(length_t) {
    var t = ''
        //天数
    var days = Math.floor(length_t / (60 * 60 * 24))
        //取模（余数）
    var modulo = length_t % (60 * 60 * 24)
        //小时数
    var hours = Math.floor(modulo / (60 * 60))
    modulo = modulo % (60 * 60)
        //分钟
    var minutes = Math.floor(modulo / 60)
        //秒
    var seconds = Math.floor(modulo % 60)
        //输出到页面
    t = days + '天' + hours + '时' + minutes + '分' + seconds + '秒'
    if (days == 0) {
        t = +hours + '时' + minutes + '分' + seconds + '秒'
    }
    return t
}

export function format_down_time(end_time) {
    if (!end_time) return ''
    var ctime = new Date().getTime() / 1000
    var etime = new Date(end_time.replace(/-/g, '/')).getTime() / 1000
    var length = etime - ctime
    if (length > 0) {
        var a = timestampToTime(length)
        return a
    } else {
        return ''
    }
}


export function formatBrowse(item) {
    switch (String(item)) {
        case '0':
            return '主'
        case '1':
            return '比'
        case '2':
            return '评'
        case '3':
            return '聊'
        case '4':
            return '藏'
        case '5':
            return '藏'
        case '6':
            return '购'
        case '7':
            return '视'
        case '8':
            return '橱'
        case '9':
            return '次'
        case '10':
            return '问'
    }
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}