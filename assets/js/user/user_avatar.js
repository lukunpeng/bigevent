// 1.1 获取裁剪区域的 DOM 元素
let $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

let layer = layui.layer

$('#btnChooseImage').on('click', function () {
    $('#file').click()
})

// input 绑定的是 change 事件 
$('#file').on('change',function(e){
    let file = e.target.files[0]
    let imageURL = URL.createObjectURL(file)
    $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', imageURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
})

// 发起ajax 请求 换头
$('#btnUpAvatar').on('click',function(){
    // 首先准备好 图片数据
    var dataURL = $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png')

    // 然后发起ajax请求
    $.ajax({
        method:'PATCH',
        url:'/my/update/avatar',
        data:{avatar:dataURL},
        success(res){
            if(res.code!==0){
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            window.parent.getUserInfo()
        }
    })
})
