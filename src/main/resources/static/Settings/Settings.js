const CURRENT_USER_ID = localStorage.getItem('CURRENT_USER_ID');

// DOM elements
const changeButton = document.querySelector('.change-btn');
const logoutButton = document.querySelector('.logout-btn');
const deleteAccountLink = document.getElementById('deleteAccountLink');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if (!CURRENT_USER_ID) {
        alert('请先登录');
        window.location.href = '../Login/Login.html';
        return;
    }
    logoutButton.addEventListener('click', handleLogout);
    if (deleteAccountLink) {
        deleteAccountLink.addEventListener('click', handleDeleteAccount);
    }
});


// 退出登录处理（仅清除会话）
async function handleLogout() {
    if (!confirm('确定要退出登录吗？')) return;

    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        clearSessionData();
        window.location.href = '../Login/Login.html';
    } catch (error) {
        console.error('退出登录失败:', error);
        alert('退出登录失败. 请稍后再试.');
    }
}


// 清除会话数据（退出登录）
function clearSessionData() {
    localStorage.removeItem('CURRENT_USER_ID');
    localStorage.removeItem('CURRENT_USER_ROLE');
    localStorage.removeItem('token');
    sessionStorage.clear();
    console.log('[Session] Cleared session data');
}

// 注销账户处理
async function handleDeleteAccount(event) {
    event.preventDefault();
    if (!confirm('注销账户将永久删除你的所有数据，且无法恢复。确定要继续吗？')) return;
    try {
        const response = await fetch(`/api/users/${CURRENT_USER_ID}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 204) {
            clearSessionData();
            alert('账户已注销，欢迎再次使用！');
            window.location.href = '../Login/Login.html';
        } else {
            const data = await response.json();
            alert(data.message || '注销失败，请稍后再试。');
        }
    } catch (error) {
        console.error('注销账户失败:', error);
        alert('注销账户失败，请稍后再试。');
    }
}