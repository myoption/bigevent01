$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify(
    {
      pass: [
        /^[\S]{6,12}$/
        , '密码必须6到12位，且不能出现空格'
      ],
      //不能与原密码一致
      samePwd: function (value, item) {
        if ( value === $('#originpwd').val()) return '与原密码一致'
      },
      //2次新密码需要一致
      repwd: function (value, item) {
        if (value !== $('#repwd').val()) return '密码不一致'
      }
    }
  );
  //调用函数 进行提交
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    snedPwd();
  })

})
//提交密码
function snedPwd() {
  $.ajax({
    url: '/my/updatepwd',
    method: 'post',
    data: {oldPwd:$('#originpwd').val(),newPwd:$('#repwd').val()},
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('更新密码失败')
      }
      //点击reset
      $('.layui-btn-primary').click();
      //重置表单的另一种方法
      // $('.layui-form')[0].reset();
      return layer.msg(res.message);
    }
  })
}