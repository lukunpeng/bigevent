$(function () {
    let form = layui.form
    // 正则校验
    form.verify({
        oldpwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        sampwd: function (value) {
            if (value === $('[name=old_pwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        repwd: function (value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 发起ajax 换密码请求
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    console.log(res.message);
                }
                console.log(res.message);
                $('.layui-form')[0].reset()
                localStorage.removeItem('token')
                window.parent.getUserInfo()
            }
        })
    })
})