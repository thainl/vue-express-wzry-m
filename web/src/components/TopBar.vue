<template>
    <div
        class="top-bar-com spirte-1 d-flex jc-between"
        :class="{ 'hero-top-bar': type == 'heroDetail' }"
    >
        <div class="logo d-flex">
            <a href="/" class="logo-img spirte-1"></a>
            <div class="logo-txt d-flex flex-column jc-center">
                <h1 class="text-white fs-md">
                    王者荣耀<span v-if="type == 'heroDetail'" class="desc"
                        >攻略站</span
                    >
                </h1>
                <p class="text-grey-1">团队成就更多</p>
            </div>
        </div>
        <a href="##" v-if="showLink" class="download-app-link spirte-1"></a>
        <router-link
            to="/hero-list"
            v-if="type == 'heroDetail'"
            class="more-link text-white"
            >更多英雄<span class="fs-xl"> &gt;</span></router-link
        >
    </div>
</template>

<script>
export default {
    name: "TopBar",
    props: {
        type: {
            type: String,
        },
        showLink: {
            type: Boolean,
            default: true,
        },
    },
};
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
            height: 34px;
            h1 {
                line-height: 17px;
                .desc {
                    margin-left: 15px;
                }
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
    .more-link {
        margin-top: 11px;
        margin-right: 20px;

        span.fs-xl {
            font-weight: bold;
            vertical-align: -1px;
        }
    }
}
.hero-top-bar {
    .logo {
        .logo-txt {
            > p {
                display: none;
            }
            h1 {
                margin-top: -5px;
            }
        }
    }
    .download-app-link {
        display: none;
    }
}
</style>