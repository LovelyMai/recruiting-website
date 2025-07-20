document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('change-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 获取表单元素
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('checked-new-password').value;



        // 禁用按钮防止重复提交
        const submitBtn = form.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'submitting';

        try {
            // 发送请求到后端
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    confirmNewPassword
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Password change failed');
            }

            // 成功处理
            alert('密码更改成功! 即将跳转至登录页面...');

            // 清除本地存储并跳转
            localStorage.removeItem('token');
            localStorage.removeItem('CURRENT_USER_ID');
            localStorage.removeItem('CURRENT_USER_ROLE');
            window.location.href = '../Login/Login.html';

        } catch (error) {
            alert(`错误：${error.message}`);
        } finally {
            // 重置按钮状态
            submitBtn.disabled = false;
            submitBtn.textContent = 'Change Password';
        }
    });
});