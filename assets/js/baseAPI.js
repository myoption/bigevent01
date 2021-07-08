/* 
每次调用ajax请求前调用的函数 用来拼接url
*/
$.ajaxPrefilter(
  function (options) {
    // console.log(options.url);
    // console.log(options.url);
    let isAuthor = options.url.split('/');
    //或者用startsWith 判断开头
    if (isAuthor[1] === 'my') {
      options.headers = {
        Authorization: localStorage.getItem('token')
      }
    }
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
   //全局挂载拦截函数 有问题 会先出现访问的页面再跳转到登录页
    options.complete = function (res) {
      // console.log(res);
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //清空token 并跳转到登录页
        localStorage.removeItem('token');
        location.href = 'http://127.0.0.1:5500/04bigevent/login.html';
      }
    }
  }
)