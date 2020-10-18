<template>
    <div class="main">
        <div class="top-bar spirte-1 d-flex jc-between">
            <div class="logo d-flex">
                <a href="/" class="logo-img spirte-1"></a>
                <div class="logo-txt">
                    <h1 class="text-white fs-md">王者荣耀</h1>
                    <p class="text-grey-1">团队成就更多</p>
                </div>
            </div>
            <a href="##" class="download-app-link spirte-1"></a>
        </div>
		<div class="main-nav d-flex bg-primary">
            <div class="main-nav-item flex-1 d-flex jc-center ai-center"><router-link tag="span" class="main-nav-item-link text-white fs-md" :class="{active: $route.path == '/'}" to="/">首页</router-link></div>
            <div class="main-nav-item flex-1 d-flex jc-center ai-center"><router-link tag="span" class="main-nav-item-link text-white fs-md" to="/">攻略中心</router-link></div>
            <div class="main-nav-item flex-1 d-flex jc-center ai-center"><router-link tag="span" class="main-nav-item-link text-white fs-md" to="/">赛事中心</router-link></div>
        </div>
		<router-view/>
    </div>
</template>

<script>
    export default {
        name: 'Main',
    }
</script>

<style lang="scss">
.main {
    padding-top: 45px;
}
.main .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: 45px;
    background-position: 0 -357.5px;
    background-repeat: repeat-x;
    .logo {
        margin-top: 8px;
        margin-left: 17px;
        .logo-img {
            width: 30px;
            height: 30px;
            background-position: 0 -308px;
        }
        .logo-txt {
            margin-left: 10px;
            h1 {
                line-height: 17px;
            }
        }
    }
    .download-app-link {
        width: 60px;
        height: 24px;
        margin-top: 9px;
        margin-right: 16px;
        background-position: -59px -309px;
    }
}
.main .main-nav {
    height: 42px;
    .main-nav-item{
        width: 33.3%;
        .main-nav-item-link {
            position: relative;
            margin-top: -1px;
            cursor: pointer;
            &.active::after {
                content: '';
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