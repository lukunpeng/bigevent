$(function () {

    // 定义一个时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss

    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '' + n
    }
    // 去看看这个请求  需要什么东西
    // 定义数据 q
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态

    }


    // 做筛选功能  筛选功能的实质是 改变 initTable() 的data 数据  因为渲染的时候需要4个数据，正常cate_id和state 值是空的
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })


    // 发起ajax 请求获取数据  去渲染这个页面  定义一个渲染函数
    let form = layui.form
    let layer = layui.layer
    initTable()



    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('获取文章失败')
                }
                // 拿到数据，这时候应该调用form.val()方法去调用引擎渲染
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)

            }
        })
    }

    // 文章列表做好了   现在开始整筛选列表的内容
    // 首先把基础页面做出来  然后定义模板字符串进行渲染  下拉框的那个分类
    initCate()   // 这个函数 是用来渲染下拉框 分类选项的 
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                // 使用模板引擎渲染
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
                
            }
        })
    }



    let laypage = layui.laypage
    // 定义渲染分页的方法
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({

            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'refresh', 'skip'],
            // limits: [2, 3, 5, 10],
            limits: [5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 添加按钮  做个删除事件 
    // 1、需要一个弹出层  用layer.open() 搞出来
    // 2、因为删除按钮是动态生成的，所以用事件委托做
    $('body').on('click', '#btnDelete', function () {
        // 发起删除的ajax请求
        // 准备数据 id
        let len = $('#btnDelete').length
        let id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        initTable()
                    }
                }
            })
            layer.close(index);
        })
    })

    // 下一个写编写文章
    $('tbody').on('click', '#hongniu', function () {
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success(res) {
                localStorage.setItem('content', JSON.stringify(res.data))
                localStorage.setItem('flag', 'true')
                location.href = '/article/art_pub.html'
            }
        })
    })

    // 添加发表文章按钮
    $('#btnAddtitle').on('click',function(e){
        localStorage.removeItem('id')
        localStorage.removeItem('flag')
        location.href = '/article/art_pub.html'
    })

    // 添加编辑按钮  编辑按钮是动态生成的  所以需要事件委托
    $('body').on('click','#btnEdit',function(){
        let id = $(this).attr('data-id')
        localStorage.setItem('id',id)
        localStorage.setItem('flag','true')

        location.href = '/article/art_pub.html'

    })
})