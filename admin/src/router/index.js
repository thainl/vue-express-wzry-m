import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter);

const routerMapping = {
    "/categories/create": {
        path: "/categories/create",
        name: "CategoryCreate",
        component: () => import("../views/CategoryEdit.vue"),
    },
    "/categories/list": {
        path: "/categories/list",
        name: "CategoryList",
        component: () => import("../views/CategoryList.vue"),
    },
    "/categories/edit/:id": {
        path: "/categories/edit/:id",
        name: "CategoryEdit",
        props: true,
        component: () => import("../views/CategoryEdit.vue"),
    },

    "/items/create": {
        path: "/items/create",
        name: "ItemCreate",
        component: () => import("../views/ItemEdit.vue"),
    },
    "/items/list": {
        path: "/items/list",
        name: "ItemList",
        component: () => import("../views/ItemList.vue"),
    },
    "/items/edit/:id": {
        path: "/items/edit/:id",
        name: "ItemEdit",
        props: true,
        component: () => import("../views/ItemEdit.vue"),
    },

    "/heroes/create": {
        path: "/heroes/create",
        name: "HeroCreate",
        component: () => import("../views/HeroEdit.vue"),
    },
    "/heroes/list": {
        path: "/heroes/list",
        name: "HeroList",
        component: () => import("../views/HeroList.vue"),
    },
    "/heroes/edit/:id": {
        path: "/heroes/edit/:id",
        name: "HeroEdit",
        props: true,
        component: () => import("../views/HeroEdit.vue"),
    },
    "/heroes/detail/:id": {
        path: "/heroes/detail/:id",
        name: "HeroDetail",
        props: true,
        component: () => import("../views/HeroEdit.vue"),
    },

    "/articles/create": {
        path: "/articles/create",
        name: "ArticleCreate",
        component: () => import("../views/ArticleEdit.vue"),
    },
    "/articles/list": {
        path: "/articles/list",
        name: "ArticleList",
        component: () => import("../views/ArticleList.vue"),
    },
    "/articles/edit/:id": {
        path: "/articles/edit/:id",
        name: "ArticleEdit",
        props: true,
        component: () => import("../views/ArticleEdit.vue"),
    },

    "/ads/create": {
        path: "/ads/create",
        name: "AdCreate",
        component: () => import("../views/AdEdit.vue"),
    },
    "/ads/list": {
        path: "/ads/list",
        name: "AdList",
        component: () => import("../views/AdList.vue"),
    },
    "/ads/edit/:id": {
        path: "/ads/edit/:id",
        name: "AdEdit",
        props: true,
        component: () => import("../views/AdEdit.vue"),
    },

    "/admin_users/create": {
        path: "/admin_users/create",
        name: "AdminUserCreate",
        component: () => import("../views/AdminUserEdit.vue"),
    },
    "/admin_users/list": {
        path: "/admin_users/list",
        name: "AdminUserList",
        component: () => import("../views/AdminUserList.vue"),
    },
    "/admin_users/edit/:id": {
        path: "/admin_users/edit/:id",
        name: "AdminUserEdit",
        props: true,
        component: () => import("../views/AdminUserEdit.vue"),
    },

    "/server_rights/create": {
        path: "/server_rights/create",
        name: "ServerRightCreate",
        component: () => import("../views/ServerRightEdit.vue"),
    },
    "/server_rights/list": {
        path: "/server_rights/list",
        name: "ServerRightList",
        component: () => import("../views/ServerRightList.vue"),
    },
    "/server_rights/edit/:id": {
        path: "/server_rights/edit/:id",
        name: "ServerRightEdit",
        props: true,
        component: () => import("../views/ServerRightEdit.vue"),
    },

    "/api_urls/create": {
        path: "/api_urls/create",
        name: "ApiUrlCreate",
        component: () => import("../views/ApiUrlEdit.vue"),
    },
    "/api_urls/list": {
        path: "/api_urls/list",
        name: "ApiUrlList",
        component: () => import("../views/ApiUrlList.vue"),
    },
    "/api_urls/edit/:id": {
        path: "/api_urls/edit/:id",
        name: "ApiUrlEdit",
        props: true,
        component: () => import("../views/ApiUrlEdit.vue"),
    },

    "/roles/create": {
        path: "/roles/create",
        name: "RoleCreate",
        component: () => import("../views/RoleEdit.vue"),
    },
    "/roles/list": {
        path: "/roles/list",
        name: "RoleList",
        component: () => import("../views/RoleList.vue"),
    },
    "/roles/edit/:id": {
        path: "/roles/edit/:id",
        name: "RoleEdit",
        props: true,
        component: () => import("../views/RoleEdit.vue"),
    },

    "/menus/create": {
        path: "/menus/create",
        name: "MenuCreate",
        component: () => import("../views/MenuEdit.vue"),
    },
    "/menus/list": {
        path: "/menus/list",
        name: "MenuList",
        component: () => import("../views/MenuList.vue"),
    },
    "/menus/edit/:id": {
        path: "/menus/edit/:id",
        name: "MenuEdit",
        props: true,
        component: () => import("../views/MenuEdit.vue"),
    },

    "/admin_webs/create": {
        path: "/admin_webs/create",
        name: "AdminWebCreate",
        component: () => import("../views/AdminWebEdit.vue"),
    },
    "/admin_webs/list": {
        path: "/admin_webs/list",
        name: "AdminWebList",
        component: () => import("../views/AdminWebList.vue"),
    },
    "/admin_webs/edit/:id": {
        path: "/admin_webs/edit/:id",
        name: "AdminWebEdit",
        props: true,
        component: () => import("../views/AdminWebEdit.vue"),
    },
    "/api_rights/create": {
        path: "/api_rights/create",
        name: "ApiRightCreate",
        component: () => import("../views/ApiRightEdit.vue"),
    },
    "/api_rights/list": {
        path: "/api_rights/list",
        name: "ApiRightList",
        component: () => import("../views/ApiRightList.vue"),
    },
    "/api_rights/edit/:id": {
        path: "/api_rights/edit/:id",
        name: "ApiRightEdit",
        props: true,
        component: () => import("../views/ApiRightEdit.vue"),
    },
};

const routes = [
    {
        path: "/login",
        name: "Login",
        meta: { isPublic: true },
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/",
        name: "Main",
        component: Main,
        children: [
            {
                path: "/categories/create",
                name: "CategoryCreate",
                component: () => import("../views/CategoryEdit.vue"),
            },
            {
                path: "/categories/list",
                name: "CategoryList",
                component: () => import("../views/CategoryList.vue"),
            },
            {
                path: "/categories/edit/:id",
                name: "CategoryEdit",
                props: true,
                component: () => import("../views/CategoryEdit.vue"),
            },

            {
                path: "/items/create",
                name: "ItemCreate",
                component: () => import("../views/ItemEdit.vue"),
            },
            {
                path: "/items/list",
                name: "ItemList",
                component: () => import("../views/ItemList.vue"),
            },
            {
                path: "/items/edit/:id",
                name: "ItemEdit",
                props: true,
                component: () => import("../views/ItemEdit.vue"),
            },

            {
                path: "/heroes/create",
                name: "HeroCreate",
                component: () => import("../views/HeroEdit.vue"),
            },
            {
                path: "/heroes/list",
                name: "HeroList",
                component: () => import("../views/HeroList.vue"),
            },
            {
                path: "/heroes/edit/:id",
                name: "HeroEdit",
                props: true,
                component: () => import("../views/HeroEdit.vue"),
            },
            {
                path: "/heroes/detail/:id",
                name: "HeroDetail",
                props: true,
                component: () => import("../views/HeroEdit.vue"),
            },

            {
                path: "/articles/create",
                name: "ArticleCreate",
                component: () => import("../views/ArticleEdit.vue"),
            },
            {
                path: "/articles/list",
                name: "ArticleList",
                component: () => import("../views/ArticleList.vue"),
            },
            {
                path: "/articles/edit/:id",
                name: "ArticleEdit",
                props: true,
                component: () => import("../views/ArticleEdit.vue"),
            },

            {
                path: "/ads/create",
                name: "AdCreate",
                component: () => import("../views/AdEdit.vue"),
            },
            {
                path: "/ads/list",
                name: "AdList",
                component: () => import("../views/AdList.vue"),
            },
            {
                path: "/ads/edit/:id",
                name: "AdEdit",
                props: true,
                component: () => import("../views/AdEdit.vue"),
            },

            {
                path: "/admin_users/create",
                name: "AdminUserCreate",
                component: () => import("../views/AdminUserEdit.vue"),
            },
            {
                path: "/admin_users/list",
                name: "AdminUserList",
                component: () => import("../views/AdminUserList.vue"),
            },
            {
                path: "/admin_users/edit/:id",
                name: "AdminUserEdit",
                props: true,
                component: () => import("../views/AdminUserEdit.vue"),
            },

            {
                path: "/server_rights/create",
                name: "ServerRightCreate",
                component: () => import("../views/ServerRightEdit.vue"),
            },
            {
                path: "/server_rights/list",
                name: "ServerRightList",
                component: () => import("../views/ServerRightList.vue"),
            },
            {
                path: "/server_rights/edit/:id",
                name: "ServerRightEdit",
                props: true,
                component: () => import("../views/ServerRightEdit.vue"),
            },

            {
                path: "/api_urls/create",
                name: "ApiUrlCreate",
                component: () => import("../views/ApiUrlEdit.vue"),
            },
            {
                path: "/api_urls/list",
                name: "ApiUrlList",
                component: () => import("../views/ApiUrlList.vue"),
            },
            {
                path: "/api_urls/edit/:id",
                name: "ApiUrlEdit",
                props: true,
                component: () => import("../views/ApiUrlEdit.vue"),
            },

            {
                path: "/roles/create",
                name: "RoleCreate",
                component: () => import("../views/RoleEdit.vue"),
            },
            {
                path: "/roles/list",
                name: "RoleList",
                component: () => import("../views/RoleList.vue"),
            },
            {
                path: "/roles/edit/:id",
                name: "RoleEdit",
                props: true,
                component: () => import("../views/RoleEdit.vue"),
            },

            {
                path: "/menus/create",
                name: "MenuCreate",
                component: () => import("../views/MenuEdit.vue"),
            },
            {
                path: "/menus/list",
                name: "MenuList",
                component: () => import("../views/MenuList.vue"),
            },
            {
                path: "/menus/edit/:id",
                name: "MenuEdit",
                props: true,
                component: () => import("../views/MenuEdit.vue"),
            },

            {
                path: "/admin_webs/create",
                name: "AdminWebCreate",
                component: () => import("../views/AdminWebEdit.vue"),
            },
            {
                path: "/admin_webs/list",
                name: "AdminWebList",
                component: () => import("../views/AdminWebList.vue"),
            },
            {
                path: "/admin_webs/edit/:id",
                name: "AdminWebEdit",
                props: true,
                component: () => import("../views/AdminWebEdit.vue"),
            },

            {
                path: "/api_rights/create",
                name: "ApiRightCreate",
                component: () => import("../views/ApiRightEdit.vue"),
            },
            {
                path: "/api_rights/list",
                name: "ApiRightList",
                component: () => import("../views/ApiRightList.vue"),
            },
            {
                path: "/api_rights/edit/:id",
                name: "ApiRightEdit",
                props: true,
                component: () => import("../views/ApiRightEdit.vue"),
            },
        ],
	},
	{
		path: '*',
		name: 'NotFound',
		component: ()=> import('../views/NotFound.vue')
	}
];

const router = new VueRouter({
    routes,
});



router.beforeEach((to, from, next) => {
    if (!to.meta.isPublic && !localStorage.token) {
        // 不是公开可以访问的页面 并且 无token
        Vue.prototype.$message({ type: "error", message: "请先登录" });
        next("/login");
    }else if(to.params.id && from.meta.rights) {
        // 对列表的编辑按钮进行权限控制
        let reg = new RegExp('/edit/'+to.params.id, 'i');
        if(reg.test(to.path) && from.meta.rights.indexOf('PUT') === -1) {
            Vue.prototype.$alert('无权限进行此操作： 编辑', '错误', {type: 'error'});
        }
    }else {
        next();
    }
});

router.$addRoutes = (routes)=> {
	// 自定义一个$addRoutes的方法
	// 通过新建一个全新的 Router，然后将新的 Router.matcher 赋给当前页面的管理 Router，以达到更新路由配置的目的。自定义的$addRoutes，就是实现这个功能
	router.matcher = new VueRouter().matcher;
	router.addRoutes(routes);
}

export function initDynamicRoutes() {
	if(localStorage.token && localStorage.adminWebs) {
		let mainRouteIndex;
		const routes = router.options.routes; // 所有路由集合
		routes.forEach((r, i) => {
			if(r.path === '/' && r.name ==='Main') {
				mainRouteIndex = i; // 获取首页路由在路由集合的索引
			}
		})
		const adminWebs = JSON.parse(localStorage.getItem('adminWebs'));
		// routes[mainRouteIndex].children.splice(0, routes[mainRouteIndex].children.length - 1);
		adminWebs.forEach((w, i) => {
			let temp = routerMapping[w.web.path];
			if(temp && !routes[mainRouteIndex].children[i]) { 
				// 如果索引已经存在，则不添加，因为初始化动态路由在app.vue和main.vue页面都会调用
				temp.meta = {rights: w.rights};
				routes[mainRouteIndex].children.push(temp); // 往首页路由添加子路由
			}
		})
		router.$addRoutes(routes);
		// console.log(router);
	}else {
		console.log('初始化动态路由失败');
		return;
	}
}

initDynamicRoutes(); // 先在当前文件调用一次，刷新后就不会失效了

export default router;
