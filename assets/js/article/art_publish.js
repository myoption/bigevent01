$(function () {
  //引入layer form
  let layer = layui.layer;
  let form = layui.form;
  //先查询分类
  getArtCate();
  //初始化富文本编辑器
  initEditor();
  function getArtCate() {
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
  }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
  
    // 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
  $image.cropper(options)
  //点击上传封面
  $('#choose-img').click(function () {
    $('#upload-img').click();
  });
  //监听文件change事件 上传文件之后 重新渲染裁剪区域
  $('#upload-img').on('change', function (e) {
    // console.log(e);
    let file = e.target.files[0];
    // console.log(!file);
    if (!file) return;
    //创建url地址
    let newImgUrl = URL.createObjectURL(file);
    //新建cropper区域
    $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
  });
  //发布状态
  let state = null;
  //点击发布按钮
  $('#publishbtn').click(function () {
    state = '已发布';
  })
  //点击草稿按钮
  $('#draftbtn').click(function () {
    state = '草稿';
  })
  //提交事件 需要FormData对象
  $('#form-publish').submit(function (e) {
    e.preventDefault();
    //基于表单创建FormData对象
    //$(this)[0] [0] 将jqery对象转为原生DOM对象
    let formData = new FormData($(this)[0]);
    //添加state
    formData.append('state', state);
/*     formData.forEach(function (v, k) {
      console.log(k+':'+v);
    }) */
    //将裁剪后的图片输出为文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        formData.append('cover_img', blob);
        //提交文章 
        pubArt(formData);
        //清空表单
        $('#form-publish')[0].reset();
        //重新获取分类
        getArtCate();
      });
    //ajax  单独提交会无响应
  })
  function pubArt(formdata) {
    $.ajax({
      method: 'post',
      url: '/my/article/add',
     data: formdata,
      //注意提交FormData数据需要额外2个参数
     contentType: false,
     processData: false,
      success: function (res) {
        console.log(res);
      }
    })
  }
})