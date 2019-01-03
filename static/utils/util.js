const isInArray = (arr, value) => {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}
const removeItem = (arr, value) => {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
/**日期格式化 */
const fmtDate = (obj) => {
  obj = obj.replace(/-/g, "/")
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  var time = y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length)
  return time;
}
//获取当前时间，格式YYYY-MM-DD
const getNowFormatDate = () => {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
/**当前日期 */
const getToday = () => {
  var date = new Date();
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  var time = y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length)
  return time;
}
/**手机号码校验 */
const isTel = (obj) => {
  var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(obj)) {
    return false;
  } else {
    return true;
  }
}
/**手机号码格式化 */
const formatTel = (tel) => {
  tel=tel+'';
  var myphone = tel.substr(3, 4);
  return tel.replace(myphone, "****");
}
/** 1. 设置title，解决微信改不了title的bug */
const setTitle = (title) => {
  setTimeout(function () {
    document.title = title;
    var iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 0);
    };
    document.body.appendChild(iframe);
  }, 0);
}


/**
 * 将 Object 转成 GET 请求中的参数字符串
 * @param params
 * @returns {string}
 */

function parseURLParams (params) {
  let str = '';
  for (let key in params) {
      if (params.hasOwnProperty(key)) {
          str += '&' + key + '=' + encodeURIComponent(params[key]);
      }
  }
  return str.replace(/&/, '?');
}

/**
* 将参数字符串转成对象形式
* @param query
* @returns {Object}
*/
function parseQuery (query) {
  let result = {};
  if (!query || query.indexOf('=') < 0) {
      return result;
  }
  if (query.indexOf('?') > -1) {
      query = query.split('?')[1];
  }
  let params;
  query = decodeURIComponent(query);
  params = query.split('&');
  for (let i = 0, len = params.length; i < len; i++) {
      params[i] = params[i].split('=');
      if (params[i][0] !== '' && params[i][1] !== '') {
          result[params[i][0]] = params[i][1];
      }
  }
  return result;
}

export default {
  isInArray,
  removeItem,
  fmtDate,
  isTel,
  setTitle,
  getToday,
  formatTel,
  getNowFormatDate,
  parseURLParams,
  parseQuery
}