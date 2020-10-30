<template>
    <div class="home">
        <div class="swiper-box">
            <swiper
                ref="homeSwiper"
                :options="swiperOptions"
            >
                <swiper-slide
                    ><img
                        class="swiper-img w-100 h-100"
                        src="https://ossweb-img.qq.com/upload/adw/image/20201010/1152bf8bae5e8a4fabf9b34fa77c736c.jpeg"
                        alt=""
                /></swiper-slide>
                <swiper-slide
                    ><img
                        class="swiper-img w-100 h-100"
                        src="https://ossweb-img.qq.com/upload/adw/image/20201010/1152bf8bae5e8a4fabf9b34fa77c736c.jpeg"
                        alt=""
                /></swiper-slide>
                <swiper-slide
                    ><img
                        class="swiper-img w-100 h-100"
                        src="https://ossweb-img.qq.com/upload/adw/image/20201010/1152bf8bae5e8a4fabf9b34fa77c736c.jpeg"
                        alt=""
                /></swiper-slide>
                <div
                    class="swiper-pagination home-swiper-pagination"
                    slot="pagination"
                ></div>
            </swiper>
        </div>
        <div class="entry-nav" :class="{ 'extend-nav': extendNav }">
            <div class="entry-nav-list-wrapper">
                <ul class="entry-nav-list bg-white clearfix">
                    <li v-for="(item, i) of entryNavList" :key="'en' + i">
                        <router-link
                            class="list-item-link text-center d-flex flex-column ai-center"
                            to="/"
                        >
                            <i :class="item.name" class="flex-1 spirte-1"></i>
                            <p class="title">{{ item.title }}</p>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div
                class="entry-nav-btn text-center bg-light"
                @click="extendNav = !extendNav"
            >
                <i class="entry-arrow spirte-1"></i>
                <span>展开</span>
            </div>
        </div>
        <ListCard class="list-card-news" :list="newsList" moreLink="/">
            新闻资讯
            <template #swiperItem="{ category }">
                <NewsListCardItem v-for="(item, i) of category.list" :key="'newli'+i" :item="item" />
            </template>
        </ListCard>
        <ListCard class="list-card-heroes" iconPosX="-6.72rem" iconPosY="-10.68rem" :list="heroList" moreLink="/hero-list">
            英雄列表
            <template #headContent>
                <div>
                    <img class="latest-hero-img w-100" src="https://ossweb-img.qq.com/upload/webplat/info/yxzj/20201009/8900984516264.jpg" alt="">
                </div>
            </template>
            <template #swiperItem="{ category }">
                <div class="hero-item-wrapper d-flex flex-wrap">
                    <HeroesListCardItem v-for="(item, i) of category.list" :key="'heri'+i" :item="item" />
                </div>
            </template>
        </ListCard>
    </div>
</template>

<script>
import ListCard from '@/components/ListCard.vue';
import NewsListCardItem from '@/components/NewsListCardItem.vue';
import HeroesListCardItem from '@/components/HeroesListCardItem.vue';
export default {
    name: "Home",
    data() {
        return {
            extendNav: false,
            swiperOptions: {
                pagination: {
                    el: ".home-swiper-pagination",
                },
                speed: 700,
                loop: true,
                autoplay: {
                    delay: 2500,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                },
            },
            entryNavList: [
                {
                    name: "blz",
                    title: "爆料站",
                },
                {
                    name: "gsz",
                    title: "故事站",
                },
                {
                    name: "zbsc",
                    title: "周边商城",
                },
                {
                    name: "tyf",
                    title: "体验服",
                },
                {
                    name: "xrzq",
                    title: "新人专区",
                },
                {
                    name: "zrcc",
                    title: "荣耀·传承",
                },
                {
                    name: "wzyd",
                    title: "王者营地",
                },
                {
                    name: "gzh",
                    title: "公众号",
                },
                {
                    name: "bbjs",
                    title: "版本介绍",
                },
                {
                    name: "djhj",
                    title: "对局环境",
                },
                {
                    name: "wxwzt",
                    title: "无限王者团",
                },
                {
                    name: "cyhdy",
                    title: "创意互动营",
                },
            ],
            
            newsList: [],
            heroList: [],
        };
    },
    methods: {
        async fetchNewsList() {
            const res = await this.$http.get('/news/list-simple');
            this.newsList = res.data;
        },
        async fetchHeroesList() {
            const res = await this.$http.get('/heroes/list-simple');
            this.heroList = res.data;
        },
    },
    created() {
        this.fetchNewsList();
        this.fetchHeroesList();
    },
    components: {
        ListCard,
        NewsListCardItem,
        HeroesListCardItem,
    },
};
</script>

<style lang="scss">
.home .swiper-box {
    height: auto;
    .swiper-pagination.home-swiper-pagination.swiper-pagination-bullets {
        text-align: right;
        padding-right: 11px;
        bottom: 11px;
        .swiper-pagination-bullet {
            opacity: 1;
            height: 8.5px;
            width: 8.5px;
            border-radius: 2px;
            background: #fff;
            margin: 0 5px;
            &.swiper-pagination-bullet-active {
                background: #4b67af;
            }
        }
    }
}
.home .entry-nav {
    .entry-nav-list-wrapper {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        margin-top: 14px;
        .entry-nav-list {
            height: 70px;
            width: 300%;
            transition: height 0.2s;
            > li {
                float: left;
                height: 70px;
                padding: 10px 0;
                width: 8.3333334%;
                .list-item-link {
                    position: relative;
                    height: 100%;
                    &::after {
                        content: "";
                        display: block;
                        position: absolute;
                        right: 1px;
                        top: 0;
                        height: 100%;
                        width: 1px;
                        background: #d4d9de;
                    }
                    .title {
                        margin-bottom: -2px;
                    }
                    i {
                        display: inline-block;
                        position: relative;
                        margin-left: -1px;
                        width: 93.75px;
                    }
                    .blz {
                        background-position: -188px -58px;
                    }
                    .gsz {
                        background-position: -282px -57px;
                    }
                    .zbsc {
                        background-position: -94px 5px;
                    }
                    .tyf {
                        background-position: 2px -57px;
                    }
                    .xrzq {
                        background-position: -282px -5px;
                    }
                    .rycc {
                        background-position: -92.5px -57px;
                    }
                    .wzyd {
                        background-position: -188px 2px;
                    }
                    .gzh {
                        background-position: 35px -410px;
                    }
                    .bbjs {
                        background-position: 33px 5px;
                        background-image: url("../assets/img/version-icon.png");
                        background-size: 27.5px;
                    }
                    .djhj {
                        background-position: 27.5px 5px;
                        background-image: url("../assets/img/djhj.png");
                        background-size: 40px;
                    }
                    .wxwzt {
                        background-position: 25px 10px;
                        background-image: url("../assets/img/wxwzt.png");
                        background-size: 45px;
                    }
                    .cyhdy {
                        background-position: 30px 0px;
                        background-image: url("../assets/img/cyhdy.png");
                        background-size: 35px;
                    }
                }
            }
        }
    }
    .entry-nav-btn {
        padding-top: 6px;
        height: 30px;
        cursor: pointer;
        .entry-arrow {
            display: inline-block;
            height: 10px;
            width: 10px;
            background-position: -141px -232px;
            transform: rotate(180deg);
            transition: transform 0.3s;
        }
        > span {
            margin-left: 4px;
            vertical-align: top;
        }
    }
    &.extend-nav {
        .entry-nav-list-wrapper .entry-nav-list {
            height: 210px;
            width: 100%;
            > li {
                width: 25%;
                &:nth-of-type(4n) {
                    .list-item-link::after {
                        background: transparent;
                    }
                }
            }
        }
        .entry-nav-btn .entry-arrow {
            transform: rotate(0deg);
        }
    }
}
.list-card-heroes {
    .hero-item-wrapper {
        margin: 0 -15px 0 -7px;
    }
    .latest-hero-img {
        display: block;
        margin-bottom: 13px;
    }
}
</style>
