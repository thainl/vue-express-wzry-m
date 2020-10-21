<template>
    <div class="main-nav-com d-flex bg-primary">
        <div class="main-nav-item flex-1 d-flex jc-center ai-center">
            <router-link
                tag="span"
                class="main-nav-item-link text-white fs-md"
                :class="{ active: $route.path == '/' }"
                to="/"
                >首页</router-link
            >
        </div>
        <div class="main-nav-item flex-1 d-flex jc-center ai-center">
            <router-link
                tag="span"
                class="main-nav-item-link text-white fs-md"
                to="/"
                >攻略中心</router-link
            >
        </div>
        <div class="main-nav-item flex-1 d-flex jc-center ai-center">
            <router-link
                tag="span"
                class="main-nav-item-link text-white fs-md"
                to="/"
                >赛事中心</router-link
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "MainNav",
};
</script>

<style lang="scss">
.main-nav-com {
    height: 42px;
    .main-nav-item {
        width: 33.3%;
        .main-nav-item-link {
            position: relative;
            margin-top: -1px;
            cursor: pointer;
            &.active::after {
                content: "";
                position: absolute;
                bottom: -3px;
                left: 0;
                height: 3px;
                width: 100%;
                background: #fff;
            }
        }
    }
}
</style>