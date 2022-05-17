$(function () {
    $('#link_login').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    $('#link_reg').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义校验规则
    let form = layui.form
    form.verify({
        // 密码校验  S是非空格
        pwd: [/^[\S]{6,16}$/, '密码必须是6-16位之间，且不能出现空格'],
        // 确认密码框
        repwd: function (value) {
            // 这里有个属性选择器，中括号代表 属性选择  牢记！！
            const pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 发起ajax请求
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        const data = {
            username:$('#form-reg [name=username]').val(),
            password:$('#form-reg [name=password]').val(),
            repassword:$('#form-reg [name=repassword]').val()
        }
        $.ajax({
            method:"POST",
            // url:'http://www.liulongbin.top:3007/api/reguser',
            url:'http://www.liulongbin.top:3008/api/reg',
            // url:'http://www.liulongbin.top:3008/my/cate/list',
            data,
            success(res){
                if(res.code !== 0){
                    console.log(res.message);
                }
                
                console.log(res.message)
            }
        })
    })
})