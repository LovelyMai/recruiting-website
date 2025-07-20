// 获取userId
const userId = localStorage.getItem('CURRENT_USER_ID');

// 个人信息字段（开发文档变量名）
const fields = [
  // { key: 'userId', label: '用户ID', editable: false }, // 已删除
  { key: 'realname', label: '真实姓名', editable: true },
  // { key: 'password', label: '密码', editable: true, type: 'password' }, // 已删除
  { key: 'age', label: '年龄', editable: true },
  { key: 'gender', label: '性别', editable: true },
  { key: 'email', label: '邮箱', editable: true },
  { key: 'phone', label: '电话', editable: true },
  { key: 'introduction', label: '自我介绍', editable: true },
  { key: 'role', label: '身份', editable: false },
];

const meInfoDiv = document.querySelector('.me-info');
let userInfo = {};
let isEditing = false;

// 渲染个人信息
function renderUserInfo() {
  meInfoDiv.innerHTML = '';

  // 新增：真实姓名大号显示在左上角
  const realnameDiv = document.createElement('div');
  realnameDiv.className = 'me-realname-large';
  realnameDiv.textContent = userInfo.realname || '';
  meInfoDiv.appendChild(realnameDiv);

  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'me-details';

  fields.forEach(field => {
    // EMPLOYER和JOBSEEKER特殊字段
    if (field.key === 'company' && userInfo.role !== 'EMPLOYER') return;
    if (field.key === 'school' && userInfo.role !== 'JOBSEEKER') return;
    if (field.key === 'company' || field.key === 'school') return; // 跳过用户名

    const row = document.createElement('div');
    row.className = 'me-row';
    const label = document.createElement('label');
    label.textContent = field.label + '：';
    label.htmlFor = field.key;
    row.appendChild(label);

    if (isEditing && field.editable) {
      const input = document.createElement('input');
      input.type = field.type || 'text';
      input.value = userInfo[field.key] || '';
      input.id = field.key;
      input.name = field.key;
      input.className = 'me-input';
      row.appendChild(input);
    } else {
      const span = document.createElement('span');
      if (field.key === 'role') {
        // 角色映射
        let roleText = userInfo[field.key];
        if (roleText === 'EMPLOYER') roleText = 'BOSS';
        else if (roleText === 'JOBSEEKER') roleText = '牛人';
        span.textContent = roleText || '';
      } else {
        span.textContent = userInfo[field.key] || '';
      }
      span.className = 'me-value';
      row.appendChild(span);
    }
    detailsDiv.appendChild(row);
  });

  // EMPLOYER: company
  if (userInfo.role === 'EMPLOYER') {
    const row = document.createElement('div');
    row.className = 'me-row';
    const label = document.createElement('label');
    label.textContent = '公司：';
    label.htmlFor = 'company';
    row.appendChild(label);
    if (isEditing) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = userInfo.company || '';
      input.id = 'company';
      input.name = 'company';
      input.className = 'me-input';
      row.appendChild(input);
    } else {
      const span = document.createElement('span');
      span.textContent = userInfo.company || '';
      span.className = 'me-value';
      row.appendChild(span);
    }
    detailsDiv.appendChild(row);
  }
  // JOBSEEKER: school
  if (userInfo.role === 'JOBSEEKER') {
    const row = document.createElement('div');
    row.className = 'me-row';
    const label = document.createElement('label');
    label.textContent = '学校：';
    label.htmlFor = 'school';
    row.appendChild(label);
    if (isEditing) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = userInfo.school || '';
      input.id = 'school';
      input.name = 'school';
      input.className = 'me-input';
      row.appendChild(input);
    } else {
      const span = document.createElement('span');
      span.textContent = userInfo.school || '';
      span.className = 'me-value';
      row.appendChild(span);
    }
    detailsDiv.appendChild(row);
  }

  meInfoDiv.appendChild(detailsDiv);

  // 编辑、保存、取消按钮
  const btnDiv = document.createElement('div');
  btnDiv.className = 'me-btns';
  if (!isEditing) {
    const editBtn = document.createElement('button');
    editBtn.textContent = '编辑';
    editBtn.onclick = () => {
      isEditing = true;
      renderUserInfo();
    };
    btnDiv.appendChild(editBtn);
  } else {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.onclick = saveUserInfo;
    btnDiv.appendChild(saveBtn);
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => {
      isEditing = false;
      renderUserInfo();
    };
    btnDiv.appendChild(cancelBtn);
  }
  meInfoDiv.appendChild(btnDiv);
}

// 获取个人信息
function fetchUserInfo() {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      userInfo = data;
      renderUserInfo();
    })
    .catch(err => {
      meInfoDiv.innerHTML = '<div style="color:red">获取个人信息失败</div>';
    });
}

// 保存个人信息
function saveUserInfo() {
  // 收集表单数据
  const newInfo = { ...userInfo };
  fields.forEach(field => {
    if (field.editable) {
      const input = document.getElementById(field.key);
      if (input) newInfo[field.key] = input.value;
    }
  });
  if (userInfo.role === 'EMPLOYER') {
    const input = document.getElementById('company');
    if (input) newInfo.company = input.value;
  }
  if (userInfo.role === 'JOBSEEKER') {
    const input = document.getElementById('school');
    if (input) newInfo.school = input.value;
  }
  fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newInfo)
  })
    .then(res => {
      if (!res.ok) throw new Error('保存失败');
      return res.json();
    })
    .then(data => {
      userInfo = data;
      isEditing = false;
      renderUserInfo();
    })
    .catch(err => {
      alert('保存失败');
    });
}

// 页面加载时获取个人信息
fetchUserInfo();
