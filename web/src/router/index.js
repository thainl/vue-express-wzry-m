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
        path: "/skin-carousel/:id",
        name: "SkinCarousel",
        props: true,
        component: () => import("../views/SkinCarousel.vue"),
    },
    {
        path: "/hero-one-img/:id",
        name: "HeroOneImg",
        props: true,
        component: () => import("../views/HeroOneImg.vue"),
    },
    {
        path: "/hero-list",
        name: "HeroList",
        component: () => import("../views/HeroList.vue"),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
