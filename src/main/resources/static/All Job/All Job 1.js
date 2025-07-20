/**
 * 公共课程列表模块（支持分页加载和后端搜索）
 * 功能说明：
 * 1. 显示全部公开课程（不限制于当前用户）
 * 2. 实现服务端分页加载（每页4条）
 * 3. 支持关键词搜索（服务端过滤）
 * 4. 分页按钮状态管理
 */

// 获取DOM元素
const JobList = document.querySelector('.Job-list');
const paginationButtons = document.querySelectorAll('.pagination button');
const searchInput = document.querySelector('.search-bar input');

// 分页状态管理
let currentPage = 0;    // 当前页码
let totalPages = 1;     // 总页数
let currentKeyword = ''; // 当前搜索词

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
 * 从服务端加载课程数据（支持筛选）
 * @param {number} page - 请求的页码
 * @param {string} keyword - 搜索关键词
 */
async function loadJobs(page = 0, keyword = '') {
  try {
    // 构造查询参数
    const params = new URLSearchParams({
      page: page,
      size: 4,
      ...(keyword && { keyword }),
      ...getFilterParams()
    });

    // 发送请求获取数据
    const response = await fetch(`/api/jobs?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP错误！状态码：${response.status}`);
    }

    const data = await response.json();

    // 更新分页状态
    totalPages = data.totalPages;
    currentPage = data.number;
    // 渲染数据和分页状态
    // 渲染数据和分页状态
    renderJobs(data.content);
    updatePagination();
    requestAnimationFrame(() => {
      document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
    });
  } catch (error) {
    console.error('数据加载失败:', error);
    showError('数据加载失败，请稍后重试');
  }
}

/**
 * 渲染课程列表
 * @param {Array} Jobs - 课程数据数组
 */
function renderJobs(Jobs) {
  JobList.innerHTML = Jobs.length > 0
    ? Jobs.map(Job => `
        <a href="All Job 2.html?jobId=${Job.jobId}" class="Job-item" data-job-id="${Job.jobId}">
          <div class="Job-info">
            <div class="Job-name">${Job.title}</div>
            <div class="Job-type">${Job.jobType}</div>
            <div class="Job-edu">${Job.eduReq}</div>
            <div class="Job-salary">${Job.salary}</div>
            <div class="Job-exp">${Job.workExp}</div>
            <div class="Job-scale">${Job.companyScale}</div>
            <div class="Job-industry">${Job.companyIndustry}</div>
          </div>
        </a >
      `).join('')
    : '<div class="empty">未找到相关岗位</div>';
}

/**
 * 更新分页按钮状态
 */
function updatePagination() {
  // 上一页按钮：当前为第一页时禁用
  paginationButtons[0].disabled = currentPage === 0;
  // 下一页按钮：当前为最后一页时禁用
  paginationButtons[1].disabled = currentPage === totalPages - 1;
}

/**
 * 显示错误信息
 * @param {string} message - 错误提示内容
 */
function showError(message) {
  JobList.innerHTML = `<div class="error">${message}</div>`;
}

// ==================== 事件监听 ====================
// 上一页/下一页点击事件
paginationButtons[0].addEventListener('click', () => {
  loadJobs(currentPage - 1, currentKeyword);
});

paginationButtons[1].addEventListener('click', () => {
  loadJobs(currentPage + 1, currentKeyword);
});

// 搜索框输入事件（回车触发搜索）
searchInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    currentKeyword = e.target.value.trim();
    currentPage = 0; // 搜索后重置到第0页
    loadJobs(0, currentKeyword);
  }
});

// ==================== 初始化加载 ====================
// 页面加载时获取第一页数据
loadJobs();