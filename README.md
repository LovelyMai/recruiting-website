# 招聘系统 RecruitingSystem

## 项目简介

本项目是一个基于 Spring Boot 的招聘管理系统，支持企业发布职位、求职者投递简历、职位筛选、用户注册登录等功能。前端采用原生 HTML/CSS/JavaScript 实现，后端采用 Java + Spring Boot + JPA，适合学习和二次开发。

---

## 主要功能

- **用户注册与登录**：支持求职者和招聘者两种角色。
- **职位管理**：招聘者可发布、编辑、删除职位。
- **职位浏览与筛选**：求职者可按多条件筛选、搜索职位。
- **职位申请**：求职者可在线申请职位，查看申请进度。
- **个人中心**：用户可修改个人信息、密码等。
- **权限控制**：不同角色拥有不同的操作权限。

---

## 技术栈

- **后端**：Java 17+、Spring Boot、Spring Data JPA、Hibernate
- **数据库**：MySQL（可根据需要切换为其他数据库）
- **前端**：原生 HTML、CSS、JavaScript
- **构建工具**：Maven

---

## 目录结构

```
RecruitingSystem/
├── src/
│   ├── main/
│   │   ├── java/com/example/Recruitingsystem/   # 后端Java代码
│   │   └── resources/
│   │       ├── static/                          # 前端静态页面
│   │       └── application.properties           # 配置文件
│   └── test/                                    # 测试代码
├── uploads/                                     # 简历/附件上传目录
├── pom.xml                                      # Maven配置
└── README.md
```

---

## 快速启动

### 1. 数据库准备

1. 安装并启动 MySQL 数据库。
2. 创建数据库（如：`recruiting_system`）。
3. 修改 `src/main/resources/application.properties`，配置数据库连接信息：

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/recruiting_system?useSSL=false&serverTimezone=UTC
   spring.datasource.username=你的用户名
   spring.datasource.password=你的密码
   ```

### 2. 启动后端

```bash
# 进入项目根目录
cd RecruitingSystem

# 使用Maven编译并运行
./mvnw spring-boot:run
```

### 3. 访问前端

- 直接用浏览器打开 `src/main/resources/static/` 下的 HTML 文件，如 `Login/Login.html`、`All Job/All Job 1.html` 等。
- 推荐将后端和前端静态资源一起部署，访问 `http://localhost:8080/` 下的页面。

---

## 常见问题

- **数据库连接失败**：请确认数据库已启动，配置正确，用户有权限。
- **端口冲突**：默认端口为 8080，可在 `application.properties` 修改。
- **静态资源无法访问**：请确保 HTML/JS/CSS 文件路径正确，且已放在 `static` 目录下。

---

## 贡献与反馈

如有建议或发现问题，欢迎提交 Issue 或 Pull Request！

---

## License

本项目仅供学习交流，禁止商业用途。 