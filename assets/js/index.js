$(function () {

    getUserInfo()


    // 这个点击事件是用来退出的，调用了confirm 方法
    // 需要做三步步：1、删除token  2、跳转到登录页面  3、关闭弹窗
    $('#btnLogout').on('click', function () {
        layer.confirm('确认要退出吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })


})


function renderAvatar(user) {
    // 1. 获取用户的名称
    let name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}


// 报错401  说明数据参数错了
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 这一个不需要参数，但是得配置请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
        // complete(res) {
        //     console.log(res);
        //     if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = './login.html'
        //     }
        // }
    })
}