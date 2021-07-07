/* 
登录和注册直接切换
*/
$(function () {
  //显示去注册模块
  $('#link_reg').on('click', function () {
    $('.login-toggle-box').hide();
    $('.reg-toggle-box').show();
  })
  //显示去登录模块
  $('#link_login').on('click', function () {
    $('.login-toggle-box').show();
    $('.reg-toggle-box').hide();
  })
  //添加表单验证
  //引入layui 获取form对象
  let form = layui.form;
  //引入layer
  let layer = layui.layer;
  form.verify(
    {
      password: [/^[\S]{6,12}$/, '密码6-12位，且不能有空格'],
      //二次确认
      repwd: function (value, item) {
        if (value !== $('#regpwd').val()) return '密码不一致';
      }
    }
  )
  //监听注册表单事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    $.post('/api/reguser',
      {
        username: $('#form_reg [name=username').val(),
        password:$('#form_reg [name=password').val()
      }, function (res) {
        layer.msg(res.message)
        if (res.status === 0) {
          //模拟点击
          $('#link_login').click()
        }
    })
  })
  //监听登录表单事件
  $('#form_login').submit(function (e) {
    //阻止默认提交行为
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        //存储token localStorage
        localStorage.setItem('token', res.token);
        //跳转到后台主页 需要完整url
        location.href = 'http://127.0.0.1:5500/04bigevent/index.html'
      }
    }
    )
  })
})