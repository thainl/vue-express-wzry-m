<template>
    <div class="top-bar-com spirte-1 d-flex jc-between">
            <div class="logo d-flex">
                <a href="/" class="logo-img spirte-1"></a>
                <div class="logo-txt">
                    <h1 class="text-white fs-md">王者荣耀</h1>
                    <p class="text-grey-1">团队成就更多</p>
                </div>
            </div>
            <a href="##" class="download-app-link spirte-1"></a>
        </div>
</template>

<script>
    export default {
        name: 'TopBar',
    }
</script>

<style lang="scss">
.top-bar-com {
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
</style>