
// 这个文件只是用来处理 基地址的
$.ajaxPrefilter(function(options){
    const baseUrl = 'http://www.liulongbin.top:3008'
    options.url = baseUrl + options.url
})