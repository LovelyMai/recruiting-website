/**
 * 课程列表管理模块（分页加载+后端搜索版本）
 */

// 获取DOM元素
const JobList = document.querySelector('.Job-list');
const paginationButtons = document.querySelectorAll('.pagination button');
const searchInput = document.querySelector('.search-bar input');
const addJobButton = document.querySelector('.search-bar a');

// 分页和搜索相关变量
let currentPage = 0;    // 当前页码
let totalPages = 1;     // 总页数
let currentKeyword = ''; // 当前搜索关键词

// 新增全局变量用于区分身份和分页
let isJobSeeker = false;
let totalApplications = 0;

// 获取筛选select元素
const filterIds = ['jobType', 'eduReq', 'salary', 'workExp', 'companyScale', 'companyIndustry'];
const filters = {};
filterIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    filters[id] = el;
    el.addEventListener('change', () => {
      currentPage = 0;
      loadJobs(0, currentKeyword);
    });
  }
});

/**
 * 构造所有筛选参数
 */
function getFilterParams() {
  const params = {};
  filterIds.forEach(id => {
    const v = filters[id]?.value;
    if (v && v !== "" && v !== "ANY") params[id] = v;
  });
  return params;
}

/**
 * 根据用户角色控制Add Job按钮的显示
 */
function controlAddJobButton() {
  const role = localStorage.getItem('CURRENT_USER_ROLE');

  if (role === 'JOBSEEKER') {
    // 如果是JOBSEEK，隐藏Add Job按钮
    addJobButton.style.display = 'none';
  } else if (role === 'EMPLOYER') {
    // 如果是EMPLOYER，显示Add Job按钮
    addJobButton.style.display = 'block';
  } else {
    // 其他角色默认隐藏
    addJobButton.style.display = 'none';
  }
}

/**
 * 加载我的岗位数据（支持分页、搜索和筛选）
 * @param {number} page - 请求的页码
 * @param {string} keyword - 搜索关键词
 */
async function loadJobs(page = 0, keyword = '') {
  try {
    const userId = localStorage.getItem('CURRENT_USER_ID');
    const role = localStorage.getItem('CURRENT_USER_ROLE');
    isJobSeeker = (role === 'JOBSEEKER');
    if (!userId) {
      alert('未检测到用户ID，请重新登录');
      window.location.href = '../Login/Login.html';
      return;
    }
    if (isJobSeeker) {
      // 求职者：查我的申请
      const resp = await fetch(`/api/applications/jobseeker/${userId}`);
      if (!resp.ok) throw new Error('获取申请记录失败');
      let applications = await resp.json();
      // 支持搜索和筛选
      const filters = getFilterParams();
      if (keyword) {
        applications = applications.filter(app => app.job && app.job.title && app.job.title.includes(keyword));
      }
      Object.entries(filters).forEach(([key, value]) => {
        applications = applications.filter(app => app.job && app.job[key] && app.job[key] === value);
      });
      totalApplications = applications.length;
      totalPages = Math.max(1, Math.ceil(totalApplications / 4));
      currentPage = Math.max(0, Math.min(page, totalPages - 1));
      // 分页
      const pageApps = applications.slice(currentPage * 4, (currentPage + 1) * 4);
      // 给Job对象加上_applicationStatus
      const pageJobs = pageApps.map(app => {
        if (app.job) {
          app.job._applicationStatus = app.status;
        }
        return app.job;
      }).filter(Boolean);
      renderJobs(pageJobs);
      updatePagination();
      requestAnimationFrame(() => {
        document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      // 招聘者：查自己发布的岗位
      // 构造查询参数
      const params = new URLSearchParams({
        createdBy: userId,
        page: page,
        size: 4,
        ...(keyword && { keyword }),
        ...getFilterParams()
      });
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP错误！状态码：${response.status}`);
      }
      const data = await response.json();
      totalPages = data.totalPages;
      currentPage = data.number;
      renderJobs(data.content);
      updatePagination();
      requestAnimationFrame(() => {
        document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  } catch (error) {
    console.error('数据加载失败:', error);
    JobList.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
  }
}

/**
 * 渲染岗位列表
 * @param {Array} Jobs - 当前页的岗位数据
 */
function renderJobs(Jobs) {
  console.log('渲染岗位列表:', Jobs); // 调试信息
  JobList.innerHTML = Jobs.length > 0
    ? Jobs.map((Job, idx) => {
      let statusHtml = '';
      if (isJobSeeker && Job._applicationStatus) {
        // 只在求职者身份下显示申请状态
        let statusText = '';
        if (Job._applicationStatus === 'PENDING') statusText = '待处理';
        else if (Job._applicationStatus === 'ACCEPTED') statusText = '已通过';
        else if (Job._applicationStatus === 'REJECTED') statusText = '已拒绝';
        else statusText = Job._applicationStatus;
        statusHtml = `<div class="Job-status">申请状态：<b>${statusText}</b></div>`;
      }
      return `
        <div class="Job-item" data-job-id="${Job.jobId}">
          <a href="My Job 2.html?jobId=${Job.jobId}" style="flex:1;">
            <div class="Job-info">
              <div class="Job-name">${Job.title}</div>
              <div class="Job-type">${Job.jobType}</div>
              <div class="Job-edu">${Job.eduReq}</div>
              <div class="Job-salary">${Job.salary}</div>
              <div class="Job-exp">${Job.workExp}</div>
              <div class="Job-scale">${Job.companyScale}</div>
              <div class="Job-industry">${Job.companyIndustry}</div>
              ${statusHtml}
            </div>
          </a>
          ${!isJobSeeker ? '<button class="delete-btn">删除</button>' : ''}
        </div>
        `;
    }).join('')
    : '<div class="empty">未找到相关岗位</div>';

  // 仅EMPLOYER绑定删除事件
  if (!isJobSeeker) {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const jobItem = btn.closest('.Job-item');
        const jobId = jobItem.getAttribute('data-job-id');
        if (confirm('确定要删除该岗位吗？')) {
          try {
            const resp = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
            if (resp.ok) {
              alert('删除成功');
              loadJobs(currentPage, currentKeyword);
            } else {
              alert('删除失败');
            }
          } catch (err) {
            alert('删除异常');
          }
        }
      });
    });
  }
}

/**
 * 更新分页按钮状态
 */
function updatePagination() {
  paginationButtons[0].disabled = currentPage === 0;
  paginationButtons[1].disabled = currentPage === totalPages - 1;
}

// ==================== 事件监听 ====================
// 分页按钮点击
paginationButtons[0].addEventListener('click', () => loadJobs(currentPage - 1, currentKeyword));
paginationButtons[1].addEventListener('click', () => loadJobs(currentPage + 1, currentKeyword));

// 搜索框回车事件
searchInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    currentKeyword = e.target.value.trim();
    currentPage = 0; // 搜索后重置到第一页
    loadJobs(0, currentKeyword);
  }
});

// ==================== 初始化 ====================
// 页面加载时获取第一页数据
loadJobs();
// 控制Add Job按钮显示
controlAddJobButton();