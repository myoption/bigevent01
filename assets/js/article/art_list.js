$(function () {
  //定义查询参数对象 每次查询带上该参数
  let queryParams = {
    pagenum: 1, //页码值 默认请求第一页数据
    pagesize: 3,//每页多少条 默认3条
    cate_id:'',
    state:'',
  };
  //定义时间格式化过滤器
  template.defaults.imports.dateFormat = function (date) {
    let dt = new Date(date);
    let y = dt.getFullYear();
    let m = zeroPad(dt.getMonth() + 1);
    let d = zeroPad(dt.getDate());
    let hh = zeroPad(dt.getHours());
    let mm = zeroPad(dt.getMinutes());
    let ss = zeroPad(dt.getSeconds());
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
  //定义补0函数
  function zeroPad(n) {
    return n > 9 ? n : '0' + n;
  }
  let layer = layui.layer;
  let form = layui.form;
  getArticleList();
  //获取文章列表数据
  let all = null;
  function getArticleList(flag = false) {
    //当删除之后调用 需要重新设置pagenum 再查询 
    if (flag && all) {
      let pageNum = Math.floor((all - 1) / queryParams.pagesize);
      //且页面最小为1
      pageNum = pageNum > 0 ? pageNum : 1;
      queryParams.pagenum = pageNum;
    }
    $.ajax({
      method: 'get',
      url: '/my/article/list',
      data: queryParams,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg('获取分类失败')
        //通过模板引擎渲染数据
        let html = template('tpl-article', res);
        $('tbody').html(html);
        // console.log(res.message);
        //调用分页
        // console.log(queryParams);
        all = res.total;
        renderPage(res.total);
      }
    })
  }
  getArticleCate();
  //获取文章分类信息
  function getArticleCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      success: function (res) {
        // console.log(res.data);
        if (res.status === 0) {
          let html = template('tpl-cate', res);
          $('[name=cate_id]').html(html);
          //重新渲染表单
          form.render();
        } else {
          layer.msg('获取分类失败')
        }
      }
    })
  }
  //监听查询表单提交事件
  $('#query-form').submit(function (e) {
    e.preventDefault();
/*  拿不到值 
    let formdata = form.val('query');
    console.log(formdata); */
    queryParams.cate_id = $('[name=cate_id').val();
    // console.log(queryParams.cate_id);
    queryParams.state = $('[name=state').val();
    // console.log(queryParams.state);
    //重新渲染表格
    getArticleList();
  });
  //分页
  function renderPage(total) {
    layui.use('laypage', function(){
      var laypage = layui.laypage;
      //执行一个laypage实例 调用laypage.render 也会触发jump
      laypage.render({
        elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
        , count: total//数据总数，从服务端得到
        ,curr: queryParams.pagenum
        ,limit: queryParams.pagesize
        , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
        , limits: [1, 3, 5, 10]
        //当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
        , jump: function (obj, first) {
          //obj包含了当前分页的所有参数
          // console.log(obj);
          //不是首次的话 表示更改了页码相关设置 再次查询
          if (!first) {
            console.log('jump');
            queryParams.pagenum = obj.curr;
            queryParams.pagesize = obj.limit;
            //再次查询
            getArticleList();
          }
        }
      });
    });
  }
  //删除
  //绑定点击事件
  $('body').on('click', '.btn-del', function () {
    // console.log('del');
    //根据属性获取id
    let id = $(this).attr('data-id');
    //弹出确认框
    layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
      //do something
      //根据id删除文章s
      $.ajax({
        method: 'get',
        url: '/my/article/delete/' + id,
        success: function (res) {
          // console.log(res);
          if (res.status !== 0) return layer.msg('删除失败');
          //设置变量 用于控制是否删除后刷新列表
          let flag = true;
          //刷新列表
          getArticleList(flag);
          return layer.msg('删除成功');
        }
      })
      layer.close(index);
    });
  })
  //编辑 绑定点击事件
  //存放当前编辑的数据
  let article = {};
  //存放当前open的index
  let editArtIndex = null;
  $('body').on('click', '.btn-edit', function () {
    //创建弹窗
    editArtIndex = layer.open({
      type: 1,
      title: '编辑文章',
      area: ['800px', '600px'],
      content: $('#tpl-edit').html(), //这里content是一个普通的String
    });
    //初始化富文本编辑器
    initEditor();
    //获取文章分类
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg('获取文章分类失败');
        //渲染模板
        let html = template('tpl-artCate', res);
        //插入模板字符串
        $('[name=cate_id]').html(html);
        //需要重新渲染表单 form.render() 否则数据不可见
        form.render();
      }
    });
    //根据id请求数据
    let id = $(this).attr('data-id');
    //请求当前编辑文章的数据
    $.ajax({
      method: 'get',
      url: '/my/article/' + id,
      success: function (res) {
        // console.log(res.data);
        if (res.status !== 0) return;
        article = res.data;
        console.log(article);
        // let formdata = new FormData($('#form-publish')[0]);
        // form.val('editArtForm', res.data);
        // formdata.append('cate_id',article.cate_id)
        $('[name=title]').val(article.title);
        $('[name=cate_id]').val(article.cate_id);
        $('[name=content]').val(article.content);
        $('#image').attr('src','http://api-breakingnews-web.itheima.net/my/article/'+article.cover_img)
        form.render();
      }
    })
    // let html = template('tpl-edit',)
  })
})

