function formatTime(date) {
  if(date==undefined){
    return;
  }
  if (date=='')
  {
    return;
  }
  date = date.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, "$1/$2/$3 $4");
  date=new Date(date);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) { 
    var str = []; 
    for(var p in json){ 
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p])); 
    } 
    return str.join("&"); 
} 

function compareTime(startTime,endTime){
  var retValue = {}
  var compareTime = endTime - startTime //时间差的毫秒数
  // 计算出相差天数
  var days = Math.floor(compareTime/(24*3600*1000))
  retValue.Days = days
  // 计算出相差年数
  var years = Math.floor(days/365)
  retValue.Years = years
  // 计算出相差月数
  var months = Math.floor(days / 30)
  retValue.Months = months
  // 计算出小时数
  var leaveHours = compareTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leaveHours / (3600 * 1000))
  retValue.Hours = hours
  // 计算相差分钟数
  var leaveMinutes = leaveHours % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leaveMinutes / (60 * 1000))
  retValue.Minutes = minutes
  // 计算相差秒数
  var leaveSeconds = leaveMinutes % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leaveSeconds / 1000)
  retValue.Seconds = seconds

  var resultSeconds = 0
  if (years >= 1) {
    resultSeconds = resultSeconds + years * 365 * 24 * 60 * 60
  }
  if (months >= 1) {
    resultSeconds = resultSeconds + months * 30 * 24 * 60 * 60
  }
  if (days >= 1) {
    resultSeconds = resultSeconds + days * 24 * 60 * 60
  }
  if (hours >= 1) {
    resultSeconds = resultSeconds + hours * 60 * 60
  }
  if (minutes >= 1) {
    resultSeconds = resultSeconds + minutes * 60
  }
  if (seconds >= 1) {
    resultSeconds = resultSeconds + seconds
  }
  retValue.resultSeconds = resultSeconds

  return retValue
}

module.exports = {
  formatTime: formatTime,
  json2Form : json2Form,
  compareTime: compareTime
}





