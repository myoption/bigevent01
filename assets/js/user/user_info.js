let form = layui.form;
let layer = layui.layer;
$(function () {
  form.verify({
    nickname: [/^[\S]{1,6}$/
      , '昵称必须1到6位，且不能出现空格']
  });
  getUserInfo();
  //监听表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    sendUserInfo(form.val('modify-userinfo'));
    //提交之后从新获取数据
    getUserInfo();
    //在iframe中调用渲染头像的方法
    window.parent.getUserInfo();
  })
  //监听重置按钮
  $('#reset').on('click', function (e) {
    e.preventDefault();
    //重新充填表单即可
    getUserInfo();
  })
})
//获取用户信息并充填到表单
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败')
      }
      //快速充填表单值
      form.val('modify-userinfo', res.data);
    }
  });
}
//发送修改后的数据
function sendUserInfo(user) {
  $.ajax({
    url: '/my/userinfo',
    method: 'post',
    data: user,
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('更新用户信息失败')
      }
      return layer.msg(res.message);
    }
  })
}