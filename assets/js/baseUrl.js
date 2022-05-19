
// 这个文件只是用来处理 基地址的
$.ajaxPrefilter(function (options) {
    const baseUrl = 'http://www.liulongbin.top:3008'
    options.url = baseUrl + options.url
    // 给url里面带 /my/ 字符串的加一个headers属性
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局挂载检查是否有 token令牌  的指令
    options.complete = function (res) {
        console.log(res)
        if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = './login.html'
        }
    }
})