// 获取DOM元素
const JobInfo = document.querySelector('.Job-info');
const UserInfo = document.querySelector('.User-info');
const JobTitle = document.querySelector('.title');

async function initializeJobPage() {
  const jobId = getJobIdFromURL();
  if (!jobId) {
    JobTitle.textContent = '岗位加载失败';
    JobInfo.innerHTML = `<div class="error">未获取到岗位ID</div>`;
    if (UserInfo) UserInfo.innerHTML = '';
    return;
  }
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    if (!response.ok) throw new Error('岗位信息获取失败');
    const job = await response.json();
    if (!job || !job.createdBy) throw new Error('岗位或招聘者信息缺失');
    renderJobDetails(job);
    // 新增：单独请求Boss信息
    let bossId = job.createdBy?.userId || job.createdBy;
    if (bossId) {
      try {
        const userResp = await fetch(`/api/users/${bossId}`);
        if (userResp.ok) {
          const bossUser = await userResp.json();
          renderUserDetails(bossUser);
        } else {
          renderUserDetails({});
        }
      } catch {
        renderUserDetails({});
      }
    } else {
      renderUserDetails({});
    }
    // 渲染申请按钮
    await renderApplyButton(job.jobId);
  } catch (error) {
    JobTitle.textContent = '岗位加载失败';
    JobInfo.innerHTML = `<div class="error">${error.message}</div>`;
    if (UserInfo) UserInfo.innerHTML = '';
  }
}

function getJobIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('jobId');
}

function renderJobDetails(job) {
  JobTitle.textContent = job.title;
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    return dateStr.split('T')[0];
  }
  JobInfo.innerHTML = `
    <div class="Job-detail-block">
      <div><b>岗位名称：</b>${job.title ?? '-'}</div>
      <div><b>岗位地址：</b>${job.address ?? '-'}</div>
      <div><b>求职类型：</b>${job.jobType ?? '-'}</div>
      <div><b>学历要求：</b>${job.eduReq ?? '-'}</div>
      <div><b>薪资待遇：</b>${job.salary ?? '-'}</div>
      <div><b>经验要求：</b>${job.workExp ?? '-'}</div>
      <div><b>公司规模：</b>${job.companyScale ?? '-'}</div>
      <div><b>行业分类：</b>${job.companyIndustry ?? '-'}</div>
      <div><b>更新时间：</b>${formatDate(job.updatedAt)}</div>
    </div>
  `;
  // 渲染岗位描述到主内容区下方
  const descDiv = document.querySelector('.Job-desc-block');
  if (descDiv) {
    descDiv.innerHTML = `<b>岗位描述：</b><br>${job.description ?? '-'}`;
    // 处理申请按钮插入
    insertApplyButtonFlex(descDiv);
  }
}

// 新增：弹性盒子布局插入申请按钮
function insertApplyButtonFlex(descDiv, btn) {
  if (!btn) btn = document.querySelector('.apply-btn');
  if (!btn) return;
  let flexRow = descDiv.parentElement;
  if (!flexRow.classList.contains('desc-btn-row')) {
    flexRow = document.createElement('div');
    flexRow.className = 'desc-btn-row';
    descDiv.parentNode.insertBefore(flexRow, descDiv);
    flexRow.appendChild(descDiv);
  }
  flexRow.appendChild(btn);
}

function renderUserDetails(user) {
  if (!UserInfo) return;
  UserInfo.innerHTML = `
    <div class="User-detail-block">
      <div><b>Boss：</b>${user.realname || user.account || '-'}${user.gender ? '（' + user.gender + '）' : ''}</div>
      <div><b>邮箱：</b>${user.email ?? '-'}</div>
      <div><b>电话：</b>${user.phone ?? '-'}</div>
      <div><b>公司：</b>${user.company ?? '-'}</div>
    </div>
  `;
}

async function renderApplyButton(jobId) {
  const role = localStorage.getItem('CURRENT_USER_ROLE');
  const userId = localStorage.getItem('CURRENT_USER_ID');
  if (role === 'JOBSEEKER' && userId) {
    // 检查是否已申请
    let alreadyApplied = false;
    try {
      const resp = await fetch(`/api/applications/jobseeker/${userId}`);
      if (resp.ok) {
        const applications = await resp.json();
        alreadyApplied = applications.some(app => app.job && String(app.job.jobId) === String(jobId));
      }
    } catch (e) { /* 网络异常时默认可申请 */ }

    // 检查按钮是否已存在，避免重复渲染
    if (document.querySelector('.apply-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'apply-btn';
    if (alreadyApplied) {
      btn.textContent = '已申请';
      btn.disabled = true;
    } else {
      btn.textContent = '申请该岗位';
      btn.onclick = async () => {
        const coverLetter = prompt('请输入求职信（可选）：') || '';
        try {
          const resp = await fetch('/api/applications/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobseekerId: Number(userId),
              jobId: Number(jobId),
              coverLetter: coverLetter
            })
          });
          const data = await resp.json();
          if (resp.ok) {
            alert('申请成功！');
            btn.disabled = true;
            btn.textContent = '已申请';
          } else {
            alert(data.message || JSON.stringify(data) || '申请失败');
          }
        } catch (err) {
          alert('申请异常');
        }
      };
    }
    // 插入到描述区flex容器
    const descDiv = document.querySelector('.Job-desc-block');
    insertApplyButtonFlex(descDiv, btn);
  }
}

initializeJobPage();