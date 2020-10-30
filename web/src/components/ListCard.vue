<template>
    <div class="list-card bg-white" :style="{padding: `0 ${paddingXMapping[paddingXSize]}`}">
        <div v-if="!hideHead" class="card-head">
            <div class="card-head-title d-flex jc-between">
                <h3 class="fs-xl"><i class="card-head-icon spirte-1" :style="{backgroundPosition: `${iconPosX} ${iconPosY}`}"></i><slot></slot></h3>
                <router-link v-if="moreLink" :to="moreLink" class="card-head-more-link spirte-1"></router-link>
            </div>
            <div class="card-head-content"><slot name="headContent"></slot></div>
        </div>
        <div class="card-body">
            <div class="category-nav">
                <ul class="d-flex jc-between">
                    <li class="fs-md" v-for="(item, i) of list" :key="'ctf'+i" :class="{active: activeIndex === i}" @click="$refs.cardSwiper.swiper.slideTo(i)">{{ item.name }}</li>
                </ul>
            </div>
            <div class="card-swiper">
                <swiper ref="cardSwiper" :options="{ autoHeight: true }" @slide-change="()=>activeIndex = $refs.cardSwiper.swiper.realIndex">
                    <swiper-slide v-for="(n, i) of list" :key="'csi'+i">
                        <slot name="swiperItem" :category="n"></slot>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ListCard',
    props: {
        iconPosX: {
            type: String,
            default: '0px'
        },
        iconPosY: {
            type: String,
            default: '-8.92rem'
        },
        list: {
            type: Array,
        },
        moreLink: {
            type: String,
        },
        hideHead: {
            type: Boolean,
            default: false
        },
        paddingXSize: {
            type: String,
            default: 'normal',
            validator(val){
                return ['normal', 'small'].indexOf(val) !== -1;
            }
        }
    },
    data() {
        return {
            activeIndex: 0,
            paddingXMapping: {
                normal: '0.68rem',
                small: '0.4rem'
            }
        }
    },
}
</script>

<style lang="scss">
@import '../assets/scss/_variable';
.list-card {
    margin-top: 12.5px;
    .card-head {
        border-bottom: 1px solid #e9ecee;
        .card-head-title {
            position: relative;
            padding: 15px 0;
            > h3 {
                color: #212222;
                font-weight: 500;
                line-height: 19.5px;
                .card-head-icon {
                    display: inline-block;
                    height: 13px;
                    width: 13.5px;
                    margin-right: 2px;
                }
            }
            .card-head-more-link {
                display: block;
                height: 17px;
                width: 20px;
                background-position: -169px -250px;
                margin-top: 2px;
            }
        }
    }
    .card-body {
        padding-top: 12px;
        .category-nav {
            ul>li {
                position: relative;
                line-height: 24px;
                color: #343440;
                cursor: pointer;
                &.active{
                    color: map-get($color,'primary');
                    &::after {
                        content: '';
                        display: block;
                        background-color: map-get($color,'primary');
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 3px;
                    }
                }
            }
        }
        .card-swiper {
            margin-top: 17px;
            .swiper-slide {
                width: 100%;
                overflow-x: hidden;
            }
        }
    }
}
</style>