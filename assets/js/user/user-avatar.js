  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
$image.cropper(options)
  
$('#filebtn').on('click', function (e) {
  $('#file').click();
})

$('#file').on('change', function (e) {
  let file = e.target.files[0];
  //监听是否选中文件
  if (file.length === 0) return;
  //创建图片路径
  let newImgurl = URL.createObjectURL(file);
  //创建裁剪图片
  $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgurl)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})
let layer = layui.layer;
//点击确定上传头像
$('.layui-btn-danger').on('click', function () {
  //将裁剪区域图片输出为base64字符串
  let avatar = $image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 100,
    height: 100
  })
  .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
  $.ajax({
    url: '/my/update/avatar',
    method: 'post',
    data: {avatar:avatar},
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layer.msg('更新失败')
      }
      //同步更新主页显示头像
      window.parent.getUserInfo();
      return layer.msg(res.message)
    }
  })
})