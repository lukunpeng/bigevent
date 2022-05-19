$(function(){
    let form = layui.form
    // 正则校验，两种写法
    form.verify({
        // 第一种写法
    //   nickname: function(value) {
    //     if (value.length > 6) {
    //       return '昵称长度必须在 1 ~ 6 个字符之间！'
    //     }
    //   },
    // 第二种写法
    nickname:[/^[\S]{1,8}$/,'昵称长度必须在 1 ~ 8 个字符之间！']
    })

    initUserInfo()
    // 初始化用户的基本信息  渲染页面
    function initUserInfo() {
      $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
          if (res.code !== 0) {
            return layer.msg('获取用户信息失败！')
          }
        //   console.log(res)
        // 关键点，这个地方用获取到的数据进行渲染页面
        // 渲染方式：给form 添加 lay-filter="formUserInfo" 属性
        // 然后通过内置方法 form.val()  进行渲染，对应的name要匹配
          form.val('formUserInfo', res.data)
        }
      })
    }
    
    // 重置按钮的调用  重置表单  然后重新渲染
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserInfo()
    })

    // form表单提交的时候 发起 ajax 更新数据的请求，获得数据后，调用渲染函数，进行页面渲染
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'PUT',
            url:'/my/userinfo',
            // 获取表单数据
            data:$(this).serialize(),
            success(res){
                if(res.code !==0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initUserInfo()
                window.parent.getUserInfo()

            }
        })
    })
})