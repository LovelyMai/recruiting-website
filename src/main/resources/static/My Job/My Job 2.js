// 获取DOM元素
const JobInfo = document.querySelector('.Job-info');
const UserInfo = document.querySelector('.User-info');
const JobTitle = document.querySelector('.title');
const ApplicationListDiv = document.createElement('div');
ApplicationListDiv.className = 'Application-list';
document.querySelector('.main-content').appendChild(ApplicationListDiv);

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
    // 新增：如果是EMPLOYER，渲染申请列表
    const role = localStorage.getItem('CURRENT_USER_ROLE');
    const userId = localStorage.getItem('CURRENT_USER_ID');
    if (role === 'EMPLOYER' && userId) {
      await renderApplicationList(jobId, userId);
    }
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
    <div class="Job-detail-block" id="job-detail-block">
      <div><b>岗位名称：</b><span class="job-title">${job.title ?? '-'}</span></div>
      <div><b>岗位地址：</b><span class="job-address">${job.address ?? '-'}</span></div>
      <div><b>求职类型：</b><span class="job-jobType">${job.jobType ?? '-'}</span></div>
      <div><b>学历要求：</b><span class="job-eduReq">${job.eduReq ?? '-'}</span></div>
      <div><b>薪资待遇：</b><span class="job-salary">${job.salary ?? '-'}</span></div>
      <div><b>经验要求：</b><span class="job-workExp">${job.workExp ?? '-'}</span></div>
      <div><b>公司规模：</b><span class="job-companyScale">${job.companyScale ?? '-'}</span></div>
      <div><b>行业分类：</b><span class="job-companyIndustry">${job.companyIndustry ?? '-'}</span></div>
      <div><b>更新时间：</b>${formatDate(job.updatedAt)}</div>
      <div class="edit-btn-row"></div>
    </div>
  `;
  // 渲染岗位描述
  const descDiv = document.querySelector('.Job-desc-block');
  if (descDiv) {
    descDiv.innerHTML = `<b>岗位描述：</b><br><span class="job-description">${job.description ?? '-'}</span>`;
  }
  // 渲染编辑按钮到Job-detail-block底部
  const role = localStorage.getItem('CURRENT_USER_ROLE');
  const userId = localStorage.getItem('CURRENT_USER_ID');
  if (role === 'EMPLOYER' && String(userId) === String(job.createdBy?.userId || job.createdBy)) {
    let editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '编辑';
    editBtn.onclick = () => {
      window.location.href = `../../Edit Job/Edit Job.html?jobId=${job.jobId}`;
    };
    const btnRow = JobInfo.querySelector('.edit-btn-row');
    btnRow.appendChild(editBtn);
  }
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

async function renderApplicationList(jobId, employerId) {
  ApplicationListDiv.innerHTML = '<div style="margin:20px 0; font-weight:600;">申请用户列表：</div>';
  try {
    const resp = await fetch(`/api/applications/employer/${employerId}`);
    if (!resp.ok) throw new Error('获取申请列表失败');
    const applications = await resp.json();
    // 只显示当前岗位的申请
    const jobApps = applications.filter(app => app.job && String(app.job.jobId) === String(jobId));
    if (jobApps.length === 0) {
      ApplicationListDiv.innerHTML += '<div style="color:#888;">暂无用户申请该岗位</div>';
      return;
    }
    ApplicationListDiv.innerHTML += jobApps.map(app => `
      <div class="application-item" data-app-id="${app.applicationId}" style="padding:12px 18px; border-radius:8px; background:#f7faff; margin-bottom:12px; cursor:pointer; border:1px solid #e0e7ef;">
        <b>${app.jobseeker?.realname || app.jobseeker?.account || '未知用户'}</b>（${app.status === 'PENDING' ? '待处理' : app.status === 'ACCEPTED' ? '已通过' : '已拒绝'}）
      </div>
    `).join('');
    // 绑定点击事件
    document.querySelectorAll('.application-item').forEach(item => {
      item.addEventListener('click', () => {
        const appId = item.getAttribute('data-app-id');
        const app = jobApps.find(a => String(a.applicationId) === String(appId));
        if (!app) return;
        showApplicationModal(app);
      });
    });
  } catch (e) {
    ApplicationListDiv.innerHTML += '<div style="color:red;">加载申请列表失败</div>';
  }
}

function showApplicationModal(app) {
  // 构建弹窗内容
  const user = app.jobseeker || {};
  const statusText = app.status === 'PENDING' ? '待处理' : app.status === 'ACCEPTED' ? '已通过' : '已拒绝';
  const html = `
    <div style="font-size:18px;font-weight:600;margin-bottom:10px;">用户信息</div>
    <div><b>账号：</b>${user.account || '-'}</div>
    <div><b>姓名：</b>${user.realname || '-'}</div>
    <div><b>邮箱：</b>${user.email || '-'}</div>
    <div><b>电话：</b>${user.phone || '-'}</div>
    <div><b>学校：</b>${user.school || '-'}</div>
    <div><b>公司：</b>${user.company || '-'}</div>
    <div><b>简介：</b>${user.introduction || '-'}</div>
    <div style="margin-top:10px;"><b>求职信：</b>${app.coverLetter || '-'}</div>
    <div style="margin-top:10px;"><b>申请状态：</b>${statusText}</div>
    <div style="margin-top:18px; text-align:right;">
      ${app.status === 'PENDING' ? `
        <button id="acceptBtn" style="background:#1abc9c;color:#fff;border:none;padding:8px 18px;border-radius:6px;margin-right:10px;cursor:pointer;">接受</button>
        <button id="rejectBtn" style="background:#e74c3c;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;">拒绝</button>
      ` : ''}
      <button id="closeBtn" style="margin-left:10px;">关闭</button>
    </div>
  `;
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.18)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';
  modal.innerHTML = `<div style="background:#fff;padding:32px 38px 18px 38px;border-radius:12px;min-width:340px;max-width:90vw;box-shadow:0 4px 24px rgba(44,62,80,0.13);">${html}</div>`;
  document.body.appendChild(modal);
  // 关闭按钮
  modal.querySelector('#closeBtn').onclick = () => document.body.removeChild(modal);
  // 接受/拒绝按钮
  if (app.status === 'PENDING') {
    modal.querySelector('#acceptBtn').onclick = async () => {
      await updateApplicationStatus(app.applicationId, 'ACCEPTED');
      document.body.removeChild(modal);
      initializeJobPage();
    };
    modal.querySelector('#rejectBtn').onclick = async () => {
      await updateApplicationStatus(app.applicationId, 'REJECTED');
      document.body.removeChild(modal);
      initializeJobPage();
    };
  }
}

async function updateApplicationStatus(applicationId, status) {
  try {
    const resp = await fetch(`/api/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await resp.json();
    if (resp.ok) {
      alert('操作成功');
    } else {
      alert(data.message || JSON.stringify(data) || '操作失败');
    }
  } catch (e) {
    alert('网络异常，操作失败');
  }
}

initializeJobPage();