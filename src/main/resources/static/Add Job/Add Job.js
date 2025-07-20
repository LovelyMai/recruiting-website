// ==================== 全局配置 ====================
const CURRENT_USER_ID = localStorage.getItem('CURRENT_USER_ID');

// ==================== 初始化校验 ====================
if (!CURRENT_USER_ID) {
  alert('请先登录！');
  window.location.href = '../Login/Login.html';
}

// ==================== 表单提交处理 ====================
document.getElementById('add-job-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  // 获取所有字段
  const title = document.getElementById('title').value.trim();
  const address = document.getElementById('address').value.trim();
  const description = document.getElementById('description').value.trim();
  const jobType = document.querySelector('input[name="jobType"]:checked')?.value;
  const eduReq = document.querySelector('input[name="eduReq"]:checked')?.value;
  const salary = document.querySelector('input[name="salary"]:checked')?.value;
  const workExp = document.querySelector('input[name="workExp"]:checked')?.value;
  const companyScale = document.querySelector('input[name="companyScale"]:checked')?.value;
  const companyIndustry = document.querySelector('input[name="companyIndustry"]:checked')?.value;

  if (!title || !address || !description) {
    alert('请填写所有必填项！');
    return;
  }

  // 构建Job对象
  const newJob = {
    title,
    address,
    description,
    jobType,
    eduReq,
    salary,
    workExp,
    companyScale,
    companyIndustry,
    createdBy: CURRENT_USER_ID
  };

  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob)
    });
    const data = await response.json();
    if (response.ok) {
      alert('岗位发布成功！即将跳转到我的岗位页面');
      const form = document.getElementById('add-job-form');
      form.reset();
      window.location.href = '../My Job/My Job 1.html';
    } else {
      alert(data.message || '岗位发布失败！');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('网络错误，发布失败！');
  }
});