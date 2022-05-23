$(function () {
    initArtCateList()
    let layer = layui.layer
    let form = layui.form
    // 获取文章分类的列表
    function initArtCateList() {
      $.ajax({
        method: 'GET',
        url: '/my/cate/list',
        success: function (res) {
          console.log(res);
          let htmlStr = template('tpl-table', res)
          $('tbody').html(htmlStr)
        }
      })
    }
    let num = 1
    // 这是一个选择器，用来后面关闭弹出层
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
      num = 1
      indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-edit').html()
      })
      // console.log($('#dialog-edit').html());
      if (num === 1) {
        $('body').on('submit', '#form-edit', function (e) {
          e.preventDefault()
          $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function (res) {
              console.log('发起了更新分类请求');
              if (res.code !== 0) {
                return layer.msg('新增分类失败！')
              }
              initArtCateList()
              layer.msg('新增分类成功！')
              layer.close(indexAdd)
              // 根据索引，关闭对应的弹出层
            }
          })
        })
      }
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
  
    // 为编辑类别按钮绑定点击事件、
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
      num = 2
      // 弹出一个修改文章分类信息的层
      indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html()
      })
  
      // 获取编辑按钮对应的id 
      let id = $(this).attr('data-id')
      console.log(id);
      // 发起 ajax 请求  渲染弹出框
      $.ajax({
        method: 'GET',
        url: '/my/cate/info',
        data:{
          id:id
        },
        success(res) {
          console.log('发起了修改分类请求');
  
          // console.log(res);
          form.val('form-edit', res.data)
        }
      })
  
      if (num === 2) {
        // 第一 用的是submit  第二  绑定到body身上  其他的没了
        $('body').on('submit', '#form-edit', function (e) {
          e.preventDefault()
          $.ajax({
            method: 'PUT',
            url: '/my/cate/info',
            data: $(this).serialize(),
            success: function (res) {
              if (res.code !== 0) {
                return layer.msg('更新分类失败！')
              }
              layer.msg('更新分类成功！')
              layer.close(indexEdit)
              initArtCateList()
              // 根据索引，关闭对应的弹出层
            }
          })
        })
      }
  
    })

    // 为删除类添加删除按钮  只要是事件委托 就往大了绑
    $('body').on('click', '.btn-delete', function (e) {
      let id = $(this).attr('data-id')
      // console.log(id);
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
          method: 'DELETE',
          url:'/my/cate/del?id='+id, //要求是查询字符串的形式，必须这么拼
          success(res) {
            if (res.code !== 0) {
              return layer.msg(res.message)
            }
            layer.msg(res.message)
            layer.close(index)
            initArtCateList()
          }
        })
      })
    })  
  })