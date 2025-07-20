/**
 * 登录表单处理模块
 * 监听登录表单提交事件，处理用户认证逻辑
 */
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // 阻止表单默认提交行为

  // 获取输入的用户名和密码，并去除首尾空格
  const account = document.getElementById('account').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    // 发送登录请求到后端API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // 设置请求头为JSON格式
      },
      body: JSON.stringify({ account, password }) // 将用户凭证转为JSON字符串
    });

    // 解析响应数据
    const data = await response.json();

    if (data.success) {
      // 登录成功：存储用户ID到本地存储
      localStorage.setItem('CURRENT_USER_ID', data.id);
      localStorage.setItem('CURRENT_USER_ROLE', data.role);
      // 1秒后跳转到课程列表页
      if (data.role === 'ADMIN') {
        setTimeout(() => {
          window.location.href = 'Users.html';
        }, 1000);
      }
      else {
        setTimeout(() => {
          window.location.href = '../All Job/All Job 1.html';
        }, 1000);
      }
    } else {
      // 登录失败：显示错误信息
      alert(`登录失败: ${data.message || '用户名或密码错误'}`);
    }
  } catch (error) {
    // 网络请求异常处理
    console.error('登录过程异常:', error);
    alert('登录失败，请重试！');
  }
});