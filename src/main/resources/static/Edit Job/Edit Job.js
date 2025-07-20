// ==================== 全局配置 ====================
const CURRENT_USER_ID = localStorage.getItem('CURRENT_USER_ID');

// ==================== 初始化校验 ====================
if (!CURRENT_USER_ID) {
  alert('请先登录！');
  window.location.href = '../Login/Login.html';
}

// 获取jobId
function getJobIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('jobId');
}
const jobId = getJobIdFromURL();
if (!jobId) {
  alert('未获取到岗位ID');
  window.location.href = '../My Job/My Job 1.html';
}

// ==================== 表单填充 ====================
window.onload = async function () {
  try {
    const resp = await fetch(`/api/jobs/${jobId}`);
    if (!resp.ok) throw new Error('岗位信息获取失败');
    const job = await resp.json();
    document.getElementById('title').value = job.title || '';
    document.getElementById('address').value = job.address || '';
    document.getElementById('description').value = job.description || '';
    if (job.jobType) document.querySelector(`input[name="jobType"][value="${job.jobType}"]`)?.click();
    if (job.eduReq) document.querySelector(`input[name="eduReq"][value="${job.eduReq}"]`)?.click();
    if (job.salary) document.querySelector(`input[name="salary"][value="${job.salary}"]`)?.click();
    if (job.workExp) document.querySelector(`input[name="workExp"][value="${job.workExp}"]`)?.click();
    if (job.companyScale) document.querySelector(`input[name="companyScale"][value="${job.companyScale}"]`)?.click();
    if (job.companyIndustry) document.querySelector(`input[name="companyIndustry"][value="${job.companyIndustry}"]`)?.click();
  } catch (e) {
    alert('岗位信息加载失败');
  }
}

// ==================== 表单提交处理 ====================
document.getElementById('edit-job-form').addEventListener('submit', async function (e) {
  e.preventDefault();
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

  const jobDTO = {
    title,
    address,
    description,
    jobType,
    eduReq,
    salary,
    workExp,
    companyScale,
    companyIndustry
  };

  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobDTO)
    });
    const data = await response.json();
    if (response.ok) {
      alert('岗位修改成功！');
      window.location.href = `../My Job/My Job 2.html?jobId=${jobId}`;
    } else {
      alert(data.message || '岗位修改失败！');
    }
  } catch (error) {
    alert('网络错误，修改失败！');
  }
});

// ==================== 取消按钮处理 ====================
document.getElementById('cancel-btn').onclick = function () {
  window.location.href = `../My Job/My Job 2.html?jobId=${jobId}`;
};