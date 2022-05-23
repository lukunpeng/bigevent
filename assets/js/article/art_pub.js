$(function () {
    let layer = layui.layer
    let form = layui.form

    let id = localStorage.getItem('id')
    let flag = localStorage.getItem('flag')


    // 定义一个渲染函数
    function initTitle(id) {
        if (flag) {
            // 发起 ajax 请求
            $.ajax({
                method: 'GET',
                url: '/my/article/info?id=' + id,
                success(res) {
                    if (res.code !== 0) {
                        return layer.msg('获取失败')
                    }
                    let imgURL = 'http://www.liulongbin.top:3008' + res.data.cover_img
                    $('#image').attr('src', imgURL)

                    form.val('form-pub', res.data)

                    // 1. 初始化图片裁剪器
                    let $image = $('#image')
                    // 2. 裁剪选项
                    let options = {
                        aspectRatio: 400 / 280,
                        preview: '.img-preview'
                    }
                    // 3. 初始化裁剪区域
                    $image.cropper(options)
                        // 根据文件，创建对应的 URL 地址
                        let newImgURL = imgURL
                        // 为裁剪区域重新设置图片
                        // newImgURL = localStorage.getItem('url')
                        $image
                            .cropper('destroy') // 销毁旧的裁剪区域
                            .attr('src', newImgURL) // 重新设置图片路径
                            .cropper(options) // 重新初始化裁剪区域
                }
            })
        }
    }

    initTitle(id)

    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()
    // localStorage.getItem('imgURL')
    // $('#image').attr('src', localStorage.getItem('imgURL'))

    // 1. 初始化图片裁剪器
    let $image = $('#image')  // 选取左边的图片

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280, //宽高比例
        preview: '.img-preview'  // 图片在右侧展示
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)  // 实现展示功能

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        let newImgURL = URL.createObjectURL(files[0]) // 这里面塞一个图片 可以自动创建成 64格式
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        if (flag) {

            $.ajax({
                method: 'PUT',
                url: '/my/article/info',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('更新文章失败！')
                    }
                    layer.msg('更新文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })

        } else {



            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })

        }
    }

})

