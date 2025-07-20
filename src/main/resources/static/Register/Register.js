/**
 * 注册表单处理模块
 * 处理新用户注册逻辑
 */
document.getElementById('Register-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // 阻止表单默认提交

  // 获取输入的用户名和密码
  const account = document.getElementById('account').value.trim();
  const password = document.getElementById('password').value.trim();

  // 获取选中的用户身份
  const role = document.querySelector('input[name="role"]:checked').id;

  // 基础验证：用户名、密码和身份不能为空
  if (!account || !password) {
    alert('用户名和密码不能为空！');
    return;
  }

  if (!role) {
    alert('请选择用户身份！');
    return;
  }

  try {
    // 发送注册请求到后端，包含用户身份
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account,
        password,
        role
      })
    });

    const data = await response.json();

    // 处理不同响应状态
    if (response.status === 409) {
      alert('注册失败：用户名已存在');
    } else if (data.success) {
      // 注册成功跳转到登录页
      alert('注册成功，请登录');
      window.location.href = '../Login/Login.html';
    } else {
      alert(`注册失败：${data.message || '服务器错误'}`);
    }
  } catch (error) {
    console.error('注册过程异常:', error);
    alert('注册失败，请重试！');
  }
});