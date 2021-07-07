//入口函数
let layer = layui.layer;
$(function () {
  getUserInfo();
  //点出退出按钮
  $('#btnlogout').on('click', function () {
    // console.log('ok');
    layer.confirm('确定要退出吗?', {icon: 3, title:'提示'}, function(index){
      //do something 当点击确定时执行
      localStorage.removeItem('token');
      layer.close(index);
      location.href = 'http://127.0.0.1:5500/04bigevent/login.html'
    });
  })
})

//获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //获取信息需要token 优化统一设置headers
    // headers:{Authorization: localStorage.getItem('token')},
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败')
      }
      renderAvatar(res.data);
    },
    //无论失败还是成功都会调用 优化到baseAPI
    // complete: function (res) {
    //   console.log(res);
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     //清空token 并跳转到登录页

    //   }
    // }
  })
}

//渲染用户的头像
function renderAvatar(userInfo) {
  //获取用户名称
  let username = userInfo.nickname || userInfo.username;
  $('#welcome').html('欢迎&nbsp;&nbsp;' + username);
  $('#username').html(username);
  //根据是否上传头像 决定显示的头像是默认还是上传的
  if (userInfo.user_pic !== null) {
    $('.layui-nav-img').attr('src', userInfo.user_pic).show();
    $('.text_avatar').hide();
  } else {
    $('.layui-nav-img').hide();
    $('.text_avatar').html(username[0].toUpperCase()).show();
  }
}