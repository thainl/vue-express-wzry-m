<template>
    <div class="skin-carousel-page bg-white">
        <TopBar :showLink="false" />
        <div class="swiper-box">
            <swiper v-if="model.skins.length" :options="swiperOptions" ref="skinSwiper">
                <swiper-slide v-for="item of model.skins" :key="item._id">
                    <div class="skin-container">
                        <div class="img"><img :src="item.img" alt=""></div>
                        <span class="name">{{item.name}}</span>
                    </div>
                </swiper-slide>
                <div
                    class="swiper-pagination skin-swiper-pagination"
                    slot="pagination"
                ></div>
            </swiper>
        </div>
    </div>
</template>

<script>
import TopBar from '../components/TopBar';
export default {
    name: 'SkinCarousel',
    props: {
        id: {
            require: true
        }
    },
    data() {
        return {
            model: {
                skins: []
            },
            swiperOptions: {
                pagination: {
                    el: ".skin-swiper-pagination",
                    clickable: true
                },
                loop: true
            },
        }
    },
    computed: {
        swiper() {
            return this.$refs.skinSwiper.swiper;
        }
    },
    methods: {
        async fetch() {
            let res = await this.$http.get(`/heroes/${this.id}/skins`)
            this.model = res.data;
        }
    },
    created() {
        this.fetch();
    },
    components: {
        TopBar
    }
}
</script>

<style lang="scss">
.skin-carousel-page {
    padding-top: 50px;
    height: 100vh;
    .swiper-box {
        position: relative;
        width: 363.5px;
        margin: 0 auto;
        .skin-container {
            height: 591px;
            margin-right: 1px;
            .img{
                height: 535.5px;
                img {
                    height: 100%;
                    width: 100%;
                }
            }
            .name {
                margin-top: 17px;
                display: block;
                text-align: center;
                color: #343440;
                font-size: 13px;
                line-height: 13px;
            }
        }
    }
    .skin-swiper-pagination {
        position: absolute;
        bottom: 4px;
        .swiper-pagination-bullet {
            width: 10px;
            height: 5px;
            border-radius: 2.5px;
            margin: 0 2.5px;
            opacity: 1;
            background-color: #bababa;
            transition: all .3s;
            &.swiper-pagination-bullet-active {
                background-color: #161725;
                width: 15px;
            }
        }
    }
}
</style>