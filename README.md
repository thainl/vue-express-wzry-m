## vue-node-moba

系统使用Node.js (Express.js) + Vue.js 开发的仿王者荣耀移动端官网和后台管理

预览地址：[http://wzry.thainl.xyz/admin](http://wzry.thainl.xyz/admin)

## 后台管理端

- 页面使用element ui 搭建
- 编辑页面：对各个模型（表）的操作
- 列表页面：展示各个模型（表）的数据
- 管理菜单选项添加动态渲染
- 路由列表添加动态渲染
- 页面操作按钮添加权限验证
- 使用axios拦截器对无权限操作进行拦截

![英雄列表](https://i.loli.net/2021/01/23/RiuNaKjQEw6H51T.png)



![角色编辑页](https://i.loli.net/2021/01/23/rDu3CigX5anEKNG.png)

```
// admin 目录下
npm install
npm run serve
```

  

## 服务接口端

- 使用MongoDB储存, Mongoose操作数据库模型
- 模型增删改查使用通用接口
- 添加登录jwt校验
- 接口添加登录权限验证
- 接口添加用户操作权限验证

```
// server 目录下
npm install
npm run dev
```

  

## 前台移动端

- 使用flex布局
- 使用scss书写样式

![前台首页](https://i.loli.net/2021/01/23/ebN4UVtkh8d3TCD.png)



![前台英雄详情页](https://i.loli.net/2021/01/23/BYwj1rpGSfObc6i.png)

```
// web 目录下
npm install
npm run serve
```

