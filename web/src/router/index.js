import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: Main,
        children: [
            {
                path: "/",
                name: "Home",
                component: Home,
            },
            {
                path: "/articles/:id",
                name: "ArticleDetail",
                props: true,
                component: () => import("../views/ArticleDetail.vue"),
            },
        ],
    },
    {
        path: "/heroes/:id",
        name: "HeroDetail",
        props: true,
        component: () => import("../views/HeroDetail.vue"),
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
