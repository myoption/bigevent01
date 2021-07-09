let layer = layui.layer;
let form = layui.form;

$(function () {
  getArticleCate();
  let indexAdd = null;
  $('#addcate').on('click', function () {
    //保存index 用于关闭弹窗
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      fixed: true,
      title: '添加文章分类',
      //通过script标签 编写html 并赋值给content
      content: $('#dialog-add').html(),
    });
  });
  //无法直接绑定添加分类的submit事件，因为js生成的，绑定的时候页面还没有该DOM
  //通过代理进行绑定
  $('body').on('submit', '#add-form', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/addcates',
      method: 'post',
      data: $('#add-form').serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg('新增失败');
        //刷新列表
        getArticleCate();
        //关闭弹窗
        layer.close(indexAdd);
        return layer.msg(res.message);
      }
    })
  });
  //代理绑定编辑按钮
  let indexEdit = null;
  //存放获取的分类信息
  let cate = null;
  $('tbody').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      fixed: true,
      title: '编辑文章分类',
      //通过script标签 编写html 并赋值给content
      content: $('#dialog-edit').html(),
    });
    //根据id获取分类数据
    let id = $(this).attr('data-id')
    $.ajax({
      url: `/my/article/cates/${id}`,
      method: 'get',
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        cate = res.data;
        form.val('editForm', res.data);
      }
    })
  });
  //绑定编辑表单提交事件 代理绑定
  $('body').on('submit', '#edit-form', function (e) {
    e.preventDefault();
    let editCate = form.val('editForm');
    //当未修改时，直接关闭弹窗
    if (cate.name === editCate.name && cate.alias === editCate.alias) {
      layer.close(indexEdit);
      return;
    }
    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: form.val('editForm'),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg('更新失败');
        layer.close(indexEdit);
        //刷新列表
        getArticleCate();
        return layer.msg(res.message);
      }
    })
  });
  //绑定删除按钮 点击事件 代理绑定
  $('tbody').on('click', '.btn-del', function () {
    // console.log('del');
    //获取id
    let id = $(this).attr('data-id');
    layer.confirm('是否要删除该分类', {icon: 3, title:'提示'}, function(index){
      //do something 点击确定之后执行的代码
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          // console.log(res);
          if (res.status !== 0) return layer.msg('删除失败');
          //刷新列表
          getArticleCate();
          return layer.msg(res.message);
        }
      })
      layer.close(index);
    });
  })
})

//获取文章分类信息
function getArticleCate() {
  $.ajax({
    url: '/my/article/cates',
    method: 'get',
    success: function (res) {
      // console.log(res.data);
      if (res.status === 0) {
        let html = template('tpl', res);
        $('tbody').html(html);
      } else {
        layer.msg('获取分类失败')
      }
    }
  })
}