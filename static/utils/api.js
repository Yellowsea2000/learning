import {
  server
} from "server"; //引用网络组件
import util from './util';

const app = getApp();
let server_url = app.config.server_url;
let attendance_url = app.config.attendance_url;
let wx_service_url = app.config.wx_service_url;
let ocr_url = app.config.ocr_url;
let base_url = app.config.base_url;
/********************公用接口****************************/
//获取入职状态
export function getEntryInfo(userId) {
  return server({
    url: `${server_url}/userEntryInfo/getEntryInfo/${app.globalData.userId}`,
    method: 'get' //请求方法
  })
}
//获取入职时间和状态
export function updateEntryStatusAndDate() {
  return server({
    url: `${server_url}/userExtraInfo/updateEntryStatusAndDate/${app.globalData.userId}`,
    method: 'post' //请求方法
  })
}
/********************首页页面接口************************/
//定位
export function getLocation(lat, lng) {
  return server({
    url: `${server_url}/jobInfo/getLocation?lng=${lng}&lat=${lat}`,
    method: 'get'
  })
}
//获取职位列表
export function getJobList(params) {
  return server({
    url: `${server_url}/jobInfo/listByHunter`,
    method: 'post', //请求方法
    data: params
  })
}
/*职位详情页面*/
//获取职位详情
export function getJobDetail(jobId) {
  return server({
    url: `${server_url}/jobInfo/getDetails/${jobId}`,
    method: 'get' //请求方法
  })
}
//投递职位
export function senLikeJob(data) {
  return server({
    url: `${server_url}/userJobRecord/submit/`,
    method: 'post', //请求方法
    data: data
  })
}
/*城市选择页面*/
//获取热门城市
export function getHotCityList() {
  return server({
    url: `${server_url}/jobInfo/getHotCityName`,
    method: 'get'
  })
}
/********************考勤页面接口************************/
//获取考勤总览信息
export function getAttendanceTotal(date) {
  return server({
    url: `${attendance_url}/rst/user_work_record/wx/query_work?userCode=${app.globalData.userId}&date=${date}`,
    method: 'get'
  })
}
//考勤关闭日
export function attendanceDown() {
  return server({
    url: `${attendance_url}/rst/user_work_record/wx/get_user_company_monthcut_day?userCode=${app.globalData.userId}`,
    method: 'get'
  })
}
/*考勤详情页面*/
//考勤详情
export function getAttendanceDetail(date) {
  return server({
    url: `${attendance_url}/rst/user_work_record/wx/get_by_date?userCode=${app.globalData.userId}&recordDate=${date}`,
    method: 'get'
  })
}
//考勤提交
export function attendanceSubmit(data) {
  return server({
    url: `${attendance_url}/rst/user_work_record/wx/save_or_update`,
    method: 'post',
    data
  })
}
/************************投递记录接口****************************/
//根据门店管理员获取用户的求职记录，P1.待面试 P2.初面通过 P3.复试通过 P4.未通过
1
2
3
export function getjobRecords(page, statu) {
  return server({
    url: `${server_url}/userJobRecord/listByStoreManagerId/${app.globalData.userId}?status=${statu}&pageNo=${page}&pageSize=10`,
    method: 'post' //请求方法
  })
}
/****************************我的页面接口************************/
//初始化我的页面
export function initMinePage() {
  return server({
    url: `${server_url}/user/miniProgramMine/${app.globalData.userId}`,
    method: 'get' //请求方法
  })
}
//获取职位申请人数
export function getPeople() {
  return server({
    url: `${server_url}/user/miniProgramMine/${app.globalData.userId}`,
    method: 'get' //请求方法
  })
}
/*个人信息完善页面*/
//用户完善个人信息点击保存
export function submitPersonInfo(data) {
  return server({
    url: `${server_url}/userJobRecord/submitJobInfo/`,
    method: 'post',  //请求方法,
    data
  })
}
//获取手机验证码
export function getIdentifyCode(data) {
  return server({
    url: `${base_url}/checkCodeInfo/generateAndSendCheckCode`,
    method: 'post', //请求方法
    data
  })
}
//校验手机验证码
export function checkIdentifyCode(data) {
  return server({
    url: `${base_url}/checkCodeInfo/check`,
    method: 'post', //请求方法
    data
  })
}
/*我要离职*/
export function postResign(quitDate) {
  return server({
    url: `${attendance_url}/rst/user/wx/quit_user?userCode=${app.globalData.userId}&quitDate=${quitDate}`,
    method: 'get' //请求方法
  })
}
//获取门店二维码
export function getStoreQrCode(storeId) {
  return `${wx_service_url}/wxMiniProgram/wxbCodeUnlimit?param=${storeId}&page=pages/mine/code_into_shop/code_into_shop&rstWxAppId=${app.globalData.rstWxAppId}`
}
/*OCR流程页面*/
//身份证接口
export function idcardUpload(type, userId) {
  return `${ocr_url}/idCard/${type}?userId=${userId}`
}
//人脸识别
export function faceUpload(sourceFileUrl, name, idno, userId) {
  return `${ocr_url}/faceCompare/?sourceFileUrl=${sourceFileUrl}&name=${encodeURI(name)}&idno=${idno}&userId=${userId}`
}
//银行卡识别
export function bankUpload(userId) {
  return `${ocr_url}/bankCard/?userId=${userId}`
}

//判断是否进行OCR流程
export function getIsOcrRule(userId) {
  return server({
    url: `${server_url}/userEntryInfo/getEntryCompanyAttribute/${userId}`,
    method: 'get' //请求方法
  })
}
//获取入职用户信息（OCR）
export function getUserExtraInfo(userId) {
  return server({
    url: `${server_url}/userExtraInfo/queryUserEntryInfo/${app.globalData.userId}`,
    method: 'get' //请求方法
  })
}
//下一步保存用户信息(OCR)
export function nextUserExtraInfo(data) {
  return server({
    url: `${server_url}/userExtraInfo/saveUserStepInfo`,
    method: 'post', //请求方法
    data: data
  })
}
//提交用户信息(OCR)
export function submitUserExtraInfo(data) {
  return server({
    url: `${server_url}/userExtraInfo/saveUserExtraInfo`,
    method: 'post', //请求方法
    data: data
  })
}
/*合同签署页面*/
//获取合同模板
export function getContractTemplate() {
  return server({
    url: `${server_url}/contractTemplate/genContractTemplate?userId=${app.globalData.userId}`,
    method: 'post'
  })
}
//合同签署页面挑战码
export function getIdentifyingCode(phone) {
  return server({
    url: `${server_url}/contractTemplate/getIdentifyingCode?userId=${app.globalData.userId}&phone=${phone}`,
    method: 'post'
  })
}
//发送验证码(签订合同)
export function signSendPhoneMsg(data) {
  return server({
    url: `${base_url}/phoneSmsSend/sendPhoneSms`,
    method: 'post', //请求方法
    data
  })
}
//校验挑战码并获取签章合同
export function checkSignAndSeal(challengeCode) {
  return server({
    url: `${server_url}/contractTemplate/signAndSeal?userId=${app.globalData.userId}&challengeCode=${challengeCode}`,
    method: 'post'
  })
}
//合同签署成功预览
export function viewSignedContract() {
  return server({
    url: `${server_url}/contractTemplate/viewSignedContract?userId=${app.globalData.userId}`,
    method: 'get'
  })
}
//用户绑定门店信息
export function storeUserRelationship(params) {
  return server({
    url: `${server_url}/storeUserRelationship/save `,
    method: 'post',
    data: params
  })
}
//更新面试状态，p4初面，P7复试
export function upUserJobState(id, statu, notEntryReason) {
  return server({
    url: `${server_url}/userJobRecord/status/${id}?status=${statu}&notEntryReason=${notEntryReason}`,
    method: 'put', //请求方法
    params: {}
  })
}
//选择驻场管理员
export function selectAdministrator(data) {
  return server({
    url: `${server_url}/userJobRecord/updateCompanyAdminId`,
    method: 'post', //请求方法
    data: data
  })
}
//公司
export function getCompanys(id) {
  return server({
    url: `${server_url}/companyStoreRelationship/getCompanyInfoByStoreId?storeId=${id}`,
    method: 'post' //请求方法
  })
}
//驻厂管理员
export function getAdministrators(id) {
  return server({
    url: `${server_url}/companyAdminRelationship/getCompanyAdminRelationshipByCompanyId?companyId=${id}`,
    method: 'post' //请求方法
  })
}
//通过门店id获取门店信息
export function getStoreInfo(storeId) {
  return server({
    url: `${server_url}/storeWithManager/listInfoByStoreId/${storeId}`,
    method: 'get' //请求方法
  })
}
//添加个人信息
export function addUserInfo(data) {
  return server({
    url: `${server_url}/user/updateUserInfo/${app.globalData.userId}`,
    method: 'put', //请求方法
    data: data
  })
}
//根据驻场管理员获取用户的求职记录，P5.已入职 P6.未入职
export function getAdmJobRecords(page, statu) {
  return server({
    url: `${server_url}/userJobRecord/listByCompanyAdminId/${app.globalData.userId}?status=${statu}&pageNo=${page}&pageSize=10`,
    method: 'post' //请求方法
  })
}

//获取个人申请记录
export function getJobHistoryMine(page) {
  return server({
    url: `${server_url}/userJobRecord/listByUserId/${app.globalData.userId}?pageNo=${page}&pageSize=10`,
    method: 'post'
  })
}

//获取storeId
export function getStoreId() {
  return server({
    url: `${server_url}/storeWithManager/listStoreByManager/${app.globalData.userId}`,
    method: 'get'
  })
}

//获取本系统当配置有门店的城市列表
export function getCityStoreList(params={}) {
  
  return server({
    url: `${server_url}/storeCity/getStoreCityList${util.parseURLParams(params)}`,
    method: 'get' //请求方法
  })
}

//人工信息审核信息获取
export function manualInfoReview(userId) {
  return server({
    url: `${server_url}/userExtraInfo/queryUserEntryInfo/${userId}`,
    method: 'get' //请求方法
  })
}
//人工信息审核是否通过
export function manualInfoPass(data) {
  return server({
    url: `${server_url}/userEntryInfo/changeEntryStatus`,
    method: 'post',
    data
  })
}
//驻场管理员查看列表信息
export function getReviewList(page, EntryStatus) {
  return server({
    url: `${server_url}/userEntryInfo/getEntryStatusUser/${app.globalData.userId}/10/${page}?EntryStatus=${EntryStatus}`,
    method: 'get' //请求方法
  })
}
//驻场管理员判定通过与否
export function judgePass(data) {
  return server({
    url: `${server_url}/userEntryInfo/changeEntryStatus`,
    method: 'post', //请求方法
    data
  })
}
//门店管理员查看入职人员管理
export function getEmployeeListByMgr(page, EntryStatus) {
  return server({
    url: `${server_url}/userEntryInfo/getEntryUserByStoreManger/${app.globalData.userId}/10/${page}?EntryStatus=${EntryStatus}`,
    method: 'get' //请求方法
  })

}


//用户获取合同信息
export function  getContractInfo(code) {
  return server({
    url:`${server_url}/sysDictionary/getSysDictionaryByCode/?code=${code}`,
    method:'get'
  })
}

//获取模板信息
export function getContractTemplateByFactory () {
  return server({
    url:`${server_url}/contractTemplate/getContractTemplateByUserId?userId=${app.globalData.userId}`,
    method:'post'
  })

}

//发送合同
export function sendContract(data) {
  return server({
    url:`${server_url}/userContractInfo/sendContractInfo`,
    method:'post',
    data
  })
}

//获取工作类型
export function getJobType () {
  return server({
    url:`${attendance_url}/rst/job_category/m/list?tenantCode=6000`,
    method:'get'
  })
}